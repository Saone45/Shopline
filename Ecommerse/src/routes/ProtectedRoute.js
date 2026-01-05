import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useSelector(state => state.auth);
    const navigation = useNavigation();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigation.navigate('Profile'); // Redirect to login/profile if not auth
        }
    }, [isAuthenticated, loading]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator size="large" color="#0A1121" />
            </View>
        );
    }

    return isAuthenticated ? children : null;
};

export default ProtectedRoute;