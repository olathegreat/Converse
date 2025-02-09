import mongoose, {Schema, Document, ObjectId} from "mongoose";
import bcrypt from "bcryptjs";

export interface UserDocument extends Document{
    _id: ObjectId,
    fullname: string,
    email: string,
    password: string,
    picture?: string,
    profileSetupCompleted: boolean,
    userType?:'user' | 'moderator' | 'admin'

}
const userSchema = new Schema<UserDocument>({

    fullname: {
        type: String,
        required: [true, 'Please enter your fullname'],
        trim: true,
        minLength: [3, 'Fullname must be more than 3 characters'],

    },
    email:{
        type: String,
        required: [true, 'Please enter your email'],
        trim: true,
        unique: true,
        lowercase: true,

    },
    password:{
        type: String,
        required: [true, 'Please enter your password'],
        trim: true,
        minLength: [6, 'Password must be more than 6 characters'],
        select: false,
    },
    picture:{
        type: String,
    },
    profileSetupCompleted:{
        type: Boolean,
        default: false,
    },
    userType:{
        type: String,
        enum: ['user','moderator', 'admin'],
    }


})

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    next();
})

const User = mongoose.model('User', userSchema);

export default User;