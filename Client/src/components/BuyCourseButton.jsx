
import React from 'react'
import { Button } from './ui/button'

function BuyCourseButton({onClick}) {
  return (
    <>
        <Button
        onClick={onClick} className='w-full'>Enroll Now</Button>
    </>
  )
}

export default BuyCourseButton