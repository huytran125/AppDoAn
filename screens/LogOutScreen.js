import React, { useEffect } from 'react';
import {
    View,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { CommonActions } from '@react-navigation/native';
import Colors from '../constaint/Colors';
import * as authActions from '../store/actions/auth';

const LogOutScreen = props => {
    const dispatch = useDispatch();

    useEffect(() => {

        props.navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [
                 
                    {
                        name: 'AuthNavigator',
                       
                    },
                 
                    ,
                ],
            })
        );
       
        console.log('this is logout screen');
        dispatch(authActions.logOut());
    }, [dispatch, props.navigation]);

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

export default LogOutScreen;
