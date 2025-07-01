import express from 'express';
import { createCourse, createLecture, editCourse, getCourseById, getCourseLecture, getCreatorCourses, getLectureById, getPublishedCourse, removeLeture, searchCourse, togglePublishCourse, updateLecture } from '../Controller/course.controller.js';
import { isAuthenticated } from '../Middleware/isAuthenticated.js';
import upload from '../utils/multer.js';
import { getAllpurchasedCourse, getCourseDetailWithPurchaseStatus } from '../Controller/coursePurchased.controller.js';

const router = express.Router()


router.post('/',isAuthenticated,createCourse)
router.get('/search',isAuthenticated,searchCourse)
router.get('/CreatorCourses',isAuthenticated,getCreatorCourses)
router.put('/edit/course/:courseId',isAuthenticated,upload.single("courseThumbnail"),editCourse)
router.get('/getCourse/:courseId',isAuthenticated,getCourseById)
router.get("/getPublishedCourse",getPublishedCourse)
router.post("/:courseId/createLecture",isAuthenticated,createLecture)
router.get("/:courseId/getLecture",isAuthenticated,getCourseLecture)
router.post('/:courseId/editLecture/:lectureId',isAuthenticated,updateLecture)
router.delete('/removeLecture/:lectureId',isAuthenticated,removeLeture)
router.get('/getLectureById/:lectureId',isAuthenticated,getLectureById)
router.put('/:courseId/published',isAuthenticated,togglePublishCourse)
router.get('/:courseId/detail-with-status',isAuthenticated,getCourseDetailWithPurchaseStatus)
router.get('/all-purchased-course',isAuthenticated,getAllpurchasedCourse)
export default router