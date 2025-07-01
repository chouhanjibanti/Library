
import { cwd } from 'process';
import courseSchema from '../Models/course.model.js'
import lectureSchema from '../Models/lecture.model.js';
import { deleteMediaFromCloudinary, deleteVideoFromCloudinary, uploadMedia } from '../utils/cloudinary.js';
import fs from 'fs'


export const createCourse = async (req,res) =>{
          try {
            const { userId } = req.user     
              const { courseTitle, category, } = req.body;
              if (!courseTitle) {
                  return res.status(400).json({ message: 'Course title is required', success: false })
              }
              if (!category) {
                  return res.status(400).json({ message: 'category is required', success: false })
              }
             
              const newCourse = new courseSchema({
                courseTitle,
                category,
                creator:userId
              })
              await newCourse.save();
              res.status(201).json({ message: 'Course created successfully', success: true })
          } catch (error) {
              console.log(error,'Error while creating course');
              return res.status(500).json({ message: 'An error occurred during course creation.', success: false })
          }
}

export const getCreatorCourses = async (req,res) =>{ 
  try {
    const {userId} =req.user;
    const courses = await courseSchema.find({ creator: userId });
     if (!courses) {
        return res.status(404).json({ message: 'No courses found for this Creator', success: false })
    }
    res.status(200).json({ message: 'Courses fetched successfully', success: true, courses })
    
  } catch (error) {
    console.log(error,'An error occurred during fetching all courses');
    return res.status(500).json({ message: 'An error occurred during course fetching.', success: false })
    
  }
}

export const editCourse = async (req,res) => {
  try {
     const courseId = req.params.courseId;
     
     const {courseTitle,subTitle, description,courseLevel,category,coursePrice} = req.body;
              if (!courseTitle ||!subTitle ||!description ||!courseLevel ||!category ||!coursePrice) {
                  return res.status(400).json({ message: 'All fields are required', success: false })
              }
             
        
     const thumbnail = req?.file;
            if(!thumbnail){
              return res.status(400).json({ message: 'Thumbnail is required', success: false })
            }
        let course = await courseSchema.findById(courseId);
               if (!course) {
                 return res.status(404).json({ message: 'Course not found', success: false })
             }
             let cloudResponse;
             if(thumbnail){
               if(course?.courseThumbnail){
                 const publicId = course.courseThumbnail.split('/').pop().split(".")[0]
                 deleteMediaFromCloudinary(publicId)
                }
                   cloudResponse = await uploadMedia(thumbnail.path)
              } 
                      const photoUrl =cloudResponse?.secure_url;

                               fs.unlink(thumbnail.path, (err) => {
                                  if (err) {
                                      console.error('Error deleting file', err);
                                  } else {
                                      console.log('Temporary image deleted successfully.');
                                  }
                              });
                   const updatedData = {
                     courseTitle,
                     subTitle,
                     description,
                     courseLevel,
                     category,
                     coursePrice,
                     courseThumbnail:photoUrl}         
                              course = await courseSchema.findByIdAndUpdate(courseId, updatedData,{new :true})


              res.status(200).json({
                message: 'Course updated successfully',
                success: true,
                course
              })
  } catch (error) {
    console.log(error,'An error occurred during Editing  course');
    return res.status(500).json({ message: 'An error occurred during course editing.', success: false })
  }
}

export const getCourseById = async (req,res)=>{
       try {
            const courseId = req.params.courseId;
            const course = await courseSchema.findById(courseId);
             if (!course) {
                 return res.status(404).json({ message: 'Course not found!', success: false })
             }
             res.status(200).json({ message: 'Course fetched successfully', success: true, course })
       } catch (error) {
        console.log(error,'An error occurred during getting course by id');
        return res.status(500).json({ message: 'An error occurred during course fetching by Id.', success: false })
        
       }
}

   export const createLecture = async (req,res)=>{
    try {
      const {lectureTitle} = req.body;
      const courseId = req.params.courseId.trim();
      
           if (!lectureTitle || !courseId) {
              return res.status(400).json({ message: 'Lecture title is required', success: false })
          }
          const newLecture =  new lectureSchema({
            lectureTitle,
          })
            await newLecture.save();
            const course = await courseSchema.findById(courseId)            
             if (course) {
               course.lectures.push(newLecture._id)
               await course.save()
             }
             res.status(201).json({ message: 'Lecture created successfully', success: true, newLecture })

    } catch (error) {
      console.log(error,'An error occurred during creating lecture');
      return res.status(500).json({ message: 'An error occurred during lecture creation.', success: false })
      
    }
   }

  export const getCourseLecture = async (req,res) => {
    try {
      const courseId = req.params.courseId.trim();

          const course = await courseSchema.findById(courseId).populate("lectures")
              if (!course) {
                 return res.status(404).json({ message: 'Course not found', success: false })
             }

             res.status(200).json({ message: 'Course lectures fetched successfully', success: true, lectures:course.lectures })
    } catch (error) {
      console.log(error,'An error occurred during getting lecture');
      return res.status(500).json({ message: 'An error occurred during lecture fetching.', success: false })
      
    }
  }

  export const updateLecture = async (req, res) => {
    try {
      const lectureId = req.params.lectureId
      const courseId = req.params.courseId.trim();
      
      
        const { lectureTitle,videoInfo,isPreviewFree } = req.body;
          
        //  if (!lectureTitle ||!videoinfo ||!isPreviewFree) {
        //       return res.status(400).json({ message: 'All fields are required', success: false })
        //   }
          const lecture = await lectureSchema.findById(lectureId)
            if (!lecture) {
                 return res.status(404).json({ message: 'Lecture not found', success: false })
             }
                //  if already video url there then first remove video from cloudinary 
                if (videoInfo?.videoUrl && lecture.publicId) {
                  const publicId = lecture.publicId;
                  await deleteVideoFromCloudinary(publicId);  // Ensure this function is awaited
              }
              

            //  updatelecture
                   if(lectureTitle) lecture.lectureTitle = lectureTitle;
                   if(videoInfo?.videoUrl) lecture.videoUrl=videoInfo?.videoUrl;
                   if(videoInfo?.publicId) lecture.publicId = videoInfo?.publicId;
                   if (typeof isPreviewFree !== 'undefined') lecture.isPreviewFree = isPreviewFree;

                     
                    await lecture.save()
            //  ensure the course still has the lecture id if it was not already has 
                 const course = await courseSchema.findById(courseId)
                 if(course){
                   if(!course.lectures.includes(lecture._id)){
                     course.lectures.push(lecture._id)
                     await course.save()
                   }
                 }
            res.status(200).json({
              message: 'Lecture updated successfully',
              success: true,
              lecture

            })             

    } catch (error) {
      console.log(error,'An error occurred during updating lecture');
      return res.status(500).json({ message: 'An error occurred during lecture updating.', success: false })

    }
  }

  export const removeLeture = async (req, res) => {
    try {
         const lectureId = req.params.lectureId.trim();
     
          const lecture = await lectureSchema.findByIdAndDelete(lectureId)
                                    
               if(!lecture){
                 return res.status(404).json({ message: 'Lecture not found', success: false })
               }   
          //delete the lecture from cloudinary
          if(lecture.publicId){       
            await deleteVideoFromCloudinary(lecture.publicId)
          }    
         //delete the lecture from course 
                await courseSchema.updateOne(
                  {
                    lectures:lectureId       // find the course that contains the lecture
                  },
                  {
                    $pull: { lectures: lectureId }  // remove the lecture id from the course lectures array
                  }
                )

             res.status(200).json({ message: 'Lecture removed successfully', success: true,  })
      
    } catch (error) {
      console.log(error,'An error occurred during removing lecture');
      return res.status(500).json({ message: 'An error occurred during lecture removal.', success: false })
      
    }
  }
  
   export const getLectureById = async (req,res) => {
    try {
             const lectureId = req.params.lectureId.trim();
             
             const lecture = await lectureSchema.findById(lectureId)
              if (!lecture) {
                 return res.status(404).json({ message: 'Lecture not found', success: false })
             }
             res.status(200).json({ message: 'Lecture fetched successfully', success: true, lecture })         

    } catch (error) {
      console.log(error,'An error occurred during getting lecture by id');
      return res.status(500).json({ message: 'An error occurred during lecture fetching by Id.', success: false })
      
    }
   }

  //  publish unpublish  course logic 
  export const togglePublishCourse = async (req,res) =>{
    try { 
      const courseId = req.params.courseId.trim();
      const {publish} = req.query;

      
     
       const course = await courseSchema.findById(courseId);
       if (!course) {
        return res.status(404).json({ message: 'Course not found', success: false })
       }
      //  published status nased on the query parameter
      course.isPublished = publish ;
      await course.save();
      const statusMessage = course.isPublished ? "published" : "Unpublished";
      res.status(200).json({ message: `Course is ${statusMessage} successfully`, success: true,course})
    } catch (error) {
      console.log(error,'An error occurred during toggling course publish status');
      return res.status(500).json({ message: 'An error occurred during course publish toggling.', success: false })
      
    }
  }


   
export const getPublishedCourse = async (req,res)=>{
  try {
    const courses = await courseSchema.find({isPublished:true}).populate({path:"creator",select:"name photoUrl"})
     if (!courses) {
        return res.status(404).json({ message: 'No courses found', success: false })
    }
    res.status(200).json({ message: 'Courses fetched successfully', success: true, courses })
    
  } catch (error) {
    console.log(error,'An error occurred during fetching all courses');
    return res.status(500).json({ message: 'An error occurred during course fetching.', success: false })
    
  }
}

export const  searchCourse = async (req,res)=>{
  try {
    const { query="" ,categories=[],sortByPrice=''} = req.query;
    // create search results
      
      
     const searchCriteria = {
      isPublished:true,
      $or:[
        {courseTitle: { $regex: query, $options: 'i' }}, // regex mean a word or letter  or any character in the course than its search  //option me "i" ka mtlb ye he ki agar character milta he toh bhi $options: 'i' makes the search case-insensitive (e.g., "react" matches "React", "REACT", "rEaCt", etc.) $regex allows partial string matching (e.g., "React" matches "React Basics").
        // $options: 'i' makes it case-insensitive ("React", "react", "REACT" → all match)..
        {subTitle: { $regex: query, $options: 'i' }},
        {category: { $regex: query, $options: 'i' }}
      ]
     }
     // if categories are selected
     if(categories.length > 0){
       searchCriteria.category = { $in: categories }
     }
      // sort by price
      let sortOptions = {}
      if(sortByPrice === 'low'){
        sortOptions.coursePrice = 1
      }else if(sortByPrice === 'high'){
        sortOptions.coursePrice = -1
      }
      
    const courses = await courseSchema.find(searchCriteria).sort(sortOptions).populate({path:"creator",select:"name photoUrl"})

    res.status(200).json({ message: 'Courses fetched successfully', success: true, courses:courses || [] })
      
  } catch (error) {
    console.log(error,'An error occurred during searching course');
    return res.status(500).json({ message: 'An error occurred during course searching.', success: false })
    
  }
}