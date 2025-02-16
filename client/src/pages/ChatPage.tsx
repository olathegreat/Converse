import { useDispatch, useSelector } from "react-redux";
import UserDisplayImage from "../components/UserDisplayImage";
import {IoIosSettings} from "react-icons/io"
import {BiLogOutCircle} from "react-icons/bi"
import { useEffect, useState } from "react";
import { apiClient } from "../lib/apiClient";
import { setUserDetails } from "../utils/appSlice";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import ChatHeader from "../components/ChatHeader";
import ChatBody from "../components/ChatBody";
import ChatSender from "../components/ChatSender";
import { Typewriter } from 'react-simple-typewriter'
import MessageList from "../components/MessageList";


const ChatPage = () => {
  const userInfo = useSelector((state: any) => state.app.userDetails);
  const [getLoading, setGetLoading] = useState(false);
  const dispatch = useDispatch();
  const selectedUser = useSelector((state:any)=> state.app.selectedUser);

  useEffect(() => {
      const getUserInfo = async () => {
        console.log("get loading")
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
  

  return (
    <div className="flex justify-center items-center h-[100vh]">
      <div className="bg-[#10002e] backdrop-blur-lg w-[80vw] h-[70vh] rounded-lg flex">
        {/* side widget */}
        <div className="flex flex-col h-full justify-between  p-4 w-fit items-center">
          <div className="flex flex-col w-fit items-center gap-4">
            <div className="h-10 w-10">
              <UserDisplayImage user={userInfo} />
            </div>

            <IoIosSettings
             onClick={()=>navigate("/profile")}
            className="text-white hover:text-purple-300 text-3xl cursor-pointer transition-all duration-300"/>

          </div>



          <BiLogOutCircle className="text-white hover:text-red-700 text-3xl cursor-pointer transition-all duration-300"/>
        </div>

        {/* contact */}

        <div className="py-4  flex gap-4  flex-col">
            <SearchBar/>
            <MessageList/>
        </div>

        {/* chat */}
        <div className="flex flex-grow  p-4">
            {
                selectedUser.fullname  ? 
            
            <div className="w-full relative flex flex-col">

               <ChatHeader/>
               <ChatBody/>
               <ChatSender/>


            </div> : 
            <div className="flex flex-grow items-center justify-center text-sm italic text-white/80">
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

        <div></div>
      </div>
    </div>
  );
};

export default ChatPage;
