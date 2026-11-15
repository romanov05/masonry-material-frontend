import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import masonryMaterialReducer from './slices/masonryMaterialSlice';
import masonryMaterialUserReducer from './slices/masonryMaterialUserSlice';

export const store = configureStore({
  reducer: {
    masonryMaterial: masonryMaterialReducer,
    masonryMaterialUser: masonryMaterialUserReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useMasonryMaterialDispatch = useDispatch.withTypes<AppDispatch>();
export const useMasonryMaterialSelector = useSelector.withTypes<RootState>();
