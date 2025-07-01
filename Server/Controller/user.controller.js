import userSchema from '../Models/user.model.js'
import bcrypt from 'bcryptjs'
import validator from 'validator'
import { generateToken } from '../utils/generateToken.js'
import { deleteMediaFromCloudinary, uploadMedia } from '../utils/cloudinary.js'
import fs from 'fs'


export const registerUser = async (req, res) => {
    try {
         // Validate user input
        const { name, email, password,confirmPassword } = req.body
     
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required',success:false })
        }
        if(!validator.isEmail(email)){
            return res.status(403).json({ message: 'Please Enter a valid Email Address', success:false })
        }
        if(!validator.isLength(name,{min:4,max:20})){
            return res.status(403).json({ message: 'Name should be between 4 and 8 characters long', success:false })
        }
        if(!validator.matches(password, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)){
            return res.status(400).json({ message: 'Password should be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character', success:false })
        } 
        if(password !== confirmPassword){
            return res.status(403).json({ message: 'Passwords do not match', success:false })
        }
        
        // Check if user already exists
        const existingUser = await userSchema.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email', success:false })
        }
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10)
        
        // Create a new user
        const newUser = new userSchema({
            name,
            email,
            password: hashedPassword,
        })
        
        // Save the user to the database
        await newUser.save()
        
       res.status(200).json({
        message: 'User registered successfully',
        success: true,
       })
     
    } catch (error) {
         console.error(error,'Error while registering User')
         return res.status(500).json({ message: 'An error occurred during registration. Please try again later.', success:false })
    }
}


export const login = async (req, res) =>{
    try {
        const { email, password } = req.body
        
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required', success:false })
        }
        
        // Check if user exists
        const user = await userSchema.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: 'User not found. Invalid credentials. Please check your username and password.', success: false })
        }
        
        // Check if password matches
        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials. Please check your email and password.', success: false })
            }
            
            // Generate JWT token
                generateToken(res,user,`Welcome back ${user.name}`)
         
       
        
    } catch (error) {
        console.error(error,'Error while logging in User')
        return res.status(500).json({ message: 'An error occurred during login. Please try again later.', success: false })
    }
    
}

export const logout = (_, res) => {
    try {
        return res.status(200).cookie(
            'token',
            '',
            { expires: new Date(0), httpOnly: true }
        ).clearCookie('token').json({
            message: 'Logged out successfully',
            success: true
        })
        
    } catch (error) {
        console.log(error,'Error while logging out User');
        
        res.status(500).json({ message: 'An error occurred during logging out.', success: false})
    }
}
export const getUserProfile = async(req, res) => {
    try {
        const   {userId} =req.user
         const user = await userSchema.findById(userId).select("-password").populate("enrolledCourses")
         if (!user) {
            return res.status(404).json({ message: 'User not found', success: false })
        }
        
        res.status(200).json({ message: 'User fetched successfully', success: true, user })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred during fetching user',
            success: false                   
        })
        
    }
}

export const updateProfile = async(req, res) => {
    try {
        const { userId } = req.user        
        const {name}=req.body;
         if(!name){
            return res.status(400).json({ message: 'Name field is required', success: false })
         }
        const profilePhoto =req?.file;
        
       const user = await userSchema.findById(userId);
       if (!user) {
            return res.status(404).json({ message: 'User not found', success: false })
        }
        
            //  extract public id of the old profile photo 
            let cloudResponse;
            if(profilePhoto){
                if (user.photoUrl){
                    const publicId = user?.photoUrl.split('/').pop().split(".")[0]
                    //  delete old profile photo from cloudinary
                    deleteMediaFromCloudinary(publicId)
                }
                //  if new profile photo is provided, upload to cloudinary
                 cloudResponse = await uploadMedia(profilePhoto?.path)
                }
                const photoUrl =cloudResponse?.secure_url;
          
     
            fs.unlink(profilePhoto.path, (err) => {
                if (err) {
                    console.error('Error deleting file', err);
                } else {
                    console.log('Temporary image deleted successfully.');
                }
            });
        const updatedData = {name,photoUrl}
        const updatedUser = await userSchema.findByIdAndUpdate(userId, updatedData, { new: true }).select("-password");
        
        res.status(200).json({ message: 'User updated successfully', success: true, user: updatedUser })
        
    } catch (error) {
        console.log(error, 'An error occurred during updating');
        return res.status(500).json
        ({ message: 'An error occurred during updating user', success: false })
    }
}