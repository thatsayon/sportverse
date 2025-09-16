import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


export interface CounterState {
 virtualFilter: "all" | "Virtual Trainers" | "Mindset Trainers",
}

const initialState: CounterState = {
    virtualFilter: "all"
};

export const trainerSlice = createSlice({
  name: "trainer",
  initialState,
  reducers: {
    setVirtualFilter: (state, action: PayloadAction<"all" | "Virtual Trainers" | "Mindset Trainers">) => {
      state.virtualFilter = action.payload;
    },
  },
});

export const { setVirtualFilter } = trainerSlice.actions;
export default trainerSlice.reducer;
