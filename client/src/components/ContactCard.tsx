import { Avatar, AvatarImage } from "./ui/avatar";

type Props = {
  picture: string;
  fullname: string;
  lastMessage?: string;
  lastMessageTime?: string;
  isOnline?: boolean;
  about?: string;
};

const ContactCard = ({
  picture,
  fullname,
  lastMessage,
  lastMessageTime,
  isOnline,
  about,
}: Props) => {
    console.log(picture)
  return (
    <div className="w-full flex p-2  gap-2">
      <div className="h-10 w-10 relative">
        <div className="w-inherit h-inherit">
          {picture ? (
            <Avatar className="w-full h-full">
                
              <AvatarImage referrerPolicy="no-referrer" src={picture} alt={fullname} />
            </Avatar>
          ) : (
            <div className="">
              {fullname && fullname.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        {isOnline && (
          <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
        )}
      </div>

      <div className="flex flex-col w-full">
        <div className="text-sm w-[170px] truncate">{fullname}</div>
        {lastMessage && (
          <div className="text-sm w-full truncate overflow-hidden text-gray-500">{lastMessage}</div>
        )}
        {about && (
          <div className="text-xs w-full truncate overflow-hidden text-gray-500">{about}</div>
        )}
      </div>
      {lastMessageTime && (
        <div className="flex-col">
          <div className="text-xs text-gray-500">{lastMessageTime}</div>
        </div>
      )}
    </div>
  );
};

export default ContactCard;
