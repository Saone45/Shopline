import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL configuration
// Note: 10.0.2.2 is for Android Emulator. Use your local IP or localhost for iOS.
const API_URL = 'http://10.0.2.2:4000/api/v1/auth';

/**
 * Helper to set the Authorization header for all future requests
 * This ensures the token is attached to every private API call.
 */
const setAuthToken = async (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    await AsyncStorage.setItem('userToken', token);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    await AsyncStorage.removeItem('userToken');
  }
};

// 1. Register
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  // Expecting: { success: true, user: {...}, token: "..." }
  if (response.data.token) {
    await setAuthToken(response.data.token);
  }
  return response.data.user; 
};

// 2. Login
const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  // Expecting: { success: true, user: {...}, token: "..." }
  if (response.data.token) {
    await setAuthToken(response.data.token);
  }
  return response.data.user;
};

// 3. Get User (Me) - Used for persistence on app launch
const me = async () => {
  const token = await AsyncStorage.getItem('userToken');
  if (!token) throw new Error("No session found");
  
  // Explicitly set the header before the request to avoid 401 errors
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_URL}/me`, config);
  
  // Re-sync the global defaults just in case
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
  return response.data.user;
};

// 4. Forgot Password
const forgot = async (email) => {
  const response = await axios.post(`${API_URL}/password/forgot`, { email });
  return response.data; 
};

// 5. Reset Password
const reset = async (data) => {
  // data includes { id, password }
  const response = await axios.post(`${API_URL}/password/reset/id`, data);
  return response.data;
};

// 6. Update Profile
const updateProfile = async (userData) => {
  const response = await axios.put(`${API_URL}/profile/update`, userData);
  return response.data.user;
};

// 7. Update Password (while logged in)
const updatePassword = async (passwords) => {
  const response = await axios.put(`${API_URL}/password/update`, passwords);
  return response.data;
};

// 8. Logout
const logout = async () => {
  await setAuthToken(null);
};

const authService = {
  register,
  login,
  me,
  forgot,
  reset,
  updateProfile,
  updatePassword,
  logout,
};

export default authService;