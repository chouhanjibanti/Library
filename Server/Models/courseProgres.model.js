import mongoose from 'mongoose'


const lectureProgressModel = new mongoose.Schema({
    lectureId:{
        type:String
    },
    viewed:{
        type:Boolean
    }
})

const courseProgressModel = new mongoose.Schema({
    userId:{type:String},
    courseId:{type:String},
    completed:{type:Boolean},
    lectureProgress:[lectureProgressModel]
})

export const courseProgress = mongoose.model('courseProgress', courseProgressModel)

