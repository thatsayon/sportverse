import { configureStore } from '@reduxjs/toolkit'
import stateReducer from "./Slices/stateSlice"
import {apiSlice} from "./Slices/apiSlice"


export const makeStore = () => {
  return configureStore({
    reducer: {
        state: stateReducer,
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: (getDefaultMiddleware)=>
        getDefaultMiddleware().concat(apiSlice.middleware)
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']