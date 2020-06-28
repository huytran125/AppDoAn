import React, { useReducer, useCallback, useState, useEffect } from 'react';
import {
    ScrollView,
    View,
    KeyboardAvoidingView,
    StyleSheet,
    Button,
    ActivityIndicator,
    Alert,
    ImageBackground
} from 'react-native';
import { useDispatch } from 'react-redux';

import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import Colors from '../../constaint/Colors';
import * as authActions from '../../store/actions/auth';
import { NavigationContainer, CommonActions } from '@react-navigation/native';



const UPDATE_A_FORM = 'UPDATE_A_FORM';
const RESET_A_FORM = 'RESET_A_FORM';
const initialFormState = {
    inputValue: {
        email: '',
        password: ''
    },
    inputValidate: {
        email: false,
        password: false
    },
    formValidate: false
};

const formReducer = (state, actions) => {

    switch (actions.type) {
        case UPDATE_A_FORM:
            const updatedValues = {
                ...state.inputValue,
                [actions.id]: actions.value
            };
            const updatedValidities = {
                ...state.inputValidate,
                [actions.id]: actions.valid
            };
            let updatedFormIsValid = true;
            for (const key in updatedValidities) {
                updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
            }

            return {

                formValidate: updatedFormIsValid,
                inputValidate: updatedValidities,
                inputValue: updatedValues
            };
        case RESET_A_FORM:
            return initialFormState;
    }

    return state;
}



const AuthScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [isErr, setIsErr] = useState();
    const [isSingUp, setIsSignUp] = useState(false);
    const [formState, disPatchFormState] = useReducer(formReducer, initialFormState);
    const formElementChangeHandler = useCallback((text, isValid, type) => {

        disPatchFormState({
            type: UPDATE_A_FORM,
            value: text,
            valid: isValid,
            id: type
        });

    }, [UPDATE_A_FORM, disPatchFormState]);



    const dispatch = useDispatch();
    const authHandler = useCallback(() => {
        let action;


        if (isSingUp)
            action = authActions.singup(formState.inputValue.email, formState.inputValue.password);
        else
            action = authActions.login(formState.inputValue.email, formState.inputValue.password);

        const dispatchAction = async () => {
            try {
                setIsErr(null);
                setIsLoading(true);


                await dispatch(action)
                props.navigation.navigate('TransportNavigator');

               


            } catch (err) {
                console.log(err.message);
                setIsErr(err.message);
                setIsLoading(false);
            }


        }
        dispatchAction();






    }, [useDispatch, formState, setIsErr, setIsLoading, disPatchFormState]);

    
    useEffect(() => {
        if (isErr) {
            console.log('this is error ' + isErr)
            Alert.alert('An error occurred!', isErr, [{ text: 'Okay' }]);
        }

    }, [isErr]);




    return (
        <KeyboardAvoidingView
            style={styles.screen}
        >
            <ImageBackground  style={styles.imageBackground}>
                <Card style={styles.authContainer}>
                    <ScrollView>
                        <Input
                            id="email"
                            label="E-Mail"
                            keyboardType="email-address"
                            required
                            email
                            autoCapitalize="none"
                            errorText="Please enter a valid email address."
                            onChangeElement={formElementChangeHandler}
                            initialValue=""
                        />
                        <Input
                            id="password"
                            label="Password"
                            keyboardType="default"
                            secureTextEntry
                            required
                            minLength={5}
                            autoCapitalize="none"
                            errorText="Please enter a valid password."
                            onChangeElement={formElementChangeHandler}
                            initialValue=""
                        />
                        {
                            isLoading ?
                                <ActivityIndicator size='small' color={Colors.primary} /> :
                                <View style={styles.buttonContainer}>
                                    <Button title={isSingUp ? 'Sign up' : 'Login'} color={Colors.primary} onPress={authHandler} />
                                </View>

                        }

                        <View style={styles.buttonContainer}>
                            <Button
                                title={`Switch to ${!isSingUp ? 'Sign up' : 'Login'} `}
                                color={Colors.accent}
                                onPress={() => setIsSignUp(prev => !prev)}
                            />
                        </View>
                    </ScrollView>
                </Card>
            </ImageBackground>
        </KeyboardAvoidingView>
    );
};


const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    imageBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    authContainer: {
        width: '80%',
        maxWidth: 400,
        maxHeight: 400,
        padding: 20
    },
    buttonContainer: {
        marginTop: 10
    }
});

export default AuthScreen;
