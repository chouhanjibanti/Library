import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCreateLectureMutation, useGetCourseLectureQuery } from '@/store/api/CreateCourseApi'
import { toast } from 'sonner'
import Lecture from './Lecture'

function CreateLecture() {
    const  {CourseId} = useParams()


         const [createLecture,{data,isLoading,isSuccess,isError,error}] = useCreateLectureMutation()
const [formData,setFormData] = useState({
        lectureTitle:'',
    })
   const navigate = useNavigate()

   const handleInputChange = (e) => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value,
    });
};
const createLectureHandler = async (e) => {
    e.preventDefault()
    await createLecture({formData,CourseId})
    setFormData({
        lectureTitle:'',
    })
}
useEffect(()=>{
    if(isSuccess){
        toast.success(data?.message)
    }
    if(isError){
        toast.error(error?.data?.message)
    }
},[isSuccess,isError])
const {data:getLectureData,isSuccess:getlectureSuccess,isLoading:getLectureLoading,isError:getLectureError} = useGetCourseLectureQuery(CourseId)

    
  return (
                <div className='flex-1 mt-20 md:mt-0 md:mx-10'> 
                 
                    <div className='mb-4'>
                        <h1 className='font-bold text-xl'>Let's add lecture, add some basic details for your new lecture.</h1>
                        <p className='text-sm '>Sint dolore ad eu ut qui quis veniam.</p>
                    </div>
                    <div>
                        <div className="space-y-4">
                            <Label>Title</Label>
                            <Input type="text"  name="lectureTitle"
                                value={formData.lectureTitle}
                                onChange={handleInputChange}
                                placeholder="Enter your course title" />
                        </div>
                    
                        <div className='flex items-center gap-2 mt-4'>
                            <Button onClick={()=> navigate(-1)} variant='outline'>back to course</Button>
                            <Button  onClick={(e)=>createLectureHandler(e)} disabled={isLoading}>
                            {
                                isLoading ? ( 
                                    <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                                    Creating lecture...
                                    </>
                                ):(
                                    "Create lecture"
                                )
                            }
                            </Button>
                        </div>
                          <div className='mt-10'>
                              {
                                getLectureLoading ? (<p>Loading lecture....</p>):getLectureError ? (<p>error loading lecture</p>):
                                getLectureData?.lectures.length === 0 ? <p>No lecture available</p> :getLectureData?.lectures.map(
                                    (lecture, index) => (
                                        <Lecture key={lecture._id} lecture={lecture} CourseId={CourseId} index={index} />
                                    )
                                )
                              }
                          </div>
                    </div>
                </div>
  )
}

export default CreateLecture