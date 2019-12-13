// menu item type 
export type MenuItem = {
    id: number,
    itemtxt: string,
    toPage: string,
    show: number

}
// menu item list types
export type MenuItemsListState = MenuItem[];
// menu action types
export enum MENU_LIST_ACTION_TYPES {
    CHANGE_STATE = "CHANGE_STATE"
}
// each action inputs type
export type ChangeStateAction = {
    type: string;
    id: number;
}
export type ChangeStateSignedIn = {
    type: string;
}

// union type to be used in reducers.
export type MenuItemsListAction = ChangeStateAction;

// whole application state
export type LoginState = number;
export const LOGIN_STATE = "LOGIN_STATE";
export type AppState = {
    menuList: MenuItemsListState,
    login: LoginState
    // add future state slices here
}
export type GeneralAction = ChangeStateSignedIn;

// export enum NAVIGATE_ACTIONS {
//     NAVIGATE_TO = "NAVIGATE_TO"
// };
// export type HScreen = [
//     string
// ]
// export type Hscreens = h
// export type State = {

// };
// export type Page = {
//     current: string,
//     next: string,
//     previous: string
// };
// export type NavigateToAction = {
//     type: string,
//     pages: Page
// };
// // Union 
// export type NavigationListAction = NavigateToAction;

// // export const PAGE_DIRECTION = {
// //     CURRENT_PAGE: 'CURRENT_PAGE',
// //     NEXT_PAGE: 'NEXT_PAGE'
// // }

