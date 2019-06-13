import {combineReducers} from 'redux';
import accountReducer from './account/index';
import profileReducer from './dashboard/profile';
import dashboardReducer from './dashboard/index';

export default combineReducers({
    accountReducer,
    profileReducer,
    dashboardReducer
})