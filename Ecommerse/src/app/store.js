import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Slices
import authReducer from '../features/auth/authSlice.js';
import cartReducer from '../features/cart/cartSlice.js';
import productReducer from '../features/products/productSlice.js';
import orderReducer from '../features/orders/orderSlice.js';
import profileReducer from '../features/profile/profileSlice.js';
import adminReducer from '../features/admin/adminSlice.js'; 

// 1. Combine all your reducers
const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  products: productReducer,
  orders: orderReducer,
  profile: profileReducer,
  admin: adminReducer, 
});

// 2. Configure Persistence
const persistConfig = {
  key: 'shopline_mobile_persist',
  storage: AsyncStorage,
  whitelist: ['auth', 'cart'], // Only auth and cart stay after app close
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// 3. Configure Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Required for Redux Persist compatibility
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);