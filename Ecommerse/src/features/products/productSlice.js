import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig.js';

// Fetch all products
export const fetchProducts = createAsyncThunk('products/fetchAll', async (params, { rejectWithValue }) => {
    try {
        const response = await api.get('/product/fetchAll', { params });
        return response.data; 
    } catch (error) {
        return rejectWithValue(error.response?.data || "Network Error");
    }
});

// Fetch single product details - MATCHES YOUR BACKEND ROUTE
export const fetchProductById = createAsyncThunk(
    'products/fetchById', 
    async (id, { rejectWithValue }) => {
        try {
            // FIX: Uses the exact route defined in your backend: /product/singleProduct/:productId
            const response = await api.get(`/product/singleProduct/${id}`);
            
            // Handle the HTML 404 error from your screenshot
            if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
                return rejectWithValue("Route Mismatch: Check Backend URL");
            }

            return response.data; 
        } catch (error) {
            // Extracts the custom ErrorHandler message from your backend controller
            return rejectWithValue(error.response?.data?.message || "Product not found");
        }
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState: { 
        items: [], 
        selectedItem: null, 
        loading: false, 
        error: null 
    },
    reducers: {
        // Resets state to stop infinite buffering
        clearSelectedProduct: (state) => {
            state.selectedItem = null;
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.products || [];
            })
            // Handle Fetch Single Product
            .addCase(fetchProductById.pending, (state) => {
                state.loading = true; // Starts the ActivityIndicator
                state.error = null;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.loading = false; // STOPS the spinner
                // Matches res.status(200).json({ success:true, product: {...} })
                state.selectedItem = action.payload.product || action.payload;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.loading = false; // STOPS the spinner on error
                state.error = action.payload;
            });
    }
});

export const { clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;