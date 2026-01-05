import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

export const fetchOrders = createAsyncThunk('orders/me', async (_, thunkAPI) => {
  try {
    const response = await api.get('/order/orders/me');
    // Extracting 'myOrder' from the response object
    return response.data.myOrder; 
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
  }
});

export const placeNewOrder = createAsyncThunk('order/new', async (orderData, thunkAPI) => {
  try {
    const response = await api.post('/order/new', orderData);
    // Returning the whole response so we have access to orderId and paymentIntent
    return response.data; 
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to place order");
  }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    list: [],
    currentOrder: null, 
    paymentIntent: null, // Added to store Stripe client secret
    loading: false,
    error: null,
    orderSuccess: false,
  },
  reducers: {
    resetOrderState: (state) => {
      state.orderSuccess = false;
      state.error = null;
      state.currentOrder = null;
      state.paymentIntent = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => { state.loading = true; })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload; // Successfully sets the array of orders
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Place New Order
      .addCase(placeNewOrder.pending, (state) => { 
        state.loading = true; 
        state.orderSuccess = false;
      })
      .addCase(placeNewOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderSuccess = true;
        // Accessing keys from your specific JSON response
        state.currentOrder = action.payload.orderId; 
        state.paymentIntent = action.payload.paymentIntent;
        
        // Since the backend doesn't return the full order object here, 
        // it's better to just set success and re-fetch orders later or 
        // handle the transition to the Payment screen.
      })
      .addCase(placeNewOrder.rejected, (state, action) => {
        state.loading = false;
        state.orderSuccess = false;
        state.error = action.payload;
      });
  }
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;