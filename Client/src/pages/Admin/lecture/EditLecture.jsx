import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Lecturetab from './Lecturetab'

function EditLecture() {
    const navigate =useNavigate()
  return (
    <>
     <div className='flex flex-col md:h-0 min-h-screen justify-center md:block'>
           <div className='flex items-center justify-between mb-5'>
                <div className='flex items-center gap-2'>
                    <Link onClick={()=>{navigate(-1)}}>
                        <Button size='icon' variant='outline' className='rounded-full' >
                            <ArrowLeft size={16}/>
                        </Button>
                    </Link>   
                    <h1 className='font-bold text-xl'>
                        Update Your Lecture
                    </h1>
                </div>
            </div>
            <Lecturetab/>
     </div>
        
    </>
  )
}

export default EditLecture