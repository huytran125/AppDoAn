
import { SET_ALL_INFOR} from '../actions/allInfor';
const initalState = {
    availableDevices: [],
   
}


export default (state = initalState, actions) => {

    switch (actions.type) {

        case SET_ALL_INFOR: {
        
           
           
            return {
                availableDevices: actions.devices
                
            }
        }
       
        default: return state
    }

}