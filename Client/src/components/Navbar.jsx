import {
  LayoutDashboard,
  LayoutDashboardIcon,
  Library,
  Menu,
  School,
} from "lucide-react";
import React, { useEffect } from "react";
import { LogOut, User } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import DarkMode from "./DarkMode";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { useLogOutuserMutation } from "@/store/api/authApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const [logOutuser, { data, isSuccess }] = useLogOutuserMutation();

  const logoutHandler = async () => {
    await logOutuser();
  };
  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Logged out successfully");
      navigate("/login");
    }
  }, [isSuccess]);

  return (
    <>
      <nav className="h-16 dark:bg-[#0A0A0A] bg-white border-b md:px-4 dark:border-b-gray-800 border-b-gray-200 fixed inset-0 duration-300 z-10 shadow-md">
        {/* desktop */}
        <div className="max-w-screen-xl mx-auto md:flex items-center justify-between h-full gap-10 hidden">
          <div className="flex items-center gap-2 ">
            <div className="flex gap-2">
              <School size={30} />
              <Link to={"/"}>
                <h1 className="text-black dark:text-white hidden md:block font-extrabold text-2xl">
                  E-Learning
                </h1>
              </Link>
            </div>
          </div>
          {/* user icons and dark mode icon */}
          <div className="flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8 rounded-full">
                    <AvatarImage
                      src={user?.photoUrl || "https://github.com/shadcn.png"}
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Library />
                      <span>
                        <NavLink to={"my-learning"}>My Learning</NavLink>
                      </span>
                      <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <User />
                      <span>
                        <NavLink to={"profile"}>Edit Profile</NavLink>
                      </span>
                      <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logoutHandler}>
                    <LogOut />
                    <span>Log out</span>
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {user?.role === "instructor" && (
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      {/* <LogOut /> */}
                      <LayoutDashboard />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-2 items-center">
                <Button onClick={() => navigate("/login")} variant="outline">
                  Login
                </Button>
                <Button onClick={() => navigate("/login")}>Signup</Button>
              </div>
            )}
            <DarkMode />
          </div>
        </div>
        {/* mobile */}
        <div className="flex md:hidden items-center justify-between px-4 h-full">
          <h1 className="font-extrabold text-2xl ">
            <Link to="/">E-Learning</Link>
          </h1>
          <MobileNavbar />
        </div>
      </nav>
    </>
  );
};

export default Navbar;

const MobileNavbar = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const [logOutuser, { data, isSuccess }] = useLogOutuserMutation();

  const logoutHandler = async () => {
    await logOutuser();
  };
  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Logged out successfully");
      navigate("/login");
    }
  }, [isSuccess]);

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            size="icon"
            className="rounded-full  hover:bg-gray-600"
            variant="outline"
          >
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col">
          <SheetHeader className="flex flex-row items-center justify-between mt-2">
            <SheetTitle>
              <Link to="/">E-Learning</Link>
            </SheetTitle>
            <DarkMode />
          </SheetHeader>
          <Separator className="mr-2" />
          <nav className="flex flex-col space-y-4">
            <span>
              <NavLink to={"my-learning"}>My Learning</NavLink>
            </span>
            <span>
              <NavLink to={"profile"}>Edit Profile</NavLink>
            </span>
            <span>
              {isAuthenticated ? (
                <div
                  onClick={logoutHandler}
                  className="flex gap-2 items-center"
                >
                  {" "}
                  <LogOut /> Logout
                </div>
              ) : (
                <Button onClick={() => navigate("/login")} variant="outline">
                  Login
                </Button>
              )}
            </span>
          </nav>
          {user?.role === "instructor" && (
            <SheetFooter>
              <SheetClose asChild>
                <Button onClick={() => navigate("/admin")}>Dashboard</Button>
              </SheetClose>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
