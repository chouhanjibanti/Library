import express from 'express'
import { getUserProfile, login, logout, registerUser, updateProfile } from '../Controller/user.controller.js'
import { isAuthenticated } from '../Middleware/isAuthenticated.js'
import upload from '../utils/multer.js'
const router = express.Router()



router.post('/register',registerUser)
router.post('/login',login)
router.get('/logout',logout)
router.get('/profile',isAuthenticated,getUserProfile)
router.put('/profile/update',isAuthenticated,upload.single("profilePhoto"),updateProfile)









export default router