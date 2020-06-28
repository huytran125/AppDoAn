import { AsyncStorage } from "react-native";

export const API_KEY = 'AIzaSyBx4uLIYK_uzjH3cMWq1LJk9YvMLEVj0Pc';

export const AUTHENTICATE = 'AUTHENTICATE';
export const LOG_OUT ='LOG_OUT';
export const authenticate = (userId, token) => {
    console.log("userId ne",userId);
    return { type: AUTHENTICATE, userId: userId, token: token };
};
export const singup = (email, password) => {
    return async dispatch => {

        const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password,
                returnSecureToken: true
            })

        });
        if (!response.ok) {
            const errorResData = await response.json();
            const resId = errorResData.error.message;
            console.log(`this is wha` +resId);
            switch (resId) {
                case 'EMAIL_EXISTS': {
                    throw new Error('This email has already in use');
                }
                default: throw new Error('Something wrong !!!');
            }


        }
        const resData = await response.json();
        console.log(resData);
        dispatch(authenticate(resData.localId, resData.idToken));
        const expirationDate = new Date(
            new Date().getTime() + parseInt(resData.expiresIn) * 1000
        );
        saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    }

}


export const login = (email, password) => {
    return async dispatch => {
        console.log('come to action');


        const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password,
                returnSecureToken: true
            })

        });
        if (!response.ok) {
            const errorResData = await response.json();
            const resId = errorResData.error.message;
            switch (resId) {
                case 'EMAIL_NOT_FOUND': {
                    throw new Error('Email not found');
                }
                case 'INVALID_PASSWORD': {
                    throw new Error('Password not found');

                }
                default: throw new Error('Something wrong !!!');
            }


        }
        const resData = await response.json();
        console.log(resData);
        dispatch(authenticate(resData.localId, resData.idToken));
        const expirationDate = new Date(
            new Date().getTime() + parseInt(resData.expiresIn) * 1000
        );
        saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    }

}


export const logOut = ()=>{
    AsyncStorage.removeItem('userData');
    return {
        type: LOG_OUT
    }
}

const saveDataToStorage = (token, userId, expirationDate) => {
    AsyncStorage.setItem(
      'userData',
      JSON.stringify({
        token: token,
        userId: userId,
        expiryDate: expirationDate.toISOString()
      })
    );
  };