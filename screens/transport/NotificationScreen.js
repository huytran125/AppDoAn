import React, { useEffect } from 'react';
import {
    View,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { CommonActions } from '@react-navigation/native';
import Colors from '../../constaint/Colors';
import * as authActions from '../../store/actions/auth';

const NotificationScreen = props => {

    return (
        <View style={styles.screen}>
            <Text>Hello</Text>
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

export default NotificationScreen;
