import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface State {
    dme: number;
    data: Record<string, number>;
}

const initialState: State = {
  dme: 70,
  data: {"10": 9,
    "20": 8,
    "30": 7,
    "40": 6,
    "50": 5,
    "60": 5,
    "70": 3,
    "80": 2,
    "90": 1,
    "100": 0,
    "110": 1,
    "120": 1,
    "130": 0,
    "140": 0,
    "150": 0,
    "160": 0,
  "id": 1},
};

export const slice = createSlice({
  name: 'reforestation',
  initialState,
  reducers: {
    setDME: (
      state,
      action: PayloadAction<number>,
    ) => {
      const val = action.payload;
      state.dme = val;
    },
    setData: (
        state,
        action: PayloadAction<Record<string, number>>,
      ) => {
        const data = action.payload;
        state.data = data;
      },
  },
});

export const {setData, setDME} = slice.actions;

export function selectData(state: RootState): Record<string, number> {
  return state.reforestation.present.data;
}
export function selectDME(state: RootState): number {
  return state.reforestation.present.dme;
}