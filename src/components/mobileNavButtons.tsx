"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { useUserStore } from "@/store/userData";

export default function MobileNavButtons() {
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
    <>
      <Link href={"/donate"} className="w-full transition-all hover:scale-105">
        <Button variant={"ghost"} className="w-full">
          Donate
        </Button>
      </Link>
      <Link
        href={"/request-donor"}
        className="w-full transition-all hover:scale-105"
      >
        <Button variant={"ghost"} className="w-full">
          Request
        </Button>
      </Link>
      <Link
        href={"/dashboard"}
        className="w-full transition-all hover:scale-105"
      >
        <Button variant={"ghost"} className="w-full">
          Dashboard
        </Button>
      </Link>
      <Link href={"/profile"} className="w-full transition-all hover:scale-105">
        <Button variant={"ghost"} className="w-full">
          Profile
        </Button>
      </Link>
      <Button
        onClick={logOut}
        variant={"ghost"}
        className="w-full bg-red-300 transition-all hover:scale-105 hover:bg-red-400 hover:text-white"
      >
        Log Out
      </Button>
    </>
  ) : (
    <>
      <Link
        href={"/register"}
        className="w-full transition-all hover:scale-105"
      >
        <Button variant={"ghost"} className="w-full">
          Register
        </Button>
      </Link>
      <Link href={"/login"} className="w-full transition-all hover:scale-105">
        <Button variant={"ghost"} className="w-full">
          Log In
        </Button>
      </Link>
    </>
  );
}
