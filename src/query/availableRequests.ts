import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

const DonationRequestSchema = z.object({
  donor: z.string(),
  id: z.number(),
  blood_group: z.string(),
  blood_request_type: z.enum(["Pending", "Running", "Completed"]),
  district: z.string(),
  date_of_donation: z.string(),
  gender: z.enum(["Male", "Female"]),
  accepted_donor_id: z.string().optional(),
  details: z.string(),
});

export type RequestType = z.infer<typeof DonationRequestSchema>;
const DonationRequestsSchema = z.array(DonationRequestSchema);

export function useAvailableRequestsMutation() {
  const query = useMutation({
    mutationKey: ["available-requests"],
    mutationFn: async ({ userId }: { userId: string }) => {
      const response = await fetch(
        `https://life-donors.onrender.com/users/available_request/?donor_id=${userId}`,
      );

      if (response.ok) {
        const data: unknown = await response.json();
        const parsedData = DonationRequestsSchema.parse(data);

        return parsedData;
      }
    },
  });

  return { ...query };
}
