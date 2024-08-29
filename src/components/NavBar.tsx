import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Search } from "lucide-react";
import { Button } from "./ui/button";

export default function NavBar() {
  return (
    <header className="sticky left-0 top-0 w-full bg-destructive text-white">
      <div className="mx-auto w-full max-w-[80rem] px-2 xl:px-0">
        <div className="flex items-center justify-between py-6">
          <span className="flex-1 text-xl font-black">ROKTO</span>
          <div className="inline-flex items-center justify-between gap-4 lg:hidden">
            <Button variant={"ghost"} className="p-2">
              <Search size={25} />
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant={"ghost"} className="p-2">
                  <Menu size={30} />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[60%]">
                <div className="flex flex-col items-end justify-center gap-8 pt-8">
                  <Link href={"/"} className="transition-all hover:scale-105">
                    Home
                  </Link>
                  <Link
                    href={"/about"}
                    className="transition-all hover:scale-105"
                  >
                    About
                  </Link>
                  <Link
                    href={"/search-donors"}
                    className="transition-all hover:scale-105"
                  >
                    Search Donors
                  </Link>
                  <p className="transition-all hover:scale-105">Log In</p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="hidden items-center justify-end gap-10 lg:flex">
            <Button variant={"ghost"} className="p-2">
              <Search size={25} />
            </Button>
            <Link href={"/"} className="transition-all hover:scale-105">
              Home
            </Link>
            <Link href={"/about"} className="transition-all hover:scale-105">
              About
            </Link>
            <Link
              href={"/search-donors"}
              className="transition-all hover:scale-105"
            >
              Search Donors
            </Link>
            <p className="transition-all hover:scale-105">Log In</p>
          </div>
        </div>
      </div>
    </header>
  );
}
