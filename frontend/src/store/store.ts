import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { persistReducer, persistStore } from 'redux-persist'

// Existing imports
import stateReducer from "./Slices/stateSlices/stateSlice"
import { apiSlice } from "./Slices/apiSlices/apiSlice"

// ✅ New imports
import trainerReducer from "./Slices/stateSlices/trainerStateSlice"
import studentReducer from "./Slices/stateSlices/studentSlice"

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['state', 'trainer', 'student'], // persist these slices
}

const rootReducer = combineReducers({
  state: stateReducer,
  trainer: trainerReducer,   // ✅ added
  student: studentReducer,   // ✅ added
  [apiSlice.reducerPath]: apiSlice.reducer, // RTK Query state (not persisted)
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, // ⚠️ needed for redux-persist
      }).concat(apiSlice.middleware),
  })

  setupListeners(store.dispatch)
  return store
}

// Types
export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

// Persistor
export const makePersistor = (store: AppStore) => persistStore(store)
