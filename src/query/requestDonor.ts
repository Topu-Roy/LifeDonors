import { useMutation } from "@tanstack/react-query";

type Props = {
  data: {
    user_id: number;
    blood_group: string;
    blood_request_type: "Running" | "Pending" | "Completed";
    district: string;
    date_of_donation: string;
    gender: string;
    details: string;
  };
};

export function useRequestDonorMutation() {
  const mutation = useMutation({
    mutationKey: ["request-donor"],
    mutationFn: async ({ data }: Props) => {
      await fetch(`https://life-donors.onrender.com/users/create/request/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    },
  });

  return { ...mutation };
}
