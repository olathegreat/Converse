import { useEffect, useRef, useState } from "react";
import UserDisplayImage from "../components/UserDisplayImage";
import { apiClient } from "../lib/apiClient";
import { Input } from "../components/ui/input";
import { IoIosAdd } from "react-icons/io";
import { Button } from "../components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { setUserDetails } from "../utils/appSlice";
import CustomLoaderCircle from "../components/LoaderCircle";
import { useNavigate } from "react-router-dom";
import { Textarea } from "../components/ui/textarea";
import EmojiPicker, { Theme } from "emoji-picker-react";

export type UserInfoType = {
  fullname: string;
  email: string;
  about: string;
  picture: File | string;
  _id: string;
};

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState<UserInfoType | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [getLoading, setGetLoading] = useState(false);
  const imageref = useRef<HTMLInputElement | null>(null);
  const [imageChangeLoading, setImageChangeLoading] = useState(false);
  const dispatch = useDispatch();
  const saveUserInfo = useSelector((state: any) => state.app.userDetails);
  const emojiRef = useRef<HTMLDivElement | null>(null);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

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
  }, [emojiRef]);

  useEffect(() => {
    const getUserInfo = async () => {
      setGetLoading(true);
      try {
        const res = await apiClient.get("/api/v1/auth/get-user");
        console.log(res.data);
        setUserInfo(res.data);
        setPreviewImageUrl(res.data.picture);
        console.log(previewImageUrl);
        dispatch(setUserDetails(res.data));
        setGetLoading(false);
      } catch (err) {
        console.log(err);
        setGetLoading(false);
      }
    };
    getUserInfo();
  }, []);

  const handleFileInput = () => {
    imageref && imageref.current && imageref.current.click();
  };

  const updateUserInfo = async (e: any) => {
    e.preventDefault();
    if (userInfo === saveUserInfo) {
      toast("Change picture or fullname");
      return;
    }
    if( userInfo && userInfo?.about.length < 2){
         toast("your about should not be lower than 2 characters ")
         return;
    }

    try {
      setUpdateLoading(true);
      const updatedFormData = new FormData();

      updatedFormData.append("fullname", userInfo!.fullname);
      updatedFormData.append("about", userInfo!.about);

      const res = await apiClient.patch(
        "/api/v1/auth/update",
        updatedFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(res);
      dispatch(setUserDetails(res.data));
      setUserInfo(res.data);
      toast.success("updated successfully");
      setUpdateLoading(false);
    } catch (err) {
      console.log(err);
      setUpdateLoading(false);
    }
  };

  const handleFileChange = async (e: any) => {
    try {
      setImageChangeLoading(true);
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const previewUrl = URL.createObjectURL(file);
        setPreviewImageUrl(previewUrl);
        setUserInfo({ ...userInfo!, picture: file });
      }

      setUpdateLoading(true);
      const updatedFormData = new FormData();

      updatedFormData.append("fullname", userInfo!.fullname);
      updatedFormData.append("about", userInfo!.about);

      updatedFormData.append("image", e.target.files[0]);

      const res = await apiClient.patch(
        "/api/v1/auth/update",
        updatedFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(res);
      dispatch(setUserDetails(res.data));
      toast.success("image update successful");
      //   setUserInfo(res.data);
      setUpdateLoading(false);
      setImageChangeLoading(false);
    } catch (err) {
      setImageChangeLoading(false);
      setUpdateLoading(false);
      console.log(err);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-[100vh]">
      {getLoading && <CustomLoaderCircle />}
      <div
        className={`w-[90%] sm:max-w-[600px] p-4 sm:p-10 h-fit bg-[#10002e] rounded-lg ${
          getLoading ? "hidden" : "flex flex-col sm:flex-row"
        }  gap-10`}
      >
        <div className="flex flex-col items-center gap-2">
          {userInfo && (
            <div className="h-40 w-40 group relative">
              <UserDisplayImage user={saveUserInfo} />

              {!imageChangeLoading && (
                <div
                  onClick={handleFileInput}
                  className="absolute hidden group-hover:flex w-full h-full rounded-full bg-black/30 top-0  items-center justify-center transition-all duration-300 cursor-pointer"
                >
                  <IoIosAdd className="text-8xl font-bold text-white" />
                </div>
              )}
              {imageChangeLoading && (
                <div className="absolute  flex w-full h-full rounded-full bg-black/30 top-0  items-center justify-center transition-all duration-300 cursor-pointer">
                  <CustomLoaderCircle />
                </div>
              )}
              <input
                type="file"
                ref={imageref}
                name="image"
                accept=".png, .jpg, .jpeg, .svg, .webp"
                className="hidden"
                onChange={(e: any) => {
                  handleFileChange(e);
                }}
              />
            </div>
          )}

          <div className="flex justify-center">
            <Button
              onClick={() => navigate("/chat")}
              className="bg-transparent border-white border hover:bg-white/30"
            >
              Go to chat
            </Button>
          </div>
        </div>

        <div className="sm:w-80 text-white">
          <div className="text-3xl mb-5">Personal info</div>
          <form className="flex flex-col gap-4">
            <Input
              className="placeholder:text-white/80 border-none focus:!outline-none focus:!ring-0 bg-white/30"
              type="text"
              placeholder="Full Name"
              value={userInfo?.fullname}
              onChange={(e) => {
                setUserInfo({ ...userInfo!, fullname: e.target.value });
              }}
            />

            <Input
              className="placeholder:text-white/80 border-none focus:!outline-none focus:!ring-0 bg-white/30"
              type="email"
              placeholder="Email"
              value={userInfo?.email}
              disabled
            />

            <div className="flex gap relative" ref={emojiRef}>
              <Textarea
                className="placeholder:text-white/80 border-none focus:!outline-none focus:!ring-0 bg-white/30 resize-none"
                placeholder="Brief desc about you..."
                value={userInfo?.about}
                onChange={(e) => {
                  setUserInfo({ ...userInfo!, about: e.target.value });
                }}
              />
              <div
                className=" text-4xl absolute right-2 top-1 z-50"
                ref={emojiRef}
              >
                <button
                  type="button"
                  className="absolute right-2 top-2 text-2xl"
                  onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
                >
                  😀 {/* Emoji Button */}
                </button>
                <EmojiPicker
                
                  theme={Theme.DARK}
                  onEmojiClick={(emoji) => {
                    setUserInfo({
                      ...userInfo!,
                      about: (userInfo?.about || "") + emoji.emoji,
                    });
                  }}
                  autoFocusSearch={false}
                  open={emojiPickerOpen}
                />
              </div>
            </div>

            <Button
              disabled={updateLoading}
              className="bg-white text-purple-900 hover:bg-white/70 transition-all duration-300"
              onClick={updateUserInfo}
            >
              {updateLoading ? (
                <CustomLoaderCircle color="purple" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
