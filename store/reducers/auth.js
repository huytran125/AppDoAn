import {AUTHENTICATE, LOG_OUT} from '../actions/auth';

const intialState = {
    token: null,
    userId: null
}

 export default (state=intialState,action)=>{
     switch(action.type){
         case AUTHENTICATE:{
            return {
                token: action.token,
                userId: action.userId
            }
         }
         case LOG_OUT:{
             return intialState;
         }
         default: return state;
     }
 }