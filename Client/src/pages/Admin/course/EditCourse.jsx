import { Button } from '@/components/ui/button'
import React from 'react'
import { Link, useParams } from 'react-router-dom'
import CourseTab from './CourseTab';

function EditCourse() {
    const{CourseId}=useParams()
        
  return (
    <>
           <div className='flex-1 '>
               <div className='flex items-center justify-between mb-5'>
                  <h1 className='font-bold text-xl'>
                    Add Detail information regarding your course
                  </h1>
                  <Link to='lecture'><Button className='hover:text-blue-600' variant="link">Go to lecture Page</Button></Link>
               </div>
                <CourseTab CourseId={CourseId} />
           </div>
    </>
  )
}

export default EditCourse