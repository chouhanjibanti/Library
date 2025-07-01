import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow, } from '@/components/ui/table'
import { useGetCreatorCoursesQuery } from '@/store/api/CreateCourseApi'
import { Edit, Edit2, Loader2 } from 'lucide-react'
import React, { useEffect } from 'react'
import {  useNavigate } from 'react-router-dom'

const CourseTable = () => {
    const navigate = useNavigate()
    const {data,isError,isSuccess,error,isLoading,refetch} = useGetCreatorCoursesQuery()
       
    // useEffect(()=>{
    //    refetch()
   
    // },[data,isError,isSuccess])
    if(isLoading) return <>
    <div className='h-screen w-full flex items-center justify-center'>
     <div className='flex items-center justify-center flex-col gap-2'><Loader2 className='h-14 w-14  animate-spin'/> Loading Please wait....</div>
    </div>
  </>
  return (
    <>
        <div>
            <Button onClick={()=>navigate('create')}>Create a new Course</Button>
            <Table className='mt-4'>
              <TableCaption>A list of your recent Courses.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Price</TableHead>
                  <TableHead>Title </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                  {
                      data?.courses?.map((course)=>{
                          return(
                              <TableRow key={course?._id}>
                                <TableCell>{course?.coursePrice || "NA"}₹</TableCell>
                                <TableCell className="font-medium">{course?.courseTitle}</TableCell>
                                <TableCell>{course?.isPublished ? <Badge>Published</Badge>: <Badge>Draft</Badge>}</TableCell>
                                <TableCell className="text-right">{<Button size='sm' variant='ghost' onClick={()=> navigate(`/admin/course/edit/${course?._id} `)} ><Edit/></Button>}</TableCell>
                             </TableRow>
                          )
                      })
                  }
              </TableBody>
      
    </Table>
        </div>
    </>
  )
}

export default CourseTable