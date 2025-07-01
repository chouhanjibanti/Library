import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useCompleteCourseMutation, useGetCourseProgressQuery, useInCompleteCourseMutation, useUpdateLectureProgressMutation } from "@/store/api/courseProgressApi";
import { login } from "@/store/slices/authSlice";
import { CheckCircle, CheckCircle2, CirclePlay } from "lucide-react";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

function CourseProgress() {
       const {CourseId} = useParams();
           
        const {data, isLoading, isError, refetch} =useGetCourseProgressQuery(CourseId)    
       const  [updateLectureProgress] = useUpdateLectureProgressMutation()
       const  [completeCourse,{data:markCompleteData,isSuccess:completedSuccess}] = useCompleteCourseMutation()
       const  [inCompleteCourse,{data:markInCompleteData,isSuccess:inCompletedSuccess}] = useInCompleteCourseMutation()
       useEffect(()=>{
          if(completedSuccess){
            toast.success(markCompleteData.message)
          }
       },[completedSuccess])
       useEffect(()=>{
        if(inCompletedSuccess){
          toast.success(markInCompleteData.message)
        }
        },[inCompletedSuccess])
       
       const [currentLecture, setCurrentLecture]  = useState(null)
        if(isLoading) return <>
              <div className='flex justify-center items-center h-screen'>
                  <CirclePlay size={64} className='animate-spin text-5xl text-gray-500'/>
              </div>
             </>
        if(isError || !data) return <div>Failed to load data</div>
        const {courseDetails,progress,completed} = data.data || {};                          
        const {courseTitle} = courseDetails || {};
         
        const initialLecture = currentLecture || courseDetails?.lectures && courseDetails?.lectures[0];
                  
                  
    const isLectureCompleted = (lectureId) => {
      return progress.some((prog)=> prog.lectureId === lectureId && prog.viewed)
    }

    
    // handel click on specific lecture 
    const handleLectureProgress = async (lectureId) =>{
        await updateLectureProgress({courseId:CourseId,lectureId})
        refetch()
    }
    const handleSelectLecture= ( lecture) =>{
      setCurrentLecture(lecture)
    }
    const handleCompleteCourse = async () =>{      
        await completeCourse(CourseId)
        refetch()
    }
    const handleInCompleteCourse = async () =>{
        await inCompleteCourse(CourseId)
        refetch()
    }
     

  return (
    <>
      <div className="max-w-7xl mx-auto p-4 mt-20 ">
        {/* Display Course name */}   
        <div className="flex justify-between mb-4"> 
          <h1 className="text-2xl font-bold">{courseTitle}</h1>
          <Button className='transition delay-150 duration-300 ease-in-out' variant={completed ? "outline" : "default"}  onClick={completed?handleInCompleteCourse : handleCompleteCourse}>{completed ? <div className="flex items-center"> <CheckCircle className="h-4 w-4 mr-2"/> <span>Completed</span></div> : "Mark as completed"}</Button>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
            {/* video section */}
             <div className="flex-1   md:w-3/5 h-fit rounded-lg shadow-lg p-4">
                   <div>
                    {/* <video/> */}
                     <video
                          className="w-full h-auto md:rounded-lg"
                        controls
                        src={currentLecture?.videoUrl || initialLecture?.videoUrl }
                        onPlay={()=>handleLectureProgress(currentLecture?._id || initialLecture?._id)}
                     />
                   </div>
                    {/* display current lecutre title  */}
                    <div className="mt-2">
                        <h3 className="font-medium text-lg"> {
                          `lecture ${courseDetails.lectures.findIndex((lec)=>lec._id === (currentLecture?._id || initialLecture?._id))+ 1} : ${currentLecture?.lectureTitle || initialLecture?.lectureTitle}`
                        }</h3>
                    </div>
             </div>
                {/* display video  side bar */}
             <div className="flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0">
                     <h2 className="font-semibold text-xl mb-4">Course Lecture</h2>
                     <div className="flex-1 overflow-y-auto">
                       {
                        /* display all lectures */
                        courseDetails?.lectures.map((lecture)=>{
                            return(
                                <Card key={lecture?._id} 
                                onClick={() => handleSelectLecture(lecture)}
                                className={`mb-3 hover:cursor-pointer transition-all  transform ${lecture?._id === currentLecture?._id ? 'bg-gray-200 dark:bg-gray-800' : '' } `}>
                                       <CardContent className='flex items-center justify-between p-4'>
                                          <div className="flex items-center">
                                             {
                                              isLectureCompleted(lecture._id) ? <CheckCircle2 size={24} className="text-green-500 mr-2"/> : <CirclePlay size={24} className="text-gray-500 mr-2"/>
                                             }
                                             <div>
                                                <CardTitle className='text-lg font-medium' >{lecture?.lectureTitle}</CardTitle>
                                             </div>
                                          </div>   
                                          {
                                              isLectureCompleted(lecture._id) && <Badge className='bg-green-200 text-green-600' variant='outline'>
                                                  Completed
                                              </Badge>
                                          }
                                          
                                       </CardContent>
                                </Card>
                            )
                        })
                       }
                     </div>
             </div>
             
        </div>
      </div>
    </>
  );
}

export default CourseProgress;
