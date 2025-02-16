import { useEffect, useState } from "react";
import { apiClient } from "../lib/apiClient";
import { useDispatch } from "react-redux";
import { setDirectMessagesContact, setMobileViewChatDisplay, setSelectedUser } from "../utils/appSlice";
import ContactCard from "./ContactCard";

const MessageList = () => {
    const dispatch = useDispatch();
    const [messageList, setMessageList] = useState([])

    useEffect(() => {
        const getUserDMMessagesList = async () => {
          try{
    
          
          const response = await apiClient.get(
            "api/v1/messages/get-user-messages-contact",
            {
              headers: {
                "Content-Type": "application/json",
            
              },
            }
          );
          setMessageList(response.data.contacts);
          console.log(response.data.contacts);
          dispatch(setDirectMessagesContact(response.data.contacts));
    
          
    
        }catch(err){
          console.log(err)
        }
        };
    
        getUserDMMessagesList();
      }, []);




  return (
    <div className="flex text-white flex-col gap-2">
        {
            messageList.length > 0 ? (
                messageList.map((chatData:any)=>(
                    <div 
                      key={chatData._id}
                       onClick={()=>{
                        dispatch(setSelectedUser(chatData))
                        dispatch(setMobileViewChatDisplay())
                      }}
                       
                       >
                        <ContactCard fullname={chatData.fullname} about={chatData.about} picture={chatData.picture}/>
                         
                    </div>
                ))
            ): (
                <div>
                    No Chats
                </div>
            )
        }
      
    </div>
  )
}

export default MessageList
