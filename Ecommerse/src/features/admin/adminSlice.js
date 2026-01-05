import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig.js';



// 0. Fetch All Products (Admin)
export const getAllProducts = createAsyncThunk(
  'admin/getAllProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/product/fetchAll'); 
      return response.data.products;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch products");
    }
  }
);

// 1. Fetch Dashboard Analytics
export const fetchDashboardStats = createAsyncThunk(
  'admin/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/fetch/dashboard-stats');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch stats");
    }
  }
);

// 2. Fetch All Orders (Admin)
export const getAllOrders = createAsyncThunk(
  'admin/getAllOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/order/admin/getall');
      return response.data.orders; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
    }
  }
);

// 3. Update Order Status
export const updateOrderStatus = createAsyncThunk(
  'admin/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/order/admin/update/${orderId}`, { status });
      return { orderId, status: response.data.updatedOrder.order_status };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Update failed");
    }
  }
);

// 4. Create New Product
export const createProduct = createAsyncThunk(
  'admin/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await api.post('/product/admin/create', productData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.product;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Product creation failed");
    }
  }
);

// 5. Delete Product
export const deleteProduct = createAsyncThunk(
  'admin/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/product/admin/delete/${id}`);
      return id; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Delete failed");
    }
  }
);

// 6. Fetch All Users
export const getAllUsers = createAsyncThunk(
  'admin/getAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/getallusers');
      return response.data.users;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch users");
    }
  }
);

// 7. Update User Role
export const updateUserRole = createAsyncThunk(
  'admin/updateUserRole',
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/user/${userId}`, { role });
      return { userId, role: response.data.user.role };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update role");
    }
  }
);

// 8. Delete User
export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/delete/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Delete failed");
    }
  }
);

// 9. Fetch All Reviews (Phase 7)
export const getAllReviews = createAsyncThunk(
  'admin/getAllReviews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/reviews');
      return response.data.reviews;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch reviews");
    }
  }
);

// 10. Delete Review (Phase 7)
export const deleteReview = createAsyncThunk(
  'admin/deleteReview',
  async ({ reviewId, productId }, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/review?id=${reviewId}&productId=${productId}`);
      return reviewId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Delete failed");
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    stats: null,
    orders: [],
    users: [],
    products: [], // FIXED: Added to prevent ManageProducts crash
    reviews: [],
    loading: false,
    error: null,
    isSuccess: false,
  },
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
    resetAdminStatus: (state) => {
      state.isSuccess = false;
      state.error = null;
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      /* --- Dashboard Stats --- */
      .addCase(fetchDashboardStats.pending, (state) => { state.loading = true; })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* --- Get All Products --- */
      .addCase(getAllProducts.pending, (state) => { state.loading = true; })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* --- Get All Orders --- */
      .addCase(getAllOrders.pending, (state) => { state.loading = true; })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* --- Create Product --- */
      .addCase(createProduct.pending, (state) => { state.loading = true; })
      .addCase(createProduct.fulfilled, (state) => {
        state.loading = false;
        state.isSuccess = true;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* --- Delete Product --- */
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(p => p._id !== action.payload);
        state.isSuccess = true;
      })

      /* --- User Management --- */
      .addCase(getAllUsers.pending, (state) => { state.loading = true; })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false; // FIXED: Stops infinite buffering on failure
        state.error = action.payload;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u._id === action.payload.userId);
        if (index !== -1) {
          state.users[index].role = action.payload.role;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u._id !== action.payload);
      })

      /* --- Review Management --- */
      .addCase(getAllReviews.pending, (state) => { state.loading = true; })
      .addCase(getAllReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(getAllReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter(r => r._id !== action.payload);
      });
  }
});

export const { clearAdminError, resetAdminStatus } = adminSlice.actions;
export default adminSlice.reducer;