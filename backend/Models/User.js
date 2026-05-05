import mongoose from "mongoose";

const userschema = new mongoose.Schema({
    name: String,
    email:{
    type:String,
    unique: true,
    required: true},
    password: String,
    role :{type:String , default: "member"}
});

export default mongoose.model("User", userschema);