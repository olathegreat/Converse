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

export type UserInfoType = {
  fullname: string;
  email: string;
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

    try {
      setUpdateLoading(true);
      const updatedFormData = new FormData();

      updatedFormData.append("fullname", userInfo!.fullname);

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
      setUserInfo(res.data)
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

  return (
    <div className="flex items-center justify-center h-[100vh]">
      {getLoading && <CustomLoaderCircle />}
      <div
        className={`max-w-[600px] p-10 h-fit bg-[#10002e] rounded-lg ${
          getLoading ? "hidden" : "flex"
        }  gap-10`}
      >
        {userInfo && (
          <div className="h-40 w-40 group relative">
            <UserDisplayImage  user={saveUserInfo} />

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

        <div className="w-80 text-white">
          <div className="text-3xl mb-5">Personal info</div>
          <form className="flex flex-col gap-4">
            <Input
              className="placeholder:text-white/80 border-none focus:outline-none bg-white/30"
              type="text"
              placeholder="Full Name"
              value={userInfo?.fullname}
              onChange={(e) => {
                setUserInfo({ ...userInfo!, fullname: e.target.value });
              }}
            />

            <Input
              className="placeholder:text-white/80 border-none focus:outline-none bg-white/30"
              type="email"
              placeholder="Email"
              value={userInfo?.email}
              onChange={(e) => {
                setUserInfo({ ...userInfo!, email: e.target.value });
              }}
              disabled
            />

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
