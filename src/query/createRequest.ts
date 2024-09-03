import { useMutation, useQueryClient } from "@tanstack/react-query";

type Props = {
  formValues: {
    user_id: number;
    blood_group: string;
    blood_request_type: "Completed" | "Running" | "Pending";
    district: string;
    date_of_donation: string;
    gender: string;
    details: string;
  };
};

export function useCreateRequestMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["create-request"],
    mutationFn: async ({ formValues }: Props) => {
      await fetch(`https://life-donors.onrender.com/users/create/request/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  return { ...mutation };
}
