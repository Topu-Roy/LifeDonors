"use client";

import { Card } from "@/components/ui/card";
import {
  useProfileDetailsQuery,
  useUpdateProfileMutation,
} from "@/query/profile";
import { useUserStore } from "@/store/userData";
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  Loader2,
  UserCog,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { districts } from "@/assets/constants";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  district: z.string().min(2, {
    message: "Please select a district",
  }),
  gender: z
    .string()
    .min(2, { message: "Please select 'Male' or 'Female' for gender." }),
});

function getCurrentDateFormatted(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
}

function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const userData = useUserStore((state) => state.userData);
  const [open, setOpen] = useState(false);
  const [requestDate, setRequestDate] = useState<Date | undefined>(undefined);
  const { data, isLoading, isError, error } = useProfileDetailsQuery(
    userData ? parseInt(userData.userId!) : undefined,
  );
  const {
    mutate: updateProfile,
    isPending,
    isError: isError_update,
  } = useUpdateProfileMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      district: "",
      gender: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!requestDate) {
      return toast({
        variant: "destructive",
        title: "Date is not selected",
        description: "Please select date of your last donation first.",
      });
    }

    if (!userData) {
      return toast({
        variant: "destructive",
        title: "Auth data not found",
        description: "Please make sure you are authenticated",
      });
    }

    setOpen(false);
    updateProfile({
      id: userData.userId!,
      district: values.district,
      gender: values.gender,
      lastDonation: getCurrentDateFormatted(requestDate),
    });
  }

  useEffect(() => {
    if (!userData) {
      router.push("/login");
    }
  }, [userData]);

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="min-h-[85dvh]">
      <div className="mx-auto max-w-7xl">
        <h2 className="mx-auto max-w-7xl py-8 text-center text-3xl font-bold">
          My Profile
        </h2>
        <div className="flex flex-col items-center justify-center">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center justify-center gap-3 py-6">
                {isPending ? (
                  <>
                    Updating
                    <Loader2 className="animate-spin" />
                  </>
                ) : (
                  <>
                    Update
                    <UserCog />
                  </>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update your profile to make donations</DialogTitle>
                <DialogContent>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="w-full space-y-8"
                    >
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormLabel>Gender</FormLabel>
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select Gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Select</SelectLabel>
                                  <SelectItem value="Male">Male</SelectItem>
                                  <SelectItem value="Female">Female</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex flex-col gap-3">
                        <FormLabel>Select a date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "flex-1 justify-start text-left font-normal",
                                !requestDate && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {requestDate ? (
                                format(requestDate, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={requestDate}
                              onSelect={setRequestDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <FormField
                        control={form.control}
                        name="district"
                        render={({ field }) => (
                          <FormItem className="flex flex-1 flex-col">
                            <Popover>
                              <FormLabel>District</FormLabel>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                      "justify-between",
                                      !field.value && "text-muted-foreground",
                                    )}
                                  >
                                    {field.value !== ""
                                      ? districts.find(
                                          (district) =>
                                            district.value === field.value,
                                        )?.label
                                      : "Select district"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-[200px] p-0">
                                <Command>
                                  <CommandInput placeholder="Search district..." />
                                  <CommandList>
                                    <CommandEmpty>
                                      No district found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {districts.map((district) => (
                                        <CommandItem
                                          value={district.label}
                                          key={district.value}
                                          onSelect={() => {
                                            form.setValue(
                                              "district",
                                              district.value,
                                            );
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              district.value === field.value
                                                ? "opacity-100"
                                                : "opacity-0",
                                            )}
                                          />
                                          {district.label}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit">Submit</Button>
                    </form>
                  </Form>
                </DialogContent>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          {data
            ? data.map((profile, index) => (
                <Card key={index} className="w-full max-w-xl p-4">
                  <div className="flex items-center justify-between py-3">
                    <p>Username</p>
                    <p>{profile.user}</p>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <p>Blood Group</p>
                    <p>{profile.blood_group}</p>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <p>District</p>
                    <p>{profile.district || "N/A"}</p>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <p>Last Donation</p>
                    <p>{profile.date_of_donation ?? "N/A"}</p>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <p>Gender</p>
                    <p>{profile.gender || "N/A"}</p>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <p>Available</p>
                    <p>{profile.is_available ? "Yes" : "No"}</p>
                  </div>
                </Card>
              ))
            : null}

          {isLoading ? (
            <div className="p-8">
              <Loader2 className="animate-spin" />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfilePage />
    </Suspense>
  );
}
