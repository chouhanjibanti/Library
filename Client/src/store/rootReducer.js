import { combineReducers } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import { authApi } from './api/authApi'
import { courseApi } from './api/CreateCourseApi'
import { progressApi } from './api/courseProgressApi'

const rootReducer = combineReducers({
    [authApi.reducerPath]:authApi.reducer,
    [courseApi.reducerPath]:courseApi.reducer,
    [progressApi.reducerPath]:progressApi.reducer,
    auth: authReducer
})





export default rootReducer;