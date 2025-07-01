import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent,  } from '@/components/ui/card'
import { motion } from "motion/react"
import { NavLink } from 'react-router-dom'
function Course({ course}) {
  
    
  return (
    <>
           <NavLink to={`/course-detail/${course._id}`}>
           <motion.div 
            //  initial={{ opacity: 0, y: 100 }}
            //  animate={{ opacity: 1, y: 0 }}
            //  transition={{ duration: 0.5, type: 'inOut' }}
                 className='transform hover:scale-105 transition-all duration-300'>
               <Card className='overflow-hidden rounded-lg dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl '>
                     <div className='relative '>
                           <img loading='lazy' src={course?.courseThumbnail || "https://placehold.co/600x400"} alt='Course Image' className='w-full h-36 object-cover rounded-t-lg'/>
                     </div>
                     <CardContent className='px-5 py-4 space-y-3'>
                         <h1 className='hover:underline font-bold text-lg truncate '>{course?.courseTitle}</h1>
                            <div className='flex items-center justify-between'>
                                 <div className='flex items-center gap-3'>
                                     <Avatar className='h-8 w-8 rounded-full'>
                                        <AvatarImage src={course?.creator?.photoUrl || "https://placehold.co/600x400"  } />
                                        <AvatarFallback>CN</AvatarFallback>
                                     </Avatar>
                                     <h1 className='font-medium text-sm'>{course?.creator?.name}</h1>
                                 </div>
                                 <Badge className='bg-blue-600 text-white px-2 py-1 text-xs rounded-full' variant="outline">{course?.courseLevel}</Badge>
                            </div>
                            <div className='text-lg font-bold'>
                                <span >₹{course?.coursePrice}</span>
                            </div>
                     </CardContent>
               </Card>
            </motion.div>
           </NavLink>
    </>
  )
}

export default Course       