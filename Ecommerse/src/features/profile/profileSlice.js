import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

export const fetchProfile = createAsyncThunk('profile/fetch', async (_, thunkAPI) => {
  try {
    const response = await api.get('/user/profile');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const profileSlice = createSlice({
  name: 'profile',
  initialState: { data: null, addresses: [], loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => { state.loading = true; })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.addresses = action.payload.addresses;
      });
  }
});

export default profileSlice.reducer;