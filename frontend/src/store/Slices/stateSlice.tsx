import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface userType {
  user_id?: string;
  username?: string;
  email: string;
  full_name?: string;
  profile_pic?: string;
}
export interface CounterState {
  value: number;
  user: userType;
  userQuery: string;
}

const initialState: CounterState = {
  value: 12,
  user: {
    user_id: "",
    username: "",
    email: "",
    full_name: "",
    profile_pic: "",
  },
  userQuery: "",
};

export const stateSclice = createSlice({
  name: "state",
  initialState,
  reducers: {
    setValue: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
    setUser: (state, action: PayloadAction<userType>) => {
      state.user = action.payload;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.user.email = action.payload;
    },
    setUserQuery: (state, action: PayloadAction<string>) => {
      state.userQuery = action.payload;
    },
  },
});

export const { setValue, setUser, setEmail, setUserQuery } = stateSclice.actions;
export default stateSclice.reducer;
