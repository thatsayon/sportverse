import { RootState } from "../store";
import { useAppSelector } from "./hooks";

export const useStateSlice = () => {
  return useAppSelector((state: RootState) => state.state);
};
export const useTrainerSlice = () => {
  return useAppSelector((state: RootState) => state.trainer);
};
export const useStudentSlice = () => {
  return useAppSelector((state: RootState) => state.student);
};
