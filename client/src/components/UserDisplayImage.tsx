import { ReactElement } from "react";
import { Avatar, AvatarImage } from "./ui/avatar";


type UserInfoType  = {
    fullname: string
    email: string
    picture: File |  string
    _id: string
    

}



const UserDisplayImage = ({user, previewImage} :{user: UserInfoType, previewImage?: string | null}):ReactElement => {


  return (
    <div className="w-inherit h-inherit">
        
        {
            user.picture && typeof user.picture === 'string' ? (    
               <Avatar className="w-full h-full">
                  <AvatarImage referrerPolicy="no-referrer"  src={previewImage ? previewImage : user.picture} alt={user.fullname} />
                </Avatar>
            ): (
                <div className="">

                    {
                      user.fullname &&  user.fullname.charAt(0).toUpperCase()
                    }

                </div>

            )
        }
      
    </div>
  )
}

export default UserDisplayImage
