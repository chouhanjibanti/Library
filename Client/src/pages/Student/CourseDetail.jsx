import BuyCourseButton from '@/components/BuyCourseButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useGetCourseDetailWithStatusQuery } from '@/store/api/CreateCourseApi'
import axios from 'axios'
import { BadgeInfo, Lock, PlayCircle } from 'lucide-react'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
 import ReactPlayer from 'react-player'
function CourseDetail() {
    const {CourseId} =  useParams()
     const navigate = useNavigate()
     const {data,isLoading,isError} = useGetCourseDetailWithStatusQuery(CourseId)
      
    const checkOutHandler = async (CourseId) => {
        const {data:{key}} = await axios.get("https://library-2-8qze.onrender.com/api/v1/payment/getKey",{
            withCredentials: true
        })
 
         const {data:{order}} = await axios.post("https://library-2-8qze.onrender.com/api/v1/payment/checkout",{
           CourseId,
         },
         { withCredentials: true }
        )
        
        const options = {
            key: key, 
            amount: order.amount,  // Removed quotes to make it a number
            currency: "INR",
            name: "E-Learning",
            description: "Test Transaction",
            image: "https://example.com/your_logo",
            order_id: order.id,
            // callback_url: `http://localhost:8080/api/v1/payment/paymentVerificaton/${CourseId}`,
            prefill: {
                name: "Gaurav Kumar",
                email: "gaurav.kumar@example.com",
                contact: " "
            },
            notes: {
                address: "Razorpay Corporate Office"
            },
            theme: {
                color: "#3399cc"
            },
             // ✅ Use `handler` instead of `callback_url`
        handler: async function (response) {

            // 🔹 Send the response data to your backend for verification
            const verifyResponse = await axios.post(
                `https://library-2-8qze.onrender.com/api/v1/payment/paymentVerification/:CourseId`,
                {
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature
                },
                { withCredentials: true }
            );

            // 🔹 Handle the response from backend
            console.log("Backend Verification Response:", verifyResponse);

            if (verifyResponse.data.success) {                
                window.location.href = verifyResponse.data.redirectUrl
            } else {
                // alert("Payment verification failed!");
            }
        }
            
        };
        const razor = new window.Razorpay(options);
        razor.open();        
} 

if (isLoading) {
    return (
        <div className='h-screen flex justify-center items-center'>
            <h1 className='font-bold text-2xl'>Loading...</h1>
        </div>
    );
}

if (isError || !data) {
    return <h1>Failed to load Course Details</h1>;
}

const courseData = data || {}; // ✅ Prevents `undefined` error
const { course, purchased } = courseData;

if (!course) {
    return <h1>No Course Found</h1>; // ✅ Handle case when course is still missing
}

      const handelContinueCourse = () => {
        if(purchased){
            navigate(`/course-progress/${CourseId}`)
        }
      }
   return (
    <>
          <div className='mt-20 space-y-5'>
             <div className='bg-[#2D2f31] text-white'>
                 <div className='max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2'>
                      <h1 className='text-2xl md:text-3xl font-bold'>{course?.courseTitle}</h1>
                      <p className='text-base md:text-lg'>{course?.subTitle}</p>
                      <p className=''>Created By {" "} <span className='text-[#C0C4FC]'>{course?.creator?.name}</span></p>
                       <div className='text-sm flex gap-2 items-center'> 
                          <BadgeInfo size={16}/>
                          <p> Last updated {course?.createdAt.split("T")[0]}</p>
                       </div>
                       <p> Student Enrolled: {course?.enrolledStudent.length}</p>
                 </div>
             </div>
             <div className='max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10'>
                <div className='w-full lg:w-1/2 '>
                     <h1 className='font-bold text-xl md:2xl'> Description</h1>
                     <p className='text-sm' dangerouslySetInnerHTML={{__html:course?.description}}/>
                      <Card className='mt-5'>
                        <CardHeader>
                            <CardTitle>Course Content</CardTitle>
                            <CardDescription>4 Lecture</CardDescription>
                             <CardContent className='space-y-3 p-0' >
                                {
                               course?.lectures.map((lecture, index) => {
                                        return (
                                            <div key={index} className='flex items-center gap-3 text-sm'>
                                              <span>
                                                {
                                                    lecture?.isPreviewFree ? (<PlayCircle size={14}/>) : (<Lock size={14} />)
                                                }
                                              </span>
                                              <p>{lecture?.lectureTitle}</p>
                                            </div>
                                        )
                                    })
                                }
                             </CardContent>
                        </CardHeader>
                      </Card>
                </div>
                <div className=' w-full lg:w-1/3'>
                     <Card>
                         <CardContent className='p-4 flex flex-col'>
                             <div className='w-full aspect-video mb-4'>
                                   <ReactPlayer
                                    width="100%"
                                    height="100%"
                                    controls={true}
                                 
                                    url={course?.lectures[0].videoUrl}
                                   />
                             </div>
                             <h1>{course?.lectures[0].lectureTitle}</h1>
                             <Separator className='my-2'/>
                             {
                                purchased === false && <h2 className='text-lg md:text-xl font-semibold'>₹{course?.coursePrice}</h2>
                             }
                         </CardContent>
                        <CardFooter className='flex justify-center p-4'>
                            {
                                purchased? (
                                    <Button onClick={handelContinueCourse} className='w-full' >Continue Learning</Button>
                                ) : (
                                   <BuyCourseButton onClick={()=> checkOutHandler(CourseId)}/>
                                )  
                            }
                        </CardFooter>
                     </Card>
                </div>
             </div>
          </div>
    </>
  )
}

export default CourseDetail