import { useState } from "react";
import { Input } from "./ui/input";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Button } from "./ui/button";
import { FcGoogle } from "react-icons/fc";
import { IoLogoApple } from "react-icons/io";
import { apiClient } from "../lib/apiClient";
import { toast } from "sonner";
import CustomLoaderCircle from "./LoaderCircle";
import { useDispatch } from "react-redux";
import { setFormDisplay } from "../utils/appSlice";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle } from "../utils/firebase";


const SignInForm = () => {
 
  const dispatch = useDispatch()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [requestSending, setRequestSending] = useState(false);
  const [displayPassword, setDisplayPassword] = useState(false);
  const navigate = useNavigate();

  const formSubmit = async (e: any) => {
    e.preventDefault();

    if (!email || !password ) {
      toast("please fil all fields");
      return;
    }

 

    try {
      setRequestSending(true);
      const res = await apiClient.post("/api/v1/auth/login", {
      
        email,
        password,
      });
      toast("login successfull");

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
      <div className=" text-3xl font-semibold">Log in Account</div>
      <p className="text-xs font-light text-white/70 mt-2">
        Don't have an account?{" "}
        <span className="underline cursor-pointer" onClick={()=>dispatch(setFormDisplay("signup"))}>Sign Up</span>
      </p>

      <form onSubmit={formSubmit} className="flex w-full flex-col gap-4 mt-10">
       

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
            className="flex-grow focus:!outline-none focus:!ring-0 border-none focus:outline-transparent focus:border-transparent placeholder:text-white/60"
            type={displayPassword ? "text" : "password"}
            placeholder="Password"
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
       
       
        <Button
          className="bg-purple-700"
          type="submit"
          disabled={requestSending}
        >
          {requestSending ? <CustomLoaderCircle /> : "Login"}
        </Button>
      </form>

      <div className="flex gap-4 mt-6 mb-6 items-center">
        <hr className="flex-grow" />
        <span className="text-[9px] font-light text-white/60">
          or login with
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

export default SignInForm;
