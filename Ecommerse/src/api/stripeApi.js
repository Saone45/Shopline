import api from './axiosConfig';

export const getPaymentSheetParams = async (amount) => {
    try {
        const response = await api.post('/payments/payment-sheet', { amount });
        return response.data; // Expecting { paymentIntent, ephemeralKey, customer }
    } catch (error) {
        throw error.response?.data || "Could not initialize payment sheet";
    }
};

export const verifyPayment = async (paymentIntentId) => {
    const response = await api.get(`/payments/verify/${paymentIntentId}`);
    return response.data;
};