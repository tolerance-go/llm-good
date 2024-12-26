import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    // 这里后续会添加各个 slice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 