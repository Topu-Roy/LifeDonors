"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar as AvatarIcon } from "@/components/ui/avatar";
import { useUserStore } from "@/store/userData";
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import userIcon from "../assets/images/user.png";
import { useState } from "react";

export default function Avatar() {
  const [open, setOpen] = useState(false);
  const userData = useUserStore((state) => state.userData);
  const clearUser = useUserStore((state) => state.clearUser);

  async function logOut() {
    await fetch("https://life-donors.onrender.com/users/logout/").finally(
      () => {
        clearUser();
      },
    );
  }

  return userData ? (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <AvatarIcon>
          <Image alt="" src={userIcon} />
        </AvatarIcon>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col items-center justify-between gap-4">
        <Link
          href={"/dashboard"}
          className="w-full transition-all hover:scale-105"
        >
          <Button
            onClick={() => setOpen(!open)}
            variant={"ghost"}
            className="w-full"
          >
            Dashboard
          </Button>
        </Link>
        <Link
          href={"/profile"}
          className="w-full transition-all hover:scale-105"
        >
          <Button
            onClick={() => setOpen(!open)}
            variant={"ghost"}
            className="w-full"
          >
            Profile
          </Button>
        </Link>
        <Button
          onClick={() => {
            setOpen(!open);
            void logOut();
          }}
          variant={"ghost"}
          className="w-full bg-red-300 transition-all hover:scale-105 hover:bg-red-400 hover:text-white"
        >
          Log Out
        </Button>
      </PopoverContent>
    </Popover>
  ) : (
    <>
      <Link href={"/register"} className="transition-all hover:scale-105">
        <Button variant={"ghost"}>Register</Button>
      </Link>
      <Link href={"/login"} className="transition-all hover:scale-105">
        <Button variant={"ghost"}>Log In</Button>
      </Link>
    </>
  );
}
