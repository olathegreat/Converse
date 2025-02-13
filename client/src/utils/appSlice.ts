import { createSlice } from "@reduxjs/toolkit";
import { UserInfoType } from "../pages/ProfilePage";


interface AppState {

    formDisplay: "signup" | "signin";
    userDetails: UserInfoType;
    selectedUser: UserInfoType;
}

const initialState: AppState = {

    formDisplay: "signup",
    userDetails: {
        fullname: "",
        email: "",
        picture: "",
        _id: "",
        about: ""
    },
    selectedUser: {
        fullname: "",
        email: "",
        picture: "",
        _id: "",
        about: ""
    }
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
        }
    }
})

export const { setFormDisplay, setUserDetails, setSelectedUser } = appSlice.actions;

export default appSlice.reducer;