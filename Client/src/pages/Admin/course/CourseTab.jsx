import RichTextEditor from '@/components/RichTextEditor'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEditCourseMutation, useGetCourseByIdQuery, usePublishCourseMutation } from '@/store/api/CreateCourseApi'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

function CourseTab({CourseId}) {
    const navigate = useNavigate()
    const [editCourse,{isError,error,isSuccess,isLoading,data}] = useEditCourseMutation()

    const [previewThumbnail,setPreviewThumbnail] = useState("")

    const [input, setInput] = useState({
        courseTitle: '',
        subTitle: '',
        description: '',
        courseLevel: '',
        courseThumbnail: '',
         category: '',
         coursePrice:'',
    })
       
    
   const changeEventHandler = (e)=>{
        setInput({...input,[e.target.name]:e.target.value})
    }
    const handleCategoryChange = (value)=>{
        setInput({...input,category:value})
    }
    const handleLevelChange = (value)=>{
        setInput({...input,courseLevel:value})
    }
    const SelectThumbnail=(e)=>{
        const file=e.target.files?.[0]
        if(file) setInput({...input,courseThumbnail:file})
         const fileReader =  new FileReader();
        fileReader.onloadend = (e) => {
           setPreviewThumbnail(fileReader.result)
        }; 
        fileReader.readAsDataURL(file);
    }
    const submitHandler = async (e)=>{
        e.preventDefault()
        const formData = new FormData();
          formData.append('courseTitle', input.courseTitle)
          formData.append('subTitle', input.subTitle)
          formData.append('description', input.description)
          formData.append('courseLevel', input.courseLevel)
          formData.append('courseThumbnail', input.courseThumbnail)
          formData.append('category', input.category)
          formData.append('coursePrice', input.coursePrice)

          await editCourse({formData, CourseId})
    }   
            useEffect(()=>{
                 if(isSuccess){
                    toast.success(data?.message || "Course Updated Successfullyyy")
                 }
                 if(isError){
                    toast.error(error?.data?.message || "Failed to update course")
                 }
            },[error,isSuccess,data,isError])
       
             const  {data:getCourseData ,isLoading:getCourseisLoading} =  useGetCourseByIdQuery(CourseId)
             
             const course = getCourseData?.course
             
           useEffect(()=>{
            if(course){
              setInput({
                courseTitle: course.courseTitle,
                subTitle: course.subTitle,
                description: course.description,
                courseLevel: course.courseLevel,
                courseThumbnail: "",
                category: course.category,
                coursePrice: course.coursePrice,
              })
            }
           },[course,getCourseData])
             
         const [publishCourse] =  usePublishCourseMutation()
             const publishStatusHandler = async(action)=>{
                 
                  try {
                    const response = await publishCourse({CourseId,query:action})
                    if(response){
                       toast.success(response.data.message)
                    }
                  } catch (error) {
                     toast.error(error.message)
                  }
             }

            if(getCourseisLoading) return <>
              <div className='h-screen w-full flex items-center justify-center'>
              <div className='flex gap-2'><Loader2 className='h-14 w-14  animate-spin'/> Loading....</div>
              </div>
            </>
  return (
    <>
           <div className=''>
                <Card>
                    <CardHeader className='flex flex-row justify-between items-center'>
                        <div>
                            <CardTitle>Basic Course information.</CardTitle>
                            <CardDescription>Make changes to the course information.</CardDescription>
                        </div>
                        <div className='flex gap-2'>
                            <Button size="sm" variant="outline" disabled={course?.lectures?.length === 0}  onClick={()=> publishStatusHandler(course.isPublished ? "false" : "true")}>
                               {
                                course?.isPublished ? 'Unpublish' : 'Publish'
                               }
                            </Button>
                            <Button>Remove Course</Button>
                        </div>

                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-2 mt-5">
                             <div>
                                <Label>Title:</Label>
                                <Input type='text' placeholder='Ex. FullStack Developer' name='courseTitle'
                                  value={input.courseTitle}
                                  onChange={changeEventHandler}

                                ></Input>
                             </div>
                             <div>
                                <Label>Subtitle:</Label>
                                <Input type='text' placeholder='Become a FullStack Developer' name='subTitle'
                                  value={input.subTitle}
                                  onChange={changeEventHandler}
                                ></Input>
                             </div>
                             <div>
                                <Label>Description:</Label>
                                 <RichTextEditor  input={input} setInput={setInput} />
                             </div>
                                <div className='flex items-center gap-5 '>
                                   <div>
                                            <Label>Category:</Label>
                                            <Select value={input.category} onValueChange={handleCategoryChange}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                <SelectLabel>Category</SelectLabel>
                                                <SelectItem value="Next JS">Next JS</SelectItem>
                                                    <SelectItem value="Data Science">Data Science</SelectItem>
                                                    <SelectItem value="Frontend Development"> Frontend Development</SelectItem>
                                                    <SelectItem value="Fullstack Development"> Fullstack Development</SelectItem>
                                                    <SelectItem value="MERN Stack Development"> MERN Stack Development</SelectItem>
                                                    <SelectItem value="Javascript">Javascript</SelectItem>
                                                    <SelectItem value="Python">Python</SelectItem>
                                                    <SelectItem value="Docker">Docker</SelectItem>
                                                    <SelectItem value="MongoDB">MongoDB</SelectItem>
                                                    <SelectItem value="HTML">HTML</SelectItem>
                                                    <SelectItem value="CSS">CSS</SelectItem>
                                                    
                                                </SelectGroup>
                                            </SelectContent>
                                            </Select>
                                   </div>
                                    <div>
                                            <Label>Course Level:</Label>
                                            <Select value={input.courseLevel} onValueChange={handleLevelChange}>
                                                    <SelectTrigger className="w-[180px]">
                                                        <SelectValue placeholder="Select a Level" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                        <SelectLabel>Category</SelectLabel>
                                                        <SelectItem value="Advance">Advance</SelectItem>
                                                            <SelectItem value="Medium">Medium</SelectItem>
                                                            <SelectItem value="Beginner">Beginner</SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                            </Select>
                                   </div>
                                   <div>
                                        <Label> Price in (INR)</Label>
                                        <Input type='number' className='w-fit' placeholder="XXXX0" value={input.coursePrice} name="coursePrice" onChange={changeEventHandler}/>
                                   </div>
                                  
                                </div>
                                   <div className='mt-2'>
                                     <Label>Course Thumbnail:</Label>
                                     <Input type='file' accept='image/*'  name='courseThumbnail'
                                          onChange={SelectThumbnail}
                                     />
                                      {
                                        previewThumbnail &&
                                        <img src={previewThumbnail} alt="thumbnail" className='h-[250px] w-[250px] my-2 ' />
                                      }
                                   </div>
                                   <div className='flex items-center gap-2'>
                                          <Button onClick={()=> navigate(-1)} variant='outline'>Cancle</Button>
                                          <Button disabled={isLoading} onClick={(e)=> submitHandler(e)}>
                                             {
                                                isLoading ? (<>
                                                <Loader2 className='mr-1 h-4 w-4 animate-spin'/>
                                                Uploading......
                                              </>):(
                                                "Upload"
                                              )
                                             }
                                          </Button>
                                   </div>
                              
                        </div>
                    </CardContent>
                </Card>
           </div>
    </>
  )
}

export default CourseTab