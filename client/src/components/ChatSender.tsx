import { Button } from "./ui/button"
import {IoSend} from "react-icons/io5"
import { Input } from "./ui/input"
import { useEffect, useRef, useState } from "react"
import EmojiPicker, { Theme } from "emoji-picker-react"
import { RiEmojiStickerLine } from "react-icons/ri";

const ChatSender = () => {
    const [message, setMessage] = useState("");
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
    const emojiRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function handleClickOutside(event: any) {
            if (emojiRef.current && !emojiRef.current.contains(event.target)) {
                setEmojiPickerOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    },[])
  return (
    <div className="absolute bottom-0 flex left-0 gap-2 right-0">

        <div className="flex flex-grow relative border rounded-md">
             <Input
              value={message}
              className="border-none"
              type="text"
              placeholder="type your message"
             />

             <Button
             className="bg-transparent hover:bg-transparent hover:text-purple-500 duration-300 transition-all"
                onClick={()=>{
                    setEmojiPickerOpen(!emojiPickerOpen)
                }}
             >
              <RiEmojiStickerLine />  

             </Button>

             <div ref={emojiRef} className="absolute bottom-10 z-50 right-0">
             <EmojiPicker
             theme={Theme.DARK}
             onEmojiClick={(emoji)=>{
                setMessage((prev)=>prev+emoji.emoji)
             }}
             autoFocusSearch={false}
             open={emojiPickerOpen}
             
             
             />
             </div>
        </div>
        <Button className="text-white bg-purple-600 hover:bg-white hover:text-purple-500 duration-300 transition-all">
            <IoSend/>

        </Button>
      
    </div>
  )
}

export default ChatSender
