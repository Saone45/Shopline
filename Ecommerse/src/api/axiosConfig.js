import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
    // REPLACE WITH YOUR MACHINE'S IP (e.g., 192.168.1.5) to work on physical devices
    baseURL: 'http://10.0.2.2:4000/api/v1', // Default for Android Emulator
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await AsyncStorage.removeItem('accessToken');
            // App will automatically redirect via Auth listener in AppRoutes
        }
        return Promise.reject(error);
    }
);

export default api;