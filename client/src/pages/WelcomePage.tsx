
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";
import Groupchat from "../assets/groupchat.png";
import SocialLife from "../assets/sociallife.png";
import StandUpTalk from "../assets/standuptalk.png";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SignInForm from "../components/SigninForm";
import SignUpForm from "../components/SignUpForm";


const WelcomePage = () => {
    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);
    const formDisplay = useSelector((state:any)=>state.app.formDisplay)


    
    useEffect(() => {
        if (!api) return;
    
        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);
    
        api.on("select", () => {
          setCurrent(api.selectedScrollSnap() + 1);
        });
    
        // Auto-slide functionality
        const interval = setInterval(() => {
          api.scrollNext(); // ✅ Use scrollNext() instead of next()
        }, 3000); // Change slide every 3 seconds
    
        return () => clearInterval(interval);
      }, [api]);
    

  return (
    <div className="w-full lg:h-[100vh] flex items-center justify-center">
      <div className="flex w-[90vw] md:w-[80vw]  gap-4 flex-col md:flex-row p-4  bg-[#10002e]  border rounded-xl items-center">
        <Carousel opts={{ loop: true }} setApi={setApi}  className="md:w-[50%] h-full bg-white rounded-lg">
          <CarouselContent className="rounded-lg  ">
            <CarouselItem className="w-full  h-full rounded-lg">
              <div className=" flex rounded-lg  ">
                <img
                  src={Groupchat}
                  alt="pics"
                  className="w-full rounded-md h-full object-cover"
                />
              </div>
            </CarouselItem>

            <CarouselItem className="w-full flex h-full">
              <div className=" rounded-lg flex h-full">
                <img
                  src={StandUpTalk}
                  alt="pics"
                  className="w-full rounded-md h-full object-cover"
                />
              </div>
            </CarouselItem>

            <CarouselItem className="w-full h-full">
              <div className=" rounded-lg h-full">
                <img
                  src={SocialLife}
                  alt="pics"
                  className="w-full rounded-md h-full object-cover"
                />
              </div>
            </CarouselItem>
          </CarouselContent>


          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              className={`h-2 w-6 rounded-full transition-all ${
                current === i + 1 ? "bg-white" : "bg-gray-500"
              }`}
              onClick={() => api?.scrollTo(i)}
            />
          ))}
        </div>

        <CarouselPrevious className="hidden" />
        <CarouselNext className="hidden" />
        </Carousel>

        <div className="w-[100%] md:w-[50%]  py-6 flex  items-center justify-center transition-all duration-300">

            {
                formDisplay === "signin" && <SignInForm/>
                
            }
            {
                formDisplay === "signup" && <SignUpForm/>
            }

          
          
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
