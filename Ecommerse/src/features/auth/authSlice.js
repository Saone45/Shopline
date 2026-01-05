import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';

// --- ASYNC THUNKS ---
export const registerUser = createAsyncThunk('auth/register', async (data, thunk) => {
  try { return await authService.register(data); } 
  catch (error) { return thunk.rejectWithValue(error.response?.data?.message || "Registration Failed"); }
});

export const loginUser = createAsyncThunk('auth/login', async (data, thunk) => {
  try { return await authService.login(data); } 
  catch (error) { return thunk.rejectWithValue(error.response?.data?.message || "Login Failed"); }
});

export const getUser = createAsyncThunk('auth/me', async (_, thunk) => {
  try { return await authService.me(); } 
  catch (error) { return thunk.rejectWithValue(error.response?.data?.message || "Session Expired"); }
});

export const forgotPassword = createAsyncThunk('auth/password/forgot', async (email, thunk) => {
  try { return await authService.forgot(email); } 
  catch (error) { return thunk.rejectWithValue(error.response?.data?.message || "Email not found"); }
});

export const resetPassword = createAsyncThunk('auth/password/reset/id', async (data, thunk) => {
  try { return await authService.reset(data); } 
  catch (error) { return thunk.rejectWithValue(error.response?.data?.message || "Reset failed"); }
});

export const updateProfile = createAsyncThunk('auth/profile/update', async (userData, thunk) => {
  try { return await authService.updateProfile(userData); } 
  catch (error) { return thunk.rejectWithValue(error.response?.data?.message || "Update failed"); }
});

export const updatePassword = createAsyncThunk('auth/password/update', async (passwords, thunk) => {
  try { return await authService.updatePassword(passwords); } 
  catch (error) { return thunk.rejectWithValue(error.response?.data?.message || "Update failed"); }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    logoutUser: (state) => {
      authService.logout();
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.successMessage = null;
    },
    clearAuthError: (state) => { 
      state.error = null; 
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // 1. Profile Update Success - Specific Handling
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Backend must return the updated user object
        state.successMessage = "Profile updated successfully";
      })

      // 2. Loading Matcher
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => { 
          state.loading = true; 
          state.error = null; 
          state.successMessage = null; 
        }
      )

      // 3. Auth Success (Login, Register, GetMe)
      .addMatcher(
        (action) => [
          loginUser.fulfilled.type, 
          registerUser.fulfilled.type, 
          getUser.fulfilled.type
        ].includes(action.type),
        (state, action) => {
          state.loading = false;
          state.isAuthenticated = true;
          state.user = action.payload;
        }
      )

      // 4. Feedback Matcher (Forgot, Reset, Update Password)
      .addMatcher(
        (action) => [
          forgotPassword.fulfilled.type, 
          resetPassword.fulfilled.type, 
          updatePassword.fulfilled.type
        ].includes(action.type),
        (state, action) => {
          state.loading = false;
          state.successMessage = action.payload?.message || "Action successful";
        }
      )

      // 5. Unified Error Matcher
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
          
          // CRITICAL: If me() fails, clear user data
          if (action.type.includes('auth/me')) {
            state.isAuthenticated = false;
            state.user = null;
          }
        }
      );
  }
});

export const { logoutUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;