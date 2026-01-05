import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PersistGate } from 'redux-persist/integration/react';
import { StripeProvider } from '@stripe/stripe-react-native'; // Import Stripe Provider

// Import both store and persistor
import { store, persistor } from './src/app/store.js'; 
import AppNavigator from './src/navigation/AppNavigator.js';
import { getUser } from './src/features/auth/authSlice.js';

/**
 * AppRoot handles the initial data fetching once the store is ready.
 */
function AppRoot() {
  const dispatch = useDispatch();

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        // This ensures the header is set and user data is synced with the backend
        await dispatch(getUser()).unwrap();
      } catch (e) {
        console.log("No active session or session expired");
      }
    };

    bootstrapAsync();
  }, [dispatch]);

  return <AppNavigator />;
}

export default function App() {
  return (
    // Replace with your actual Stripe Publishable Key from your Stripe Dashboard
    <StripeProvider publishableKey="pk_test_51PFZoYSC1J3D9JqiXln1pZvUC0wCUDDCWx9ZoN9K1RKsfFLJ3GDOH1Tswg3XS1TXxCE73vhKRnV3PtOsKDA5CR9Z00keqjn9h5">
      <Provider store={store}>
        {/* PersistGate delays rendering until the persisted state has been retrieved */}
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaProvider>
            <NavigationContainer>
              <AppRoot />
            </NavigationContainer>
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </StripeProvider>
  );
}