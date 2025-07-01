import express from 'express';
import { isAuthenticated } from '../Middleware/isAuthenticated.js';
import { getCourseProgress, markAsCompleted, markAsIncompletedCompleted, updateLectureProgress } from '../Controller/courseProgressController.js';
const router = express.Router();




router.get('/:CourseId',isAuthenticated,getCourseProgress)
router.post('/:CourseId/lecture/:LectureId/view',isAuthenticated,updateLectureProgress)
router.post('/:CourseId/complete',isAuthenticated,markAsCompleted)
router.post('/:CourseId/incomplete',isAuthenticated,markAsIncompletedCompleted)




export default router;