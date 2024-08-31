import { useContext } from "react";
import { AuthContext } from "../authContext";

export default function useAuthContext() {
  const everything = useContext(AuthContext);

  if (!everything) {
    throw Error("AuthContext must be wrapped");
  }

  return { ...everything };
}
