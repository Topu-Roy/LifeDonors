import { useUserStore } from "@/store/userData";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

const RequestSchema = z.object({
  blood_group: z.string(),
  blood_request_type: z.string(),
  date_of_donation: z.string().nullable(),
  details: z.string(),
  district: z.string(),
  donor: z.string(),
  gender: z.enum(["Male", "Female", "Other"]),
});

const ApiResponseSchema = z.object({
  donor_id: z.number(),
  my_requests: z.array(RequestSchema).nullable(),
});

export function useDashboardQuery() {
  const authData = useUserStore((store) => store.userData);
  const query = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      if (authData) {
        const response_Dashboard = await fetch(
          `https://life-donors.onrender.com/users/dashboard/${parseInt(authData.userId!) - 1}/`,
        );

        const data: unknown = await response_Dashboard.json();
        const parsedData = ApiResponseSchema.parse(data);

        return parsedData;
      }
    },
  });

  return { ...query };
}
