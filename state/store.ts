import { combineReducers } from 'redux';
import { createStore } from 'redux'
import { AppState } from './types';
import { menuList } from './reducer';
export default createStore(combineReducers({ menuList }));

