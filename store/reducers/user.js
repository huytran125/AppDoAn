
import { SET_ALL_INFOR} from '../actions/allInfor';
const initalState = {
    availableUsers: [],
    currentUser: {},
   
}


export default (state = initalState, actions) => {

    switch (actions.type) {

        case SET_ALL_INFOR: {
        
           
           
            return {
                availableUsers: actions.users,
                currentUser: actions.curUser
                
            }
        }
       
        default: return state
    }

}