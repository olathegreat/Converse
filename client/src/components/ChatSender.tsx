import { Button } from "./ui/button";
import { IoSend } from "react-icons/io5";
import { Input } from "./ui/input";
import { useEffect, useRef, useState } from "react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { RiEmojiStickerLine } from "react-icons/ri";
import { RiAttachment2 } from "react-icons/ri";
import { toast } from "sonner";
import { useSocket } from "../context/SocketContext";
import { useDispatch, useSelector } from "react-redux";
import {
  addUserMessages,
  setFileUploadProgress,
  setIsFileUpload,
} from "../utils/appSlice";
import { apiClient } from "../lib/apiClient";

const ChatSender = () => {
  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const emojiRef = useRef<HTMLDivElement | null>(null);
  const userInfo = useSelector((state: any) => state.app.userDetails);
  const selectedChat = useSelector((state: any) => state.app.selectedUser);
  const socket = useSocket();
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
  }, []);

  const handleSendMessage = () => {
    try {
      if (!message.trim()) {
        toast("cannot send an empty message");
        return;
      }

      if (!socket) {
        console.error("socket is not connected");
        return;
      }

      const messageData = {
        sender: userInfo._id,
        content: message.trim(),
        recipient: selectedChat._id,
        messageType: "text",
        fileUrl: undefined,
      };

      socket.emit("send-message", messageData);

      toast("message sent");
      dispatch(addUserMessages(messageData));
      setMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSending = async (e: any) => {
    try {
      const file = e.target.files[0];

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        dispatch(setIsFileUpload());

        const res = await apiClient.post("/api/v1/messages/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (data) => {
            const percent =
              data.loaded && data.total
                ? Math.round((100 * data.loaded) / data.total)
                : 0;

            dispatch(setFileUploadProgress(percent));
          },
        });

        if (res.status === 200 && res.data) {
          const messageData = {
            sender: userInfo._id,
            content: undefined,
            recipient: selectedChat._id,
            messageType: "file",
            fileUrl: res.data.filePath,
          };

          socket.emit("send-message", messageData);

          toast("file sent");
          dispatch(addUserMessages(messageData));
          dispatch(setIsFileUpload());
        }
      }
    } catch (err) {}
  };

  return (
    <div className="absolute bottom-0 flex left-0 gap-2 right-0">
      <div className="flex flex-grow relative border rounded-md">
        <Input
          value={message}
          className="border-none text-white focus:shadow-transparent focus:border-transparent focus:!outline-none focus:!ring-0"
          type="text"
          placeholder="type your message"
          onChange={(e) => setMessage(e.target.value)}
        />

        <Button
          className="bg-transparent hover:bg-transparent hover:text-purple-500 duration-300 transition-all"
          onClick={() => {
            setEmojiPickerOpen(!emojiPickerOpen);
          }}
        >
          <RiEmojiStickerLine />
        </Button>

        <Button
          onClick={handleAttachmentClick}
          className="bg-transparent hover:bg-transparent hover:text-purple-500 duration-300 transition-all"
        >
          <RiAttachment2 />
        </Button>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileSending}
          accept="image/*"
        />
        <div ref={emojiRef} className="absolute bottom-10 z-50 right-0">
          <EmojiPicker
            theme={Theme.DARK}
            onEmojiClick={(emoji) => {
              setMessage((prev) => prev + emoji.emoji);
            }}
            autoFocusSearch={false}
            open={emojiPickerOpen}
          />
        </div>
      </div>
      <Button
        onClick={handleSendMessage}
        className="text-white bg-purple-600 hover:bg-white hover:text-purple-500 duration-300 transition-all"
      >
        <IoSend />
      </Button>
    </div>
  );
};

export default ChatSender;
