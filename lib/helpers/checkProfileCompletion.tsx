import { type ProfileType } from "@/app/profile/_components/ProfileView";
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const isProfileComplete = (p: ProfileType) => {
  if (!p) return false;

  return (
    p.age !== undefined &&
    p.bmi !== undefined &&
    p.bloodType !== undefined &&
    p.hemoglobinLevel !== undefined &&
    p.phoneNumber !== undefined &&
    p.division !== undefined &&
    p.district !== undefined &&
    p.subDistrict !== undefined
  );
};

export function checkProfileCompletion(profile: ProfileType, router: AppRouterInstance) {
  if (!isProfileComplete(profile)) {
    router.replace("/profile/setup");

    return null;
  }

  return null;
}
