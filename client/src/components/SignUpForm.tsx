import { useState } from "react";
import { Input } from "./ui/input";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { FcGoogle } from "react-icons/fc";
import { IoLogoApple } from "react-icons/io";
import { apiClient } from "../lib/apiClient";
import { toast } from "sonner";
import CustomLoaderCircle from "./LoaderCircle";
import PasswordStrengthBar from "react-password-strength-bar"
import { useDispatch } from "react-redux";
import { setFormDisplay } from "../utils/appSlice";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle } from "../utils/firebase";

const SignUpForm = () => {
  const [fullname, setFullname] = useState("");
  const dispatch = useDispatch()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [requestSending, setRequestSending] = useState(false);

  const [displayPassword, setDisplayPassword] = useState(false);
  const [displayConfirmPassword, setDisplayConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [passwordStrength, setPasswordStrength] = useState(0);

  const formSubmit = async (e: any) => {
    e.preventDefault();

    if (!fullname || !email || !password || !confirmPassword || !agree) {
      toast("please fil all fields");
      return;
    }
    if(password.length < 6){
      toast("password must be at least 6 characters long")
      return;
    }
    if(password.length > 16){
      toast("password must be less than 16 characters long")
      return;
    }
    if(passwordStrength <2 ){
      toast("password is too weak, please use  a more stronger password, (use capital letters, numbers and symbols)")
      return;
    }

    if (password !== confirmPassword) {
      toast("password does not match");
      return;
    }

    try {
      setRequestSending(true);
      const res = await apiClient.post("/api/v1/auth/", {
        fullname,
        email,
        password,
      });
      toast("account created successfully");

      console.log(res.data);
      setRequestSending(false);
      navigate("/profile")
    } catch (err) {
      console.log(err);
      setRequestSending(false);
    }
  };

  const googleSignIn = async (e: any) => {
    e.preventDefault();

   

    

    try {
      const user = await signInWithGoogle();
      console.log(user);
      const {displayName, email, photoURL} = user;

      setRequestSending(true);
      const res = await apiClient.post("/api/v1/auth/google-auth", {
        fullname: displayName,
        email,
        picture: photoURL,
        
      });
      toast("google signup successfully");

      console.log(res.data);
      setRequestSending(false);
      navigate("/profile")
    } catch (err) {
      console.log(err);
      toast.error("sign in failed")
      setRequestSending(false);
    }
  };

  return (
    <div className="flex w-full md:w-auto flex-col text-white">
      <div className=" text-3xl font-semibold">Create an Account</div>
      <p className="text-xs font-light text-white/70 mt-2">
        Already have an account?{" "}
        <span className="underline cursor-pointer" onClick={()=>dispatch(setFormDisplay("signin"))}>Log in</span>
      </p>

      <form onSubmit={formSubmit} className="flex w-full flex-col gap-4 mt-10">
        <Input
          className="placeholder:text-white/80 border-none focus:!outline-none focus:!ring-0 bg-white/30"
          type="text"
          placeholder="Full name"
          value={fullname}
          onChange={(e) => {
            setFullname(e.target.value);
          }}
        />

        <Input
          className="placeholder:text-white/80 border-none focus:!outline-none focus:!ring-0 bg-white/30"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />

        <div className="flex gap-2 items-center border rounded-md pr-2 placeholder:text-white/80 border-none focus:outline-transparent bg-white/30">
          <Input
            className="flex-grow border-none focus:outline-transparent focus:shadow-none focus:!ring-0 focus:ring-offset-0 focus:border-transparent placeholder:text-white/60"
            type={displayPassword ? "text" : "password"}
            placeholder="Password "
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          {displayPassword ? (
            <FaRegEyeSlash
              className="cursor-pointer"
              onClick={() => setDisplayPassword(!displayPassword)}
            />
          ) : (
            <FaRegEye
              className="cursor-pointer"
              onClick={() => setDisplayPassword(!displayPassword)}
            />
          )}
        </div>
        {
          password !== "" &&  <PasswordStrengthBar password={password} onChangeScore={setPasswordStrength}/>
        }
       

        <div className="flex gap-2 items-center border rounded-md pr-2 placeholder:text-white/80 border-none focus:outline-none bg-white/30">
          <Input
            className="flex-grow border-none focus:shadow-none focus:outline-none focus:!ring-0 focus:ring-offset-0 focus:border-none !important placeholder:text-white/60"
            type={displayConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
          {displayConfirmPassword ? (
            <FaRegEyeSlash
              className="cursor-pointer"
              onClick={() => setDisplayConfirmPassword(!displayConfirmPassword)}
            />
          ) : (
            <FaRegEye
              className="cursor-pointer"
              onClick={() => setDisplayConfirmPassword(!displayConfirmPassword)}
            />
          )}
        </div>
        <div className="flex gap-2 my-2 text-xs font-light items-center">
          <Checkbox
            onCheckedChange={() => setAgree(!agree)}
            checked={agree}
            className="border-white text-white"
          />
          <div className="flex flex-nowrap text-nowrap gap-[5px] text-[10px]">
            Do you agree to the{" "}
            <span className="underline cursor-pointer">
              terms and conditions
            </span>
            ?
          </div>
        </div>
        <Button
          className="bg-purple-700"
          type="submit"
          disabled={requestSending}
        >
          {requestSending ? <CustomLoaderCircle /> : "Create Accoount"}
        </Button>
      </form>

      <div className="flex gap-4 mt-6 mb-6 items-center">
        <hr className="flex-grow" />
        <span className="text-[9px] font-light text-white/60">
          or register with
        </span>
        <hr className="flex-grow" />
      </div>

      <div className="flex  gap-4 ">
        <Button onClick={googleSignIn} className="flex-1 bg-transparent border">
          <FcGoogle /> Google
        </Button>
        <Button className="flex-1 bg-white text-black">
          <IoLogoApple /> Apple
        </Button>
      </div>
    </div>
  );
};

export default SignUpForm;
