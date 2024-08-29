import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserRound } from "lucide-react";

export default function SearchDonorsPage() {
  return (
    <main>
      <div className="w-full bg-rose-50">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-center gap-4 py-8">
          <input
            type="text"
            placeholder="jhon doe"
            className="flex-1 rounded-md border border-black/20 bg-slate-100 px-4 py-3"
          />
          <Button className="px-8 py-6">Search</Button>
        </div>
      </div>

      <div className="w-full py-4">
        <div className="mx-auto w-full max-w-7xl space-y-4">
          <p className="bg-destructive px-8 py-4 font-semibold text-white">
            69 donors found
          </p>
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 20 }, (_, index) => (
              <Card
                key={index}
                className="flex items-center justify-center p-4"
              >
                <UserRound size={50} className="w-[20%] text-destructive" />
                <div className="w-full flex-1">
                  <div className="flex w-full items-start justify-start">
                    <p className="w-[25%]">Name</p>
                    <p className="flex-1 pl-2">Jhon Doe</p>
                  </div>
                  <div className="flex items-start justify-start">
                    <p className="w-[25%]">Group</p>
                    <p className="flex-1 pl-2">A+</p>
                  </div>
                  <div className="flex items-start justify-start">
                    <p className="w-[25%]">District</p>
                    <p className="flex-1 pl-2">Dhaka</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
