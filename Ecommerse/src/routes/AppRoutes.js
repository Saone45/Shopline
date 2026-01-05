import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';

import Home from '../pages/Home';
import Search from '../pages/Search';
import CartPage from '../pages/CartPage';
import ProfilePage from '../pages/ProfilePage';
import ProductPage from '../pages/ProductPage';
import CheckoutPage from '../pages/CheckoutPage';
import OrdersHistory from '../pages/OrdersHistory';
import DeliveryStatus from '../pages/DeliveryStatus';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Search" component={Search} />
        <Tab.Screen name="Bag" component={CartPage} />
        <Tab.Screen name="Profile" component={ProfilePage} />
    </Tab.Navigator>
);

const AppRoutes = () => {
    const { isAuthenticated } = useSelector(state => state.auth);

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {/* Always stack Main, sub-pages are navigated from there */}
                <Stack.Screen name="Main" component={MainTabs} />
                <Stack.Screen name="ProductDetail" component={ProductPage} />
                <Stack.Screen name="Checkout" component={CheckoutPage} />
                <Stack.Screen name="OrderHistory" component={OrdersHistory} />
                <Stack.Screen name="Tracking" component={DeliveryStatus} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppRoutes;