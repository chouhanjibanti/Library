import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { login, logout } from "../slices/authSlice";

const user_Api = "http://localhost:8080/api/v1/user/";

export const authApi = createApi({
  reducerPath: "authApi",
  tagTypes:["Refetch_user_profile"],
  baseQuery: fetchBaseQuery({
    baseUrl: user_Api,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (inputData) => ({
        url: "register",
        method: "POST",
        body: inputData,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
        const result =  await queryFulfilled;
        //  console.log(result.data);
        } catch (error) {
          console.log(error);
        }
      },
    }),
    loginUser: builder.mutation({
      query: (inputData) => ({
        url: "login",
        method: "POST",
        body: inputData,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          // console.log(result);  
          dispatch(login({ user: result.data.user }));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    logOutuser: builder.mutation({
      query: () => ({
        url: "logout",
        method: "GET",
      }),
      async onQueryStarted(_,{queryFulfilled,dispatch}){
        try {
          const result = await queryFulfilled;
          dispatch(logout())
        } catch (error) {
          console.log(error);
          
        }
      }
    }),
    loadUser:builder.query({
      query: () => ({
        url: "profile",
        method: "GET",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(login({ user: result.data.user }));
        } catch (error) {
          // console.log(error);
        }
      },
      providesTags:["Refetch_user_profile"]
    }),
    updateUser: builder.mutation({
          query:(formData) =>({
            url: "profile/update",
            method: "PUT",
            body:formData,
            credentials:"include",
          
          }),
          invalidatesTags:["Refetch_user_profile"],
    })
  }),
});
export const {useRegisterUserMutation,useLoginUserMutation,useLoadUserQuery,useUpdateUserMutation,useLogOutuserMutation} =authApi