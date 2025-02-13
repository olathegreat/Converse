import { useContext, createContext, ReactNode, useRef, useEffect } from "react";
import { UserInfoType } from "../pages/ProfilePage";
import { useSelector } from "react-redux";
import io from "socket.io-client";


export interface UserMessageDocument {
    _id: string;
    sender: UserInfoType;
    recipient: UserInfoType;
    messageType: string;
    content?: string;
    fileUrl?: string;
    timeStamp?: Date;
  }
  

  const SocketContext = createContext<any>(null);

  export const useSocket = () => {
    return useContext(SocketContext)
  }



  export const Socketprovider = ({children}: {children:ReactNode}) =>{
         const socket = useRef<any>(null);
         const user = useSelector((state:any)=> state.app.userDetails)
         const selectedUser = useSelector((state:any)=>state.app.selectedUser)

         const HOST = import.meta.env.VITE_SERVER_URL

         useEffect(()=>{
            if (user) {
                socket.current = io(HOST, {
                  transportOptions: {
                      polling: {
                          withCredentials: true, 
                      },
                  },
                  // withCredentials: true,
                  query: {
                    userId: user._id,
                    
                  },
                });
          
                socket.current.on("connect", () => {
                  console.log("connected to socket server");
                });
          
                socket.current.on("connect_error", (err: any) => {
                  console.error("Socket connection error:", err);
                });
          
                const handleReceiveMessage = (message: any) => {
                  if (
                    selectedUser &&
                    (selectedUser._id === message.sender._id ||
                      selectedUser._id === message.recipient._id)
                  ) {
                    console.log("Message received:", message);
                    // dispatch(addMessages(message));
                  }
                };
          
                socket.current.on("receive-message", handleReceiveMessage);
                socket.current.on("sent-message", handleReceiveMessage);
                return () => {
                  socket.current.off("receive-message", handleReceiveMessage);
                  socket.current.off("sent-message", handleReceiveMessage);
                };
               
              }
          
          
            }, [user]);
          
            return (
              <SocketContext.Provider value={socket.current ? socket.current : null}>
                {children}
              </SocketContext.Provider>
            );
          
          
         
  }