import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { persistReducer, persistStore } from 'redux-persist'

import stateReducer from "./Slices/stateSlices/stateSlice"
import { apiSlice } from "./Slices/apiSlices/apiSlice"

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['state'], // ✅ only persist your custom state slice
}

const rootReducer = combineReducers({
  state: stateReducer,
  [apiSlice.reducerPath]: apiSlice.reducer, // RTK Query state is NOT persisted
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, // ⚠️ redux-persist uses non-serializable values
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
