import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const PROGRESS_API = "http://localhost:8080/api/v1/progress/";
const PROGRESS_API = import.meta.env.VITE_API_URL + "/progress/";

export const progressApi = createApi({
  reducerPath: "progressApi",
  baseQuery: fetchBaseQuery({
    baseUrl: PROGRESS_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getCourseProgress: builder.query({
      query: (courseId) => ({
        url: `${courseId}`,
        method: "GET",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
        } catch (error) {
          console.log(error);
        }
      },
    }),

    updateLectureProgress: builder.mutation({
      // /:CourseId/lecture/:LectureId/view
      query: ({ courseId, lectureId }) => ({
        url: `${courseId}/lecture/${lectureId}/view`,
        method: "POST",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const response = await queryFulfilled;
        } catch (error) {
          // console.log(error);
        }
      },
    }),
    completeCourse: builder.mutation({
      query: (CourseId) => ({
        url: `${CourseId}/complete`,
        method: "POST",
      }),
    }),
    inCompleteCourse: builder.mutation({
      query: (CourseId) => ({
        url: `${CourseId}/incomplete`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetCourseProgressQuery,
  useUpdateLectureProgressMutation,
  useCompleteCourseMutation,
  useInCompleteCourseMutation,
} = progressApi;
