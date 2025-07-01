
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const course_Api = "http://localhost:8080/api/v1/course/";
const course_Api = import.meta.env.VITE_API_URL + "/course/";


export const courseApi = createApi({
  reducerPath: "courseApi",
  tagTypes: ["Refetch_Creator_Course","Refetch_course_lecture","Refetch_after_publish"],
  baseQuery: fetchBaseQuery({
    baseUrl: course_Api,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    registerCourse: builder.mutation({
      query: (formData) => ({
        url: "/",
        method: "POST",
        body: formData,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const response = await queryFulfilled;
        //   console.log(response.data);
        } catch (error) {
        //   console.log(error);
        }
      },
      invalidatesTags:["Refetch_Creator_Course"]
    }),
    getSearchCourses:builder.query({
      query:({searchQuery,categories,sortByPrice})=>{           
        //  build query string  
        let queryString = `search?query=${encodeURIComponent(searchQuery)}`
        // check if categories is not empty and add it to query string
        if(categories && categories.length > 0){
          const categoriesString = categories.map(encodeURIComponent).join(",")
          queryString +=  `&categories=${categoriesString}`
        }
        if(sortByPrice){
          const priceQuery = `&sortByPrice=${sortByPrice}`
           queryString += priceQuery
        }
        return {
          url: queryString,
          method: "GET",
        };
      },
    }),
    getCreatorCourses: builder.query({
        query: () => ({
               url: "CreatorCourses",
               method: "GET",
             }),
             async onQueryStarted(arg, { queryFulfilled, dispatch }) {
               try {
                 const result = await queryFulfilled;
                //  console.log(result.data);
               } catch (error) {
                //  console.log(error);
               }
        },
        providesTags:["Refetch_Creator_Course","Refetch_after_publish"]
    }),
    editCourse: builder.mutation({
        query: ({formData,CourseId}) => ({
               url: `edit/course/${CourseId}`,
               method: "PUT",
               body: formData
             }),
             async onQueryStarted(arg, { queryFulfilled, dispatch }) {
               try {
                 const result = await queryFulfilled;
                //  console.log(result.data);
               } catch (error) {
                //  console.log(error);
               }
        },
        invalidatesTags:["Refetch_Creator_Course",]

    }),
    getCourseById: builder.query({
        query: (CourseId) => ({
            url: `getCourse/${CourseId}`,
            method: "GET",
          }),
          async onQueryStarted(arg,{queryFulfilled,_}){
            try {
                const result = await queryFulfilled;
                // console.log(result.data);
            } catch (error) {
                // console.log(error);
                
            }
          },
          providesTags:["Refetch_after_publish","Refetch_course_lecture"],
          
    }),
    CreateLecture:builder.mutation({
      query:({formData,CourseId})=>({
        url: `${CourseId}/createLecture`,
        method: "POST",
        body: formData,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          // console.log(result.data);
        } catch (error) {
          // console.log(error);
        }
      },
      invalidatesTags:["Refetch_course_lecture"]
    }),
    getCourseLecture:builder.query({
      query: (CourseId) => ({
        url: `${CourseId}/getLecture`,
        method: "GET",
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          // console.log(result.data);
        } catch (error) {
          // console.log(error);
        }
      },
      providesTags:["Refetch_course_lecture"]
    }),
    editCourseLecture:builder.mutation({
      query:({lectureTitle,videoInfo,isPreviewFree,CourseId,LectureId})=>({
        url: `${CourseId}/editLecture/${LectureId}`,
        method: "post",
        body: {lectureTitle,videoInfo,isPreviewFree},
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          // console.log(result.data);
        } catch (error) {
          // console.log(error);          
        }
      }
    }),
    removeLecture:builder.mutation({
         query: (LectureId) => ({
             url: `/removeLecture/${LectureId}`,
             method: "DELETE",
         }),
         async onQueryStarted(arg, { queryFulfilled }) {
             try {
                 const result = await queryFulfilled;
                 // console.log(result.data);
             } catch (error) {
                 // console.log(error);
             }
         },
         invalidatesTags:["Refetch_course_lecture"]
 
    }),
    getLecturebyId:builder.query({
      query: (LectureId) => ({
        url: `/getLectureById/${LectureId}`,
        method: "GET",
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const result = await queryFulfilled;
        } catch (error) {
          // console.log(error);
        }
      },
      
      providesTags:["Refetch_course_lecture"]
    }),
    publishCourse:builder.mutation({
      query: ({CourseId,query}) => ({
        url: `${CourseId}/published?publish=${query}`,
        method: "PUT",
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const result = await queryFulfilled;
        } catch (error) {
          console.log(error);
        }
      },
      invalidatesTags:["Refetch_after_publish"]
    }),
    getPublishedCourse:builder.query({
      query: () => ({
        url: "getPublishedCourse",
        method: "GET",
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const result = await queryFulfilled;
        } catch (error) {
          console.log(error);
        }
      },
      
    }),
    getCourseDetailWithStatus:builder.query({
      query: (CourseId) => ({
        url: `/${CourseId}/detail-with-status`,
        method: "GET",
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const result= await queryFulfilled;
        } catch (error) {
          console.log(error);
        }
      }
    }),
    getPurchasedCourse:builder.query({
      query: () => ({
        url: "all-purchased-course",
        method: "GET",
      })
    })
  }),
});


export const { useRegisterCourseMutation, useGetCreatorCoursesQuery,useEditCourseMutation,useGetCourseByIdQuery,useGetPublishedCourseQuery,useCreateLectureMutation,useGetCourseLectureQuery,useEditCourseLectureMutation,useRemoveLectureMutation,useGetLecturebyIdQuery,usePublishCourseMutation ,useGetCourseDetailWithStatusQuery,useGetPurchasedCourseQuery,useGetSearchCoursesQuery} = courseApi;

