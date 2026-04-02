import { model, Schema } from "mongoose";
import type { SignUpInput } from "../../shared/schemas/user.type.js";

const userschema = new Schema<SignUpInput>({
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, select: false},
}, {timestamps: true})

const User = model("users", userschema)
export default User
