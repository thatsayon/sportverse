import { AgoraTokenResponse } from "@/types/teacher/dashboard";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


interface CallConfig {
  appId: string;
  channelName: string;
  expireAt: number;
  token: string;
  uid?: number;
}

export interface CounterState {
    callConfig: AgoraTokenResponse,
}

const initialState: CounterState = {
    callConfig: {
      appId: "",
      channelName: "",
      expireIn: 0,
      token:"",
    }
};

export const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    setCallConfig: (state, action: PayloadAction<AgoraTokenResponse>) => {
      state.callConfig = action.payload;
    },
  },
});

export const { setCallConfig } = studentSlice.actions;
export default studentSlice.reducer;
