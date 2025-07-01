import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useRegisterCourseMutation } from '@/store/api/CreateCourseApi'
import { toast } from 'sonner'
function CreateCourse() {
  
    const navigate = useNavigate() 
    const [formData,setFormData] = useState({
        courseTitle:'',
        category:''
    })
    const [registerCourse, {data,isLoading,isError,error,isSuccess}] = useRegisterCourseMutation()
     // Handle input change
     const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    // Handle category selection
    const handleCategoryChange = (value) => {
        setFormData({
            ...formData,
            category: value,
        });
    };
    
    const createCourseHandler = async ()=>{
            try {
                await registerCourse(formData)
                setFormData({
                    courseTitle:'',
                    category:''
                })
           
            } catch (error) {
                console.log(error);
                
            }
    }
    useEffect(()=>{
        if (isSuccess) {
            navigate(-1)
            toast.success(data?.message || "Course created successfully!");
        }
        if (isError) {
            toast.error(error?.data?.message || "Failed to create course");
        }

    },[isError,isSuccess,error])
  return (
    <>
         <div className='flex-1 mx-10'> 
                 
                <div className='mb-4'>
                    <h1 className='font-bold text-xl'>Let's add course, add some basic course details for your new Course.</h1>
                    <p className='text-sm '>Sint dolore ad eu ut qui quis veniam.</p>
                </div>
                <div>
                    <div className="space-y-4">
                           <Label>Title</Label>
                           <Input type="text"  name="courseTitle"
                             value={formData.courseTitle}
                             onChange={handleInputChange}
                              placeholder="Enter your course title" />
                    </div>
                    <div className="space-y-4">
                           <Label>Categoty</Label>
                           <Select value={formData.category} onValueChange={handleCategoryChange}>
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
                    <div className='flex items-center gap-2 mt-4'>
                         <Button onClick={()=> navigate(-1)} variant='outline'>back</Button>
                         <Button onClick={createCourseHandler} disabled={isLoading}>
                           {
                            isLoading ? ( 
                                <>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                                Creating...
                                </>
                            ):(
                                "Create"
                            )
                           }
                         </Button>
                    </div>
                </div>
         </div>
    </>
  )
}

export default CreateCourse