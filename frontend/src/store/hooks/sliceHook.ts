import { RootState } from "../store";
import { useAppSelector } from "./hooks";

export const useStateSlice = () => {
  return useAppSelector((state: RootState) => state.state);
};
