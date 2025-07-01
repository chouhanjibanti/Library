import React from 'react'
import Course from './Course'
import { useSelector } from 'react-redux'
import { useLoadUserQuery } from '@/store/api/authApi'


function Mylearning() {
   const {data ,isLoading} = useLoadUserQuery()
    const Mylearning = data?.user?.enrolledCourses || []
    
  return (
    <>
        <div className='mx-auto max-w-screen-xl my-24 p-4'>
                 <h1 className='font-bold text-2xl'>MY LEARNING</h1>
                 <div className='my-5'>
                     {
                    isLoading ? <MyLearningSkeleton/> : Mylearning.length === 0 ? (<p>You are Not Enrolled in any Courses</p>) : (
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                            {
                             Mylearning.map((course)=> <Course course={course} key={course._id}/>)
                            }
                        </div>
                    )
                     } 
                 </div>
        </div>
    </>
  )
}

export default Mylearning

const MyLearningSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {[...Array(3)].map((_, index) => (
      <div
        key={index}
        className="bg-gray-300 dark:bg-gray-700 rounded-lg h-40 animate-pulse"
      ></div>
    ))}
  </div>
);