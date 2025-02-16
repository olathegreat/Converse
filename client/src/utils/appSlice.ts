import { createSlice } from "@reduxjs/toolkit";
import { UserInfoType } from "../pages/ProfilePage";

export type messageType = {
    _id?: string;
    sender: string;
    recipient: string;
    messageType: string;
    content?: string;
    fileUrl?: string;
    timeStamp?: Date;
}

interface AppState {

    formDisplay: "signup" | "signin";
    userDetails: UserInfoType;
    selectedUser: UserInfoType;
    messagesArray: messageType[] | [];
    isFileUpload: boolean;
    fileUploadProgress: number;
    isFileDownload: boolean;
    fileDownloadProgress: number;
    directMessagesContact: UserInfoType[] | [];
    mobileViewChatDisplay: boolean
}

const initialState: AppState = {

    formDisplay: "signup",
    userDetails: {
        fullname: "",
        email: "",
        picture: "",
        _id: "",
        about: "",

    },
    selectedUser: {
        fullname: "",
        email: "",
        picture: "",
        _id: "",
        about: ""
    },
    messagesArray: [],
    isFileUpload:false,
    isFileDownload: false,
    fileDownloadProgress:0,
    fileUploadProgress:0,
    directMessagesContact:[],
    mobileViewChatDisplay: false
};

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setFormDisplay: (state, action) => {
            state.formDisplay = action.payload
        },
        setUserDetails: (state, action) => {
            state.userDetails = action.payload
        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload
            console.log(state.selectedUser);
        },
        addUserMessages: (state, action)=>{
            state.messagesArray = [...state.messagesArray, action.payload
            ]
        },
        setUserMessages: (state, action)=>{
            state.messagesArray = action.payload
        },
        setIsFileUpload:(state)=>{
            state.isFileUpload = !state.isFileUpload
        },
        setIsFileDownload:(state)=>{
            state.isFileDownload = !state.isFileDownload
        },
        setFileUploadProgress:(state, action)=>{
            state.fileUploadProgress = action.payload
        },
        setFileDownloadProgress:(state, action)=>{
            state.fileDownloadProgress = action.payload
        },
        setDirectMessagesContact: (state, action) => {
            state.directMessagesContact = action.payload


        },
        setMobileViewChatDisplay: (state)=>{
            state.mobileViewChatDisplay = !state.mobileViewChatDisplay;
        }
    }
})

export const { setDirectMessagesContact,setFileDownloadProgress,setFileUploadProgress,setIsFileDownload, setIsFileUpload,setFormDisplay,addUserMessages,setUserMessages, setUserDetails, setSelectedUser, setMobileViewChatDisplay } = appSlice.actions;

export default appSlice.reducer;