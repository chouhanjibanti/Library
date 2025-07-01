import mongoose from "mongoose";



const lectureModel = new mongoose.Schema({

    lectureTitle: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String,
    },
    publicId:{
        type: String,
    },
    isPreviewFree:{
        type: Boolean,
        default:false
    }

},{
    timestamps: true,
})

const Lecture = mongoose.model("Lecture", lectureModel);

export default Lecture;