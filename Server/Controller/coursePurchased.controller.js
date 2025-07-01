import courseSchema from '../Models/course.model.js'
import CoursePurchaseSchema from '../Models/purchaseCourse.model.js';
import lectureSchema from '../Models/lecture.model.js';
import userSchema from '../Models/user.model.js'
import {instance} from '../server.js'
import crypto from 'crypto'


export const createCheckoutSession = async (req, res) =>{

    try {
             const {userId} = req.user            
            
             const {CourseId} = req.body       
                            
             const course = await courseSchema.findById(CourseId)

             if (!course) {
                 return res.status(404).json({ message: 'Course not found', success: false })
             }

            //  check if the user has pending payments
              
             const existingPayment = await CoursePurchaseSchema.findOne({
                 userId: userId,
                 courseId: CourseId,
                 status: "pending"
             })


            //  create a new Course purchase record
                if(!existingPayment){
                    const newPurchase = new CoursePurchaseSchema({
                        courseId: CourseId,
                        userId: userId,
                        amount: course.coursePrice,
                        status:"pending"
                    })
                    await newPurchase.save()
                }
             
             const options = {
                amount: course.coursePrice * 100,
                currency:"INR"
             }
             const order = await instance.orders.create(options)
              res.status(200).json({
                message:  "Purchase",
                success: true,
                order
              })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred during checkout session creation.', success: false })
        
    }

}

export const paymentVerification = async (req, res) => {
    try {
        const {  razorpay_payment_id,razorpay_order_id,razorpay_signature} =req.body
        const {userId} = req.user     
        const CourseId = req.params.CourseId
        
        
        
  // 🔹 Step 1: Concatenate `order_id` & `payment_id`
  const generated_signature = `${razorpay_order_id}|${razorpay_payment_id}`;
      
        
  // 🔹 Step 2: Generate HMAC SHA256 signature using `key_secret`
  const expectedSignature = crypto
    .createHmac("sha256",process.env.RAZORPAY_API_SECRET)
    .update(generated_signature.toString())
    .digest("hex");

     const isAuthentic = expectedSignature === razorpay_signature
        
    //  purana vala code 
      if(isAuthentic){

          const purchase = await CoursePurchaseSchema.findOneAndUpdate({courseId:CourseId,userId:userId}, { status: "completed" ,paymentId:razorpay_payment_id }, { new: true }).populate({path:"courseId"});

          if(!purchase){
             return res.status(404).json({ message: 'Purchase not found', success: false })
          }
        //    make all lectures visible by setting isPreviewFree to true
           if(purchase?.courseId && purchase?.courseId?.lectures?.length > 0){
                  await lectureSchema.updateMany(
                    {_id: {$in:purchase.courseId.lectures}},
                    {$set:{isPreviewFree:true}}
                  ) 
           }
           //    update this user in enrolled course of courseSchema
         await userSchema.findByIdAndUpdate(
            purchase.userId._id,
            {$addToSet:{enrolledCourses:purchase.courseId._id}},
            {new: true}
         )
            
        //    update this user in enrolled course of courseSchema
         await courseSchema.findByIdAndUpdate(
            purchase.courseId._id,
            {$addToSet:{enrolledStudent:purchase.userId}},
            {new: true}
         )


           return res.status(200).json({ 
            redirectUrl: `http://localhost:5173/course-Progress/${CourseId}/?refrence=${razorpay_payment_id}`,
            message: 'Payment verified successfully', 
            success: true })

      }else{
         return res.status(401).json({ message: 'Payment signature is not authentic', success: false })  
      }
        
 
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred during payment verification.', success: false })
    }
}

export const getKey = (req, res) => {
    res.status(200).json({
        key:process.env.RAZORPAY_API_KEY
    })
}


export const getCourseDetailWithPurchaseStatus = async (req, res) => {
    
    try {
        const {courseId} = req.params
        const {userId} = req.user

        const course = await courseSchema.findById(courseId).populate({path:"creator"}).populate({path:"lectures"});         
          if (!course) {
             return res.status(404).json({ message: 'Course not found', success: false })
          }
          const purchased = await CoursePurchaseSchema.findOne({courseId:courseId, userId:userId})
        //   console.log(purchased);
          
        //            if(!purchased){
        //              return res.status(200).json({ message: 'Purchase not found', success: false })
        //            }

                   return res.status(200).json({ message: 'Course details fetched successfully',
                     success: true,
                     course, 
                     purchased: !!purchased
                      })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred during course detail fetching.', success: false })
    }
}


export const getAllpurchasedCourse = async (req, res) => {
    try {

        const purchasedCourse = await CoursePurchaseSchema.find({status: 'completed'}).populate("courseId")
        if(!purchasedCourse){
            return res.status(404).json({ message: 'No purchased courses found', success: false,purchasedCourse:[] })
        }

         return res.status(200).json({ message: 'All purchased courses fetched successfully', success: true, purchasedCourse })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred during fetching all purchased courses.', success: false })
        
    }
}