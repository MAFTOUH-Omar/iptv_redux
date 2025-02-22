import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import packageReducer from './slices/packageSlice';
import templateReducer from './slices/templateSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        packages: packageReducer,
        templates: templateReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;