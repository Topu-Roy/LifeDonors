import CTA from "@/components/home/CTA";
import Stats from "@/components/home/stats";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";
import SparklesText from "@/components/ui/sparkleText";
import Image from "next/image";
import LoginImage from "@/assets/images/login.png";
import RegisterImage from "@/assets/images/register.png";

function HomePage() {
  return (
    <>
      <section className="h-[80dvh] w-full bg-rose-100">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-center px-2 xl:px-0">
          <div className="flex h-full max-w-[80%] flex-col items-center justify-center gap-6 text-center">
            <div className="space-y-4 text-gray-900">
              <SparklesText
                className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-8xl"
                text="Platform to Connect, Donate, and Save Lives"
              />

              <p className="text-lg md:text-xl">
                LifeDonors is a free platform to help blood searchers or
                patients connect with voluntary blood donors across Bangladesh.
                Your donation is a ray of hope for someone in need.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <CTA />
              <Link href="/request-donor">
                <Button variant="destructive" className="px-6 py-8">
                  Request Donor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="flex min-h-[80dvh] w-full items-center justify-center space-y-8 py-20">
        <div className="mx-auto flex h-full w-full max-w-7xl flex-col items-center justify-center gap-8 px-2 text-center md:text-left xl:px-0">
          {/* First Row: Content Left, Image Right */}
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-4">
            {/* Content */}
            <div className="w-full">
              <h1 className="text-balance text-4xl font-bold">
                What is LifeDonors?
              </h1>
              <p className="text-balance pt-4">
                LifeDonors is an automated blood service that connects blood
                searchers with voluntary donors in a moment through SMS.
                LifeDonors is always a free service for all.
              </p>
              <Link href={"/about"}>
                <Button className="mt-10 rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600">
                  Learn More
                </Button>
              </Link>
            </div>
            {/* Image */}
            <div className="flex w-full justify-center">
              <Image
                src={LoginImage}
                alt="LifeDonors"
                className="w-full rounded-lg md:max-w-md"
              />
            </div>
          </div>

          {/* Second Row: Image Left, Content Right */}
          <div className="grid w-full grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-4 md:pt-8">
            {/* Image */}
            <div className="order-2 flex w-full justify-start md:order-1">
              <Image
                src={RegisterImage}
                alt="Why LifeDonors?"
                className="w-full rounded-lg md:max-w-md"
              />
            </div>
            {/* Content */}
            <div className="order-1 w-full md:order-2">
              <h1 className="text-balance text-4xl font-bold">
                Why LifeDonors?
              </h1>
              <ul className="list-inside list-disc pt-4 text-left">
                <li>100% Automated</li>
                <li>Always free</li>
                <li>24x7 service</li>
                <li>All data is secured</li>
              </ul>
              <Link href={"/about"}>
                <Button className="mt-10 rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Stats />

      <section className="mx-auto flex min-h-[80dvh] w-full max-w-7xl items-center justify-center space-y-8">
        <div className="flex h-full w-full flex-col items-center justify-center gap-4">
          <h1 className="text-balance text-4xl font-bold">About Us</h1>
          <p className="mx-auto w-[90%] text-balance text-center md:w-[50%]">
            LifeDonors is an automated blood service that connects blood
            searchers with voluntary blood donors in a moment through SMS.
            LifeDonors is a not-for-profit initiative to aware people of
            voluntary blood donation in Bangladesh.
          </p>
          <Link href={"/about"}>
            <Button variant={"destructive"} className="mx-auto px-4">
              Learn More
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePage />
    </Suspense>
  );
}
