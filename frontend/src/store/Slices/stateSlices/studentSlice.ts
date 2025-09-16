import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


export interface CounterState {
    callConfig: any,
}

const initialState: CounterState = {
    callConfig: {}
};

export const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    setCallConfig: (state, action: PayloadAction<any>) => {
      state.callConfig = action.payload;
    },
  },
});

export const { setCallConfig } = studentSlice.actions;
export default studentSlice.reducer;
