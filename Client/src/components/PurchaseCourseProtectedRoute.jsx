import { useGetCourseDetailWithStatusQuery } from "@/store/api/CreateCourseApi"
import { Navigate, useParams } from "react-router-dom"

 const PurchaseCourseProtectedRoute = ({children})=>{
    const {CourseId} = useParams()
    const {data ,isLoading} = useGetCourseDetailWithStatusQuery(CourseId)
     if(isLoading){
        return <div>Loading...</div>
     }

     return data?.purchased ? children : <Navigate to={`/course-detail/${CourseId}`}/>
}

export default PurchaseCourseProtectedRoute