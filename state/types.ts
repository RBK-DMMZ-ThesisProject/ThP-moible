// menu item type 
export type MenuItem = {
    id: number,
    itemtxt: string,
    toPage: string
}
// menu item list types
export type MenuItemsListState = MenuItem[];
// menu action types
export enum MENU_LIST_ACTION_TYPES {
    ADD_ITEM = 'ADD_ITEM',
    REMOVE_ITEM = 'REMOVE_ITEM',
}
// each action inputs type
export type AddItemAction = {
    type: string;
    itemData: MenuItem;
}
export type RemoveItemAction = {
    type: string;
    id: number;
}
// union type to be used in reducers.
export type MenuItemsListAction = AddItemAction | RemoveItemAction;

// whole application state
export type AppState = {
    menuList: MenuItemsListState,
    // add future state slices here
}
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

