import { createSlice } from "@reduxjs/toolkit";


interface AppState {
  
  formDisplay:  "signup" | "signin";
}

const initialState: AppState = {
  
  formDisplay: "signup",
};

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setFormDisplay: (state,action) =>{
            state.formDisplay = action.payload
        }
    }
})

export  const { setFormDisplay } = appSlice.actions;

export default appSlice.reducer;