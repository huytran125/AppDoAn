import { SET_ALL_INFOR} from '../actions/allInfor';
const initalState = {
    availableVehicles: [],
   
}


export default (state = initalState, actions) => {

    switch (actions.type) {

        case SET_ALL_INFOR: {
        
           
           
            return {
                availableVehicles: actions.vehicles
                
            }
        }
       
        default: return state
    }

}