"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { districts } from "@/assets/constants";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from "@/store/userData";
import { Suspense, useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { useRequestDonorMutation } from "@/query/requestDonor";
import { useProfileDetailsQuery } from "@/query/profile";

const formSchema = z.object({
  blood_group: z
    .string()
    .min(1, { message: "Please enter a valid blood group." }),
  blood_request_type: z.enum(["Running", "Pending", "Completed"], {
    message: "Please select a status.",
  }),
  district: z.string().min(1, { message: "District is required." }),
  gender: z.string({
    message: "Please select 'Male' or 'Female' for gender.",
  }),
  details: z.string().min(1, { message: "Details cannot be empty." }),
});

function getRandomNote(note: string) {
  const randomId = crypto.randomUUID();

  return `${randomId} ${note}`;
}

function getCurrentDateFormatted(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
}

function RequestDonor() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { userData } = useUserStore();
  const { toast } = useToast();
  const router = useRouter();
  const { mutate, isSuccess, isPending, isError } = useRequestDonorMutation();
  const { data: profileData } = useProfileDetailsQuery(
    userData ? parseInt(userData.userId!) : undefined,
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      blood_group: "",
      blood_request_type: "Pending",
      details: "",
      district: "",
      gender: "",
    },
  });

  useEffect(() => {
    if (!profileData) return;

    if (
      profileData.date_of_donation === null ||
      profileData.gender === "" ||
      profileData.district === ""
    ) {
      router.push("/profile");
    }
  }, [profileData]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (!date) {
      return toast({
        variant: "destructive",
        title: "User is not authenticated",
        description: `Please log in to do this operation `,
      });
    }

    if (!profileData) return;
    if (!profileData) return;
    if (!userData) return;

    const formValues = {
      req_donor_id: parseInt(`${profileData.id}`),
      user_id: parseInt(userData.userId!),
      blood_group: data.blood_group,
      blood_request_type: data.blood_request_type,
      district: data.district,
      date_of_donation: getCurrentDateFormatted(date),
      gender: data.gender,
      details: getRandomNote(data.details),
    };

    mutate({ data: formValues });
  }

  useEffect(() => {
    if (!userData) {
      router.replace("/login");
    }
  }, [userData]);

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Request is created",
        description: `Requested for a donor on ${getCurrentDateFormatted(date!)}`,
      });

      router.push("/dashboard");
    }

    if (isError) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: `Couldn't create the request.`,
      });
    }
  }, [isSuccess, isError]);

  return (
    <main className="min-h-[85dvh] bg-gray-100">
      <div className="mx-auto max-w-7xl px-2 py-8 xl:px-0">
        <h2 className="pb-8 text-center text-3xl font-bold text-rose-500">
          Request for Donation
        </h2>
        <Card className="mx-auto max-w-md p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="blood_group"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormLabel>Group</FormLabel>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a Blood Group" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select</SelectLabel>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <FormField
                control={form.control}
                name="blood_request_type"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select</SelectLabel>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem disabled={true} value="Running">
                            Running
                          </SelectItem>
                          <SelectItem disabled={true} value="Completed">
                            Completed
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                                  (district) => district.value === field.value,
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
                            <CommandEmpty>No district found.</CommandEmpty>
                            <CommandGroup>
                              {districts.map((district) => (
                                <CommandItem
                                  value={district.label}
                                  key={district.value}
                                  onSelect={() => {
                                    form.setValue("district", district.value);
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

              <FormField
                control={form.control}
                name="details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note</FormLabel>
                    <FormControl>
                      <Input placeholder="Note" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-3">
                <FormLabel>Select donation date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "flex-1 justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-end justify-end">
                <Button variant={"destructive"} type="submit">
                  {isPending ? <Loader2 className="animate-spin" /> : "Submit"}
                </Button>
              </div>
            </form>
          </Form>
        </Card>
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RequestDonor />
    </Suspense>
  );
}
