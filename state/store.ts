import { combineReducers } from 'redux';
import { createStore } from 'redux'
import { menuList, changeGeneralState } from './reducer';
export default createStore(combineReducers({ changeGeneralState, menuList }));
