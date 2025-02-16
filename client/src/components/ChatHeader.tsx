import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarImage } from "./ui/avatar";
import {IoIosArrowBack} from "react-icons/io"
import { setMobileViewChatDisplay, setSelectedUser } from "../utils/appSlice";

const ChatHeader = () => {
  const user = useSelector((state: any) => state.app.selectedUser);

  const dispatch = useDispatch();

  if (!user) return null; 

  return (
    <div className="flex w-full text-white p-2 justify-between items-center shadow-md shadow-gray-100/10">
      <div className="flex items-center gap-2">
      <div className="relative w-10 h-10">
        {user.picture ? (
          <Avatar className="w-full h-full">
            <AvatarImage referrerPolicy="no-referrer" src={user.picture} alt={user.fullname} />
          </Avatar>
        ) : (
          <div className="flex items-center justify-center w-10 h-10 bg-gray-300 rounded-full text-white font-bold">
            {user.fullname?.charAt(0).toUpperCase()}
          </div>
        )}
        {user.isOnline && (
          <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
        )}
      </div>

      <div className="flex flex-col ml-3">
        <div className="text-sm sm:font-semibold ">{user.fullname || "Unknown User"}</div>
        {user.about && <div className="text-xs text-gray-500 truncate">{user.about}</div>}
      </div>

      {/* {user.lastMessageTime && (
        <div className="ml-auto text-xs text-gray-400">{user.lastMessageTime}</div>
      )} */}
      </div>

      <div>
        <IoIosArrowBack
          onClick={()=>{
            dispatch(setSelectedUser({
            fullname: "",
        email: "",
        picture: "",
        _id: "",
        about: ""
          }))
        dispatch(setMobileViewChatDisplay())
        }}
        className="text-white text-2xl cursor-pointer" />

      </div>
    </div>
  );
};

export default ChatHeader;