import { configureStore } from '@reduxjs/toolkit'
import { slice } from './reforestation.slice'
import undoable from 'redux-undo';

const undoableSliceReducer = undoable(slice.reducer);

export const makeStore = () => {
  return configureStore({
    reducer: {[slice.name]: undoableSliceReducer,}
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']