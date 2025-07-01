import Course from "../Models/course.model.js";
import {courseProgress} from "../Models/courseProgres.model.js"

export const getCourseProgress = async (req, res) => {
    try {
        const {CourseId} = req.params
        const {userId} = req.user
        

        //   step-1 fetch the user course progress
        let courseProgresss = await courseProgress.findOne({userId:userId,courseId:CourseId}).populate('courseId')
           const courseDetails = await Course.findById(CourseId).populate('lectures')
           if (!courseDetails) {
            return res.status(404).json({ message: 'Course not found or user does not have access to this course.', success: false })
        }
        
        // step-2 if no progress found , return the course details with an empty progress
        if(!courseProgresss){
            return res.status(200).json({ message: 'Course progress fetched successfully',
                success: false,
                 data: {
                      courseDetails,
                      progress: [],
                      completed: false
                      }
         })
        }
        // step-3 if progress found, return the course details with progress
        return res.status(200).json({ message: 'Course progress fetched successfully',
            success: true,
             data: {
                  courseDetails,
                  progress: courseProgresss.lectureProgress,
                  completed: courseProgresss.completed
                  }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
             message: 'An error occurred during fetching course progress.', success: false })
        
    }
}

export const updateLectureProgress = async (req, res) => {
    try {
        const {CourseId,LectureId} = req.params
     
        
        const {userId} = req.user
        
        // step-1 fetch the user course progress
        let courseProgresss = await courseProgress.findOne({userId:userId,courseId:CourseId})
        if (!courseProgresss) {

            // if no progress exists
            // create a new progress
            courseProgresss =  new courseProgress({
                userId,
                courseId:CourseId,
                completed: false,
                lectureProgress: []
            })
        }
        // step-2  find the lecture progress in the course progress
        const lectureIndex = courseProgresss.lectureProgress.findIndex(lec => lec.lectureId === LectureId)
                 if(lectureIndex !== -1){
                    // if lecture already exists, update the progress /update its progress
                    courseProgresss.lectureProgress[lectureIndex].viewed = true
                 }else{
                    // if lecture does not exist, add the lecture to the progress
                    courseProgresss.lectureProgress.push({lectureId:LectureId,viewed:true})
                 }
                //  if all lecture is complete 
                 const lectureProgressLength = courseProgresss.lectureProgress.filter((lectureProg) => lectureProg.viewed).length
               
                  const course = await Course.findById(CourseId)
                  if(lectureProgressLength === course.lectures.length){
                     courseProgresss.completed = true;
                    }
                    // step-3 save the progress
                    await courseProgresss.save();
                    return res.status(200).json({ message: 'Lecture progress updated successfully', success: true })
             
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred during updating lecture progress.', success: false })
        
    }
}

export const markAsCompleted = async (req, res) => {
    try {
        const {CourseId} = req.params
        const {userId} = req.user
        
        
        const courseProgresss = await courseProgress.findOne({userId:userId,courseId:CourseId})
        if (!courseProgresss) {
            return res.status(404).json({ message: 'Course progress not found', success: false })
        }

        courseProgresss.lectureProgress.map((lectureProgress)=>{lectureProgress.viewed = true})
        courseProgresss.completed = true
        await courseProgresss.save()
        return res.status(200).json({ message: 'Course marked as completed successfully', success: true })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred during marking course as completed.', success: false })
        
    }
}


export const markAsIncompletedCompleted = async (req, res) => {
    try {
        const {CourseId} = req.params
        const {userId} = req.user

        
        const courseProgresss = await courseProgress.findOne({userId:userId,courseId:CourseId})
        if (!courseProgresss) {
            return res.status(404).json({ message: 'Course progress not found', success: false })
        }

        courseProgresss.lectureProgress.map((lectureProgress)=>{lectureProgress.viewed = false})
        courseProgresss.completed = false
        await courseProgresss.save()
        return res.status(200).json({ message: 'Course marked as Incomplete successfully', success: true })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred during marking course as Incompleted.', success: false })
        
    }
}