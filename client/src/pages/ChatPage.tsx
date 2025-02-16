import { useDispatch, useSelector } from "react-redux";
import UserDisplayImage from "../components/UserDisplayImage";
import {IoIosSettings} from "react-icons/io"
import {BiLogOutCircle} from "react-icons/bi"
import { useEffect, useState } from "react";
import { apiClient } from "../lib/apiClient";
import { setDirectMessagesContact, setMobileViewChatDisplay, setSelectedUser, setUserDetails, setUserMessages } from "../utils/appSlice";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import ChatHeader from "../components/ChatHeader";
import ChatBody from "../components/ChatBody";
import ChatSender from "../components/ChatSender";
import { Typewriter } from 'react-simple-typewriter'
import MessageList from "../components/MessageList";
import { toast } from "sonner";


const ChatPage = () => {
  const userInfo = useSelector((state: any) => state.app.userDetails);
  const [getLoading, setGetLoading] = useState(false);
  const mobileViewChatDisplay = useSelector((state: any)=> state.app.mobileViewChatDisplay);
  const dispatch = useDispatch();
  const selectedUser = useSelector((state:any)=> state.app.selectedUser);

  useEffect(() => {
      const getUserInfo = async () => {
        console.log(getLoading)
        setGetLoading(true);
        try {
          const res = await apiClient.get("/api/v1/auth/get-user");
          console.log(res.data);
          dispatch(setUserDetails(res.data));
          setGetLoading(false);
        } catch (err) {
          console.log(err);
          setGetLoading(false);
        }
      };
      getUserInfo();
    }, []);

    const navigate = useNavigate();

    const logout = async ()=>{
      dispatch(setUserDetails({
        fullname: "",
        email: "",
        picture: "",
        _id: "",
        about: "",

    }))
    dispatch(setSelectedUser({
      fullname: "",
      email: "",
      picture: "",
      _id: "",
      about: "",

  }))
  dispatch(setUserMessages([]))
  dispatch(setDirectMessagesContact([]))
  dispatch(setMobileViewChatDisplay());

  const res = await apiClient.post("/api/v1/auth/logout");
  console.log(res);

  if(res){
    toast("logout successful")
    navigate("/");

  }
  

    }
  

  return (
    <div className="flex justify-center items-center h-[100vh]">
      <div className="bg-[#10002e] backdrop-blur-lg w-[80vw] h-[70vh] rounded-lg flex flex-col sm:flex-row">
        {/* side widget */}
        <div className="flex flex-row sm:flex-col sm:h-full justify-between   p-4  sm:w-fit items-center">
          <div className="flex flex-row sm:flex-col w-fit items-center gap-4">
            <div className="h-10 w-10">
              <UserDisplayImage user={userInfo} />
            </div>

            <IoIosSettings
             onClick={()=>navigate("/profile")}
            className="text-white hover:text-purple-300 text-3xl cursor-pointer transition-all duration-300"/>

          </div>



          <BiLogOutCircle onClick={logout} className="text-white hover:text-red-700 text-3xl cursor-pointer transition-all duration-300"/>
        </div>

        {/* contact */}

        <div className="hidden py-4 px-4 sm:px-0  sm:flex gap-4  flex-col">
            <SearchBar/>
            <MessageList/>
        </div>

        {
          !mobileViewChatDisplay &&
          <div className="flex py-4 px-4 sm:hidden sm:px-0  gap-4  flex-col">
          <SearchBar/>
          <MessageList/>
      </div>
        }

        {/* chat */}
        <div className="hidden  sm:flex flex-grow  p-4">
            {
                selectedUser.fullname  ? 
            
            <div className="w-full relative flex flex-col">

               <ChatHeader/>
               <ChatBody/>
               <ChatSender/>


            </div> : 
            <div className="hidden sm:flex flex-grow items-center justify-center text-sm italic text-white/80">
                    <Typewriter
                        loop={5}
                        cursor
                        cursorStyle='_'
                        typeSpeed= {100}
                        deleteSpeed={150}
                        delaySpeed={1000}
                        words ={["Select a chat to start messaging"]}
                    
                    />
                  
                </div>
}
            

        </div>

        {
          mobileViewChatDisplay && <div className="flex  sm:hidden flex-grow  sm:p-4 px-4">
          {
              selectedUser.fullname  ? 
          
          <div className="w-full relative flex flex-col">

             <ChatHeader/>
             <ChatBody/>
             <ChatSender/>


          </div> : 
          <div className="hidden sm:flex flex-grow items-center justify-center text-sm italic text-white/80">
                  <Typewriter
                      loop={5}
                      cursor
                      cursorStyle='_'
                      typeSpeed= {100}
                      deleteSpeed={150}
                      delaySpeed={1000}
                      words ={["Select a chat to start messaging"]}
                  
                  />
                
              </div>
}
          

      </div>
        }

        <div></div>
      </div>
    </div>
  );
};

export default ChatPage;
