import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// гость: isAuthenticated = false; пользователь: true
interface MasonryMaterialUserState {
  login: string;
  isAuthenticated: boolean;
}

const initialState: MasonryMaterialUserState = {
  login: '',
  isAuthenticated: false,
};

// состояние меняется вручную после запросов входа и выхода (без thunk)
const masonryMaterialUserSlice = createSlice({
  name: 'masonryMaterialUser',
  initialState,
  reducers: {
    setMasonryMaterialUser(state, action: PayloadAction<string>) {
      state.login = action.payload;
      state.isAuthenticated = true;
    },
    resetMasonryMaterialUser() {
      return initialState;
    },
  },
});

export const { setMasonryMaterialUser, resetMasonryMaterialUser } = masonryMaterialUserSlice.actions;
export default masonryMaterialUserSlice.reducer;
