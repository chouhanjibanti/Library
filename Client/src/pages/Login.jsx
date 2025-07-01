import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { motion } from "motion/react"
import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "@/store/api/authApi";
import { toast } from "sonner";
import {  useNavigate } from "react-router-dom";

const Login = () => {
  const navigate=useNavigate()
  const [isVisible, setIsVisible] = useState(false);
  const [signupInput, setSignupInput] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loginInput, setLoginInput] = useState({
    email: "",
    password: "",
  });

  const [
    registerUser,
    {
      data: registerData,
      error: registerError,
      isLoading: registerIsLoading,
      isSuccess: registerIsSuccess,
    },
  ] = useRegisterUserMutation();
  const [
    loginUser,
    {
      data: loginData,
      error: loginError,
      isLoading: loginIsLoading,
      isSuccess: loginIsSuccess,
    },
  ] = useLoginUserMutation();

  const changeHandler = (e, type) => {
    const { name, value } = e.target;
    if (type === "signupInput") {
      setSignupInput((prev) => {
        return { ...prev, [name]: value };
      });
    } else {
      setLoginInput((prev) => {
        return { ...prev, [name]: value };
      });
    }
  };
  const handleRegistration = async (e, type) => {
    e.preventDefault();
    const inputData = type === "signup" ? signupInput : loginInput;
    const action = type === "signup" ? registerUser : loginUser;
         await action(inputData)
  };
    
   useEffect(()=>{    
          if(registerIsSuccess && registerData){
           toast.success(registerData?.message)
          }
          if(loginIsSuccess && loginData){
            navigate('/')
            toast.success(loginData?.message)
          }
          if(registerError){
            toast.error(registerError?.data?.message)
          }
          if(loginError){
            toast.error(loginError?.data?.message)
          }
  
   },[loginIsLoading,registerIsLoading,loginData,registerData,loginError,registerError])

  return (
    <motion.div 
      initial={{ opacity: 0 ,y:100}}
      animate={{ opacity: 1, y:0}}
      transition={{ type:"inOut", duration: 0.5 }}
     className="min-h-screen w-full flex items-center justify-center">
      <Tabs defaultValue="SignUp" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="SignUp">SignUp</TabsTrigger>
          <TabsTrigger value="LogIn">LogIn</TabsTrigger>
        </TabsList>
        <TabsContent value="SignUp">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Signup</CardTitle>
              <CardDescription className="text-center">
                Create a new account and click signup when you're done.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  name="name"
                  value={signupInput.name}
                  id="name"
                  placeholder="John Doe"
                  onChange={(e) => changeHandler(e, "signupInput")}
                />
              </div>
              <div className="space-y-1 ">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={signupInput.email}
                  id="email"
                  placeholder="Example@example.com"
                  onChange={(e) => changeHandler(e, "signupInput")}
                />
              </div>
              <div className="space-y-1 relative">
                <Label htmlFor="password">Password</Label>
                <Input
                  name="password"
                  type={isVisible ? "password" : "text"}
                  value={signupInput.password}
                  id="password"
                  placeholder="Password"
                  onChange={(e) => changeHandler(e, "signupInput")}
                />
                <div
                  className="absolute top-7 right-2 cursor-pointer"
                  onClick={() => setIsVisible(!isVisible)}
                >
                  {isVisible ? <EyeOff /> : <Eye />}
                </div>
              </div>
              <div className="space-y-1 relative">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  name="confirmPassword"
                  value={signupInput.confirmPassword}
                  type={isVisible ? "password" : "text"}
                  id="confirm-password"
                  placeholder="Confirm Password"
                  onChange={(e) => changeHandler(e, "signupInput")}
                />
                <div
                  className="absolute top-7 right-2 cursor-pointer"
                  onClick={() => setIsVisible(!isVisible)}
                >
                  {isVisible ? <EyeOff /> : <Eye />}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button disabled={registerIsLoading} onClick={(e) => handleRegistration(e, "signup")}>
                {
                    registerIsLoading ? (
                       <>
                       <Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please wait
                       </>
                    ):(
                        "Signup"
                    )
                }
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="LogIn">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Login</CardTitle>
              <CardDescription className="text-center">
                Login your password here. After signup, you'll be logged in.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={loginInput.email}
                  placeholder="Example@example.com"
                  onChange={(e) => changeHandler(e, "login")}
                />
              </div>
              <div className="space-y-1 relative">
                <Label htmlFor="password">password</Label>
                <Input
                  id="password"
                  type={isVisible ? "password" : "text"}
                  name="password"
                  value={loginInput.password}
                  placeholder="Password"
                  onChange={(e) => changeHandler(e, "login")}
                  className="relative"
                />
                <div
                  className="absolute top-7 right-2 cursor-pointer"
                  onClick={() => setIsVisible(!isVisible)}
                >
                  {isVisible ? <EyeOff /> : <Eye />}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button disabled={loginIsLoading} onClick={(e) => handleRegistration(e, "login")}>
                {
                    loginIsLoading? (
                        <>
                         <Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please wait
                        </>
                    ):(
                      "Login"
                    )
                }
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};
export default Login;
