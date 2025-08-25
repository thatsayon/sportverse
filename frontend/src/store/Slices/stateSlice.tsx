import { createSlice } from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit"

export interface CounterState {
    value: number;
}

const initialState: CounterState = {
  value: 12,
}

export const stateSclice = createSlice({
    name: "state",
    initialState,
    reducers:{
        setValue: (state, action: PayloadAction<number>)=>{
            state.value = action.payload
        }
    }
})

export const {setValue} = stateSclice.actions
export default stateSclice.reducer