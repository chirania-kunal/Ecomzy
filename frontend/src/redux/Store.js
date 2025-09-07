import cartReducer from './Slices/CartSlice';
import authReducer from './Slices/AuthSlice';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
  },
});

export default store;
