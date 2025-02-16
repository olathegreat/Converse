import { useState } from "react";
import { Input } from "./ui/input";
import { IoIosSearch } from "react-icons/io";
import { apiClient } from "../lib/apiClient";
import { Button } from "./ui/button";
import ContactCard from "./ContactCard";
import { useDispatch } from "react-redux";
import { setMobileViewChatDisplay, setSelectedUser } from "../utils/appSlice";
const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [contactArray, setContactArray] = useState([]);
  const dispatch = useDispatch();

  const searchContact = async (e: any) => {
    e.preventDefault();
    try {
      const res = await apiClient.get(
        "/api/v1/contact/search-contacts",{
          params: {searchTerm}
        }
      );
      console.log(res.data);
      setContactArray(res.data.contacts);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col w-full sm:w-[250px] relative">
      <div className="w-full flex items-center text-white rounded-md border gap-2 pr-2 backdrop-blur-lg">

        <form className="w-full flex items-center gap-2">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="text"
          className="border-none focus:!outline-none focus:!ring-0"
          placeholder="search contact"
        />
        <Button onClick={searchContact} type="submit" className="bg-transparent w-fit">
        <IoIosSearch
          
          
          className="text-white cursor-pointer text-2xl"
        />
        </Button>
        </form>
        </div>
        <div className="flex w-full absolute top-10 flex-col bg-white rounded-md">
          {/* {
          contactArray.length < 1 && <div className="w-full text-center text-xs italic p-4">No contacts found</div> 
} */}

          {
            contactArray.map((contact: any) => {
              const {picture, fullname, about, } = contact
              return(

                <div
                key={contact.fullname}
                onClick={()=>{
                  dispatch(setSelectedUser(contact))
                  dispatch(setMobileViewChatDisplay())
                  setContactArray([]);
                }}
                
                className="w-full rounded-md hover:bg-gray-100/90 transition-all duration-300 cursor-pointer py-1 border-b">

                <ContactCard picture={picture} fullname={fullname} about={about}/>
               </div>
              )
            })
          
        }
        </div>
      
    </div>
  );
};

export default SearchBar;
