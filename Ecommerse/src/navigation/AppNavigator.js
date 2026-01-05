import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';

// Page Imports
import Home from '../pages/Home.jsx';
import SearchPage from '../pages/Search.jsx';
import CartPage from '../pages/CartPage.jsx';
import ProfilePage from '../pages/ProfilePage.jsx';
import Support from '../pages/Support.jsx';
import ProductPage from '../pages/ProductPage.jsx';

// Auth & Protected Screens
import LoginScreen from '../pages/LoginScreen.jsx';
import RegisterScreen from '../pages/RegisterScreen.jsx';
import ForgotPassword from '../pages/ForgotPass.jsx';
import ResetPassword from '../pages/ResetPassword.jsx';
import EditProfileScreen from '../pages/EditProfile.jsx'; 
import OrdersHistoryScreen from '../pages/OrdersHistory.jsx';
import AddressScreen from '../pages/Address.jsx';
import PaymentScreen from '../pages/Payment.jsx';
import SettingsScreen from '../pages/Settings.jsx';

// Admin Screens
import AdminDashboard from '../pages/Admin/AdminDashboard.jsx';
import ManageOrders from '../pages/Admin/ManageOrders.jsx';
import ManageProducts from '../pages/Admin/ManageProducts.jsx';
import CreateProduct from '../pages/Admin/CreateProduct.jsx';
import ManageUsers from '../pages/Admin/ManageUsers.jsx';
import ManageReviews from '../pages/Admin/ManageReviews.jsx'; // <-- ADDED FOR PHASE 7

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function BottomTabs({ navigation }) {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerTitle: 'SHOPLINE',
        headerTitleStyle: styles.headerTitle,
        headerRight: () => (
          <TouchableOpacity style={{ marginRight: 20 }} onPress={() => navigation.navigate('Support')}>
            <Icon name="headphones" size={20} color="#111827" />
          </TouchableOpacity>
        ),
        tabBarActiveTintColor: '#111827',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ color, size }) => {
          let iconName = route.name === 'Home' ? 'home' : route.name === 'Search' ? 'search' : route.name === 'Bag' ? 'shopping-bag' : 'user';
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Search" component={SearchPage} />
      <Tab.Screen 
        name="Bag" 
        component={CartPage} 
        listeners={{ tabPress: (e) => { if (!isAuthenticated) { e.preventDefault(); navigation.navigate('Login'); } } }} 
      />
      <Tab.Screen name="Profile" component={ProfilePage} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={BottomTabs} />
      <Stack.Screen name="ProductDetails" component={ProductPage} />
      <Stack.Screen name="Support" component={Support} options={{ headerShown: true }} />

      {isAuthenticated ? (
        <>
          <Stack.Group screenOptions={{ headerShown: true }}>
            <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
            <Stack.Screen name="OrdersHistory" component={OrdersHistoryScreen} options={{ title: 'My Orders' }} />
            <Stack.Screen name="Address" component={AddressScreen} options={{ title: 'Shipping Address' }} />
            <Stack.Screen name="Payment" component={PaymentScreen} options={{ title: 'Payment Methods' }} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
          </Stack.Group>

          {/* ADMIN STACK - PROTECTED BY ROLE */}
          {user?.role === 'Admin' && (
            <Stack.Group screenOptions={{ 
              headerShown: true, 
              headerStyle: { backgroundColor: '#fff' },
              headerTitleStyle: { fontWeight: '900', color: '#111827' }
            }}>
              <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ title: 'Admin Portal' }} />
              <Stack.Screen name="ManageOrders" component={ManageOrders} options={{ title: 'Order Management' }} />
              <Stack.Screen name="ManageProducts" component={ManageProducts} options={{ title: 'Inventory' }} />
              <Stack.Screen name="CreateProduct" component={CreateProduct} options={{ title: 'Add New Product' }} /> 
              <Stack.Screen name="ManageUsers" component={ManageUsers} options={{ title: 'User Management' }} /> 
              <Stack.Screen name="ManageReviews" component={ManageReviews} options={{ title: 'Reviews' }} /> 
            </Stack.Group>
          )}
        </>
      ) : (
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="ResetPassword" component={ResetPassword} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  headerTitle: { fontWeight: '900', fontSize: 22, letterSpacing: 1.5, color: '#111827' },
  tabBar: { height: 70, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 10, paddingBottom: 10 }
});