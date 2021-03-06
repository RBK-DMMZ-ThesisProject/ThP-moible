// menu item type
export type MenuItem = {
  id: number;
  itemtxt: string;
  toPage: string;
  show: number;
};
// menu item list types
export type MenuItemsListState = MenuItem[];
// menu action types
export enum MENU_LIST_ACTION_TYPES {
  CHANGE_STATE = 'CHANGE_STATE',
}
// each action inputs type
export type ChangeStateAction = {
  type: string;
  id: number;
  show: number;
};
export type ChangeStateSignedIn = {
  type: string;
  login: number;
};
export type ChangeHasProfileState = {
  type: string;
  hasProfile: number;
};
export type ChangeActivityIndicatorState = {
  type: string;
  activityIndicatorState: boolean;
};
export type SetUserId = {
  type: string;
  userId: number;
};
export type SetProfileId = {
  type: string;
  profileId: string;
};
export type SetUserName = {
  type: string;
  userName: string;
};
export type MenuItemsListAction = ChangeStateAction;
// whole application state
export type LoginState = number;
export const LOGIN_STATE = 'LOGIN_STATE';
export type ActivityIndicatorState = boolean;
export const ACTIVITY_INDICATOR_STATE = 'ACTIVITY_INDICATOR_STATE';
export type HasProfileState = number;
export const HAS_PROFILE_STATE = 'HAS_PROFILE_STATE';
export type UserId = number;
export const SET_USER_ID = 'SET_USER_ID';
export type profileId = string;
export const SET_PROFILE_ID = 'SET_PROFILE_ID';
export type userName = string;
export const SET_USER_NAME = 'SET_USER_NAME';
export type AppState = {
  menuList: MenuItemsListState;
  login: LoginState;
  hasProfile: HasProfileState;
  activityIndicatorState: ActivityIndicatorState;
  userId: UserId;
  profileId: profileId;
  userName: userName;
  // add future state slices here
};
// union type to be used in reducers.
export type GeneralAction =
  | ChangeStateSignedIn
  | ChangeHasProfileState
  | ChangeActivityIndicatorState
  | SetUserId
  | SetProfileId
  | SetUserName;
