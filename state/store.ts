import { combineReducers } from 'redux';
import { createStore } from 'redux'
import { AppState } from './types';
import { menuList, changeGeneralState } from './reducer';
export default createStore(combineReducers({ changeGeneralState, menuList }));

