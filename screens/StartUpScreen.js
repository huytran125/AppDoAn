import React, { useEffect } from 'react';
import {
    View,
    ActivityIndicator,
    StyleSheet,
    AsyncStorage
} from 'react-native';
import { useDispatch } from 'react-redux';

import Colors from '../constaint/Colors';
import * as authActions from '../store/actions/auth';

const StartupScreen = props => {
    const dispatch = useDispatch();

    useEffect(() => {
        const tryLogin = async () => {
            const userData = await AsyncStorage.getItem('userData');
            const transformedData = JSON.parse(userData);
            console.log(transformedData);
            if (!userData) {
                props.navigation.navigate('AuthNavigator');
                return;
            }

            const { token, userId, expiryDate } = transformedData;
            const expirationDate = new Date(expiryDate);

            if (expirationDate <= new Date() || !token || !userId) {
                props.navigation.navigate('AuthNavigator');
                return;
            }

            props.navigation.navigate('TransportNavigator');
            dispatch(authActions.authenticate(userId, token));
        };

        tryLogin();
    }, [dispatch]);

    return (
        <View style={styles.screen}>
            <ActivityIndicator size="large" color={Colors.primary} />
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default StartupScreen;
