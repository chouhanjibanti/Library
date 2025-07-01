import React, { useState } from 'react'
import Filter from './Filter'
import { Skeleton } from '@/components/ui/skeleton'
import Course from './Course'
import SearchResult from './SearchResult'
import { useGetSearchCoursesQuery } from '@/store/api/CreateCourseApi'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

function SearchPage() {
    const [searchParams] = useSearchParams()
    const query = searchParams.get('query')
    const [selectedCategories, setSelectedCategories] = useState([])
    const [sortByPrice, setSortByprice] = useState('')
    const handelFilterChange = (categories,price)=>{
        setSelectedCategories(categories)
       setSortByprice(price)    
   }
    const {data,isLoading} = useGetSearchCoursesQuery({
        searchQuery:query,
        categories: selectedCategories,
        sortByPrice,
    })
    const isEmpty = !isLoading && data?.courses.length === 0;
    
  return (
     <>
         <div className='max-w-7xl mx-auto p-4 md:p-8 mt-8'> 
           <div className='my-6'>
              <h1 className='font-bold text-xl md:text-2xl'>result for "{query}"</h1>
              <p>Showing Result for {" "}
               <span className='text-blue-800 font-bold italic'> {query}</span>
              </p> 
           </div>
           <div className='flex flex-col md:flex-row gap-10 '>
                 
                  <Filter handelFilterChange={handelFilterChange}/>
                  <div className='flex-1'>
                     {/* Search Result */}
                     {
                        isLoading ? Array.from({length:3}).map((_,index)=> <CourseSkeleton key={index}/>) : 
                        isEmpty? <CourseNotFound/> : (
                            data?.courses.map((course) => <SearchResult course={course} key={course._id}/>)
                        )
                     }   
                  </div>
           </div>
         </div>
     </>
  )
}

export default SearchPage


const CourseSkeleton = () => {
    return (
         <div className='bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden'>
             <Skeleton className='w-full h-36'/>
             <div className='px-5 py-4 space-y-3'>
                   <Skeleton className='h-6 w-3/4'/>
                 <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                               <Skeleton className='h-6 w-6 rounded-full'/>
                               <Skeleton className='h-4 w-20'/>
                        </div>
                            <Skeleton className='h-6 w-16'/>
                 </div>
                 <Skeleton className='h-4 w-1/4'/>
             </div>
         </div>
    )
}

const CourseNotFound = () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-32 dark:bg-gray-900 p-6">
        <AlertCircle className="text-red-500 h-16 w-16 mb-4" />
        <h1 className="font-bold text-2xl md:text-4xl text-gray-800 dark:text-gray-200 mb-2">
          Course Not Found
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
          Sorry, we couldn't find the course you're looking for.
        </p>
        <Link to="/" className="italic">
          <Button variant="link">Browse All Courses</Button>
        </Link>
      </div>
    );
  };