import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function HeroSection() {
  const  [searchQuery, SetsearchQuery] = useState("")
  const navigate = useNavigate()
  const searchHandler = (e) => {
    e.preventDefault()
    if(searchQuery.trim().length === 0) return
    navigate(`/course/search?query=${searchQuery.trim()}`)
    SetsearchQuery('')
  }
  return (
    <>
           <div className='relative bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-gray-800 dark:to-gray-900 py-16 px-4 text-center flex flex-col mt-20'>
                <div className='max-w-screen-xl mx-auto'>
                        <h1 className='text-white text-4xl font-bold mb-4'>Find the Best Courses You</h1>
                        <p className='text-gray-200 dark:text-gray-400 mb-8'>
                            Discover the best courses for your needs
                        </p>
                        <form onSubmit={searchHandler} className='flex items-center bg-white dark:bg-gray-800 rounded-full shadow-lg overflow-hidden'>
                            <Input type="text" placeholder="Search Your courses here"
                             value={searchQuery}
                             onChange={(e) => SetsearchQuery(e.target.value)}
                             className="  flex-grow border-none focus-visible:ring-0 px-6 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500  "/>
                             <Button className='  bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-r-full hover:bg-blue-700 dark:hover:bg-blue-800'>
                                     Search
                             </Button>
                        </form>
                        <Button onClick={()=> navigate(`/course/search?query`)} className='mt-8 bg-white dark:bg-gray-800 text-blue-600 rounded-full hover:bg-gray-200'>Explore Courses
                        </Button>
                </div>
           </div>
    </>
  )
}

export default HeroSection