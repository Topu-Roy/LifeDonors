import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

const userProfileSchema = z.object({
  user: z.string(),
  blood_group: z.string(),
  district: z.string(),
  date_of_donation: z.string().nullable(),
  gender: z.string(),
  is_available: z.boolean(),
});

const apiResponseSchema = z.array(userProfileSchema);

export function useProfileMutation() {
  const mutation = useMutation({
    mutationKey: ["profile"],
    mutationFn: async ({ id }: { id: number }) => {
      const response = await fetch(
        `https://life-donors.onrender.com/users/profile/${id}/`,
      );
      const data: unknown = await response.json();

      const validatedData = apiResponseSchema.parse(data);

      return validatedData;
    },
  });

  return { ...mutation };
}
