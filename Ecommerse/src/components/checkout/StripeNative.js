import { useStripe } from '@stripe/stripe-react-native';
import { getPaymentSheetParams } from '../../api/stripeApi';

export const useStripePayment = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const initializePayment = async (amount) => {
    const { paymentIntent, customer, ephemeralKey } = await getPaymentSheetParams(amount);

    const { error } = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      merchantDisplayName: 'Shopline Business',
      allowsDelayedPaymentMethods: true,
    });

    return { error };
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();
    return { error };
  };

  return { initializePayment, openPaymentSheet };
};