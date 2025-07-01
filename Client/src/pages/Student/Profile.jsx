import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Course from './Course'
import { useLoadUserQuery, useUpdateUserMutation } from '@/store/api/authApi'
import { toast } from 'sonner'


function Profile() {
    const  [name, setName] = useState("")
    const [profilePhoto, setprofilePhoto] = useState("")
   const {data,isLoading,refetch}  = useLoadUserQuery()
   const [updateUser,{data:updateUserData,isLoading:updateUserIsLoading,isError,error,isSuccess} ] =useUpdateUserMutation()
     
    const changeHandler = (e) => {
          const file = e.target.files?.[0]     
          if(file) setprofilePhoto(file)
    }
    
    const updateUserHandler = async ()=>{
          const formData = new FormData()
          formData.append('name', name)
          formData.append('profilePhoto', profilePhoto)
          await updateUser(formData)
    }
    //      useEffect(()=>{
    //         refetch()
    // },[])
    useEffect(()=>{        
          if(isSuccess){
            // refetch()
           toast.success(updateUserData.message || "Profile Updated")          
          }
          if(isError){
           toast.error(error.message || "Error Updating Profile")          
          }
    },[isError,isSuccess,updateUserData,error])
    if (isLoading) {
        return<div className='h-full w-full flex items-center justify-center text-black'> <h1><Loader2/> Loading.....</h1></div>
     }
     
    //  const user = data?.user || []
    const  user  = data && data?.user
        
         
  return (
    <>
        <div className=' max-w-screen-xl mx-auto px-4 my-24'>
                  <h1 className='text-2xl font-bold text-center md:text-left uppercase'>profile</h1>
                <div className='flex flex-col md:flex-row items-center md:items-start gap-8 my-5'>
                     <div className='flex flex-col items-center '>
                        <Avatar className='h-24 w-24 md:h-32 md:w-32 mb-4'>
                             <AvatarImage src={user?.photoUrl   || "https://github.com/shadcn.png"} />
                             <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                     </div>
                     <div>
                        <div className='mb-2'>
                            <h2 className='font-semibold to-gray-900 dark:text-gray-100 text-2xl'>
                                Name: <span className='font-normal text-gray-700 dark:text-gray-300 ml-2'> {user?.name}</span>
                            </h2>
                        </div>
                        <div className='mb-2'>
                            <h2 className='font-semibold to-gray-900 dark:text-gray-100 text-xl'>
                                Email: <span className='font-normal text-gray-700 dark:text-gray-300 ml-2'> {user?.email}</span>
                            </h2>
                        </div>
                        <div className='mb-2'>
                            <h2 className='font-semibold to-gray-900 dark:text-gray-100 text-2xl'>
                                Role: <span className='font-normal text-gray-700 dark:text-gray-300 ml-2'>{user?.role}</span>
                            </h2>
                        </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button size='sm' className='mt-2'>Edit Profile</Button>
                            </DialogTrigger>
                            <DialogContent>
                               <DialogHeader>
                                  <DialogTitle>Edit Profile</DialogTitle>
                                  <DialogDescription asChild>
                                    <p>Here you can edit your profile information</p>
                                  </DialogDescription>
                               </DialogHeader>
                               <div className='py-4'>
                                      <div className='grid grid-cols-4 items-center gap-4 mb-4'>
                                         <Label>Name:</Label>
                                         <Input type='text' placeholder='Name' className='col-span-3' value={name}
                                            onChange={(e)=>setName(e.target.value)}
                                         />
                                      </div>
                                      <div className='grid grid-cols-4 items-center gap-4'>
                                         <Label>Profile Photo:</Label>
                                         <Input type='file' accept='image/*'  className='col-span-3' onChange={changeHandler}/>
                                      </div>
                                 </div>
                                 <DialogFooter>
                                     <Button disabled={updateUserIsLoading} onClick={updateUserHandler}>
                                    {
                                        updateUserIsLoading ?(
                                           <>

                                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />Saving...
                                           </>
                                        ):("Save changes")
                                    }
                                     </Button>
                                 </DialogFooter>
                            </DialogContent>
                        </Dialog>
                     </div>
                     
                </div>
                   <div>
                        <h2 className='font-medium text-lg'>Courses You'r enrolled in </h2>
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5'>
                                  {
                                    user?.enrolledCourses.length === 0 ? <h2>You haven't enrolled yet</h2> :(
                                        user?.enrolledCourses.map((course, index) => (
                                            <Course course={course} key={course._id}/>
                                        ))
                                    )
                                  } 
                       </div> 
                   </div>
        </div>
    </>
  )
}

export default Profile