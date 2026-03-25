import { model, Schema } from "mongoose";

interface IUSER {
    username: string,
    email: string,
    password: string
}

const userschema = new Schema({
    username: {type: String, required: false},
    email: {type: String, required: false, unique: true},
    password: {type: String, required: false, select: false},
}, {timestamps: true})

const User = model<IUSER>("users", userschema)
export default User
