import { createSlice } from "@reduxjs/toolkit";
import { UserInfoType } from "../pages/ProfilePage";


interface AppState {
  
  formDisplay:  "signup" | "signin";
  userDetails : UserInfoType
}

const initialState: AppState = {
  
  formDisplay: "signup",
  userDetails: {
    fullname: "",
    email: "",
    picture: "",
    _id: "",
  }
};

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setFormDisplay: (state,action) =>{
            state.formDisplay = action.payload
        },
        setUserDetails: (state,action) =>{
            state.userDetails = action.payload
        }
    }
})

export  const { setFormDisplay, setUserDetails } = appSlice.actions;

export default appSlice.reducer;