import * as actionTypes from './types';
export const addMenuItem = (id: number, itemtxt: string, toPage: string): actionTypes.AddItemAction => ({
    type: actionTypes.MENU_LIST_ACTION_TYPES.ADD_ITEM,
    itemData: {
        id,
        itemtxt,
        toPage
    }
});
export const removeMenuItem = (id: number): actionTypes.RemoveItemAction => ({
    type: actionTypes.MENU_LIST_ACTION_TYPES.REMOVE_ITEM,
    id: id
});
// export const navigateTo = (current: string, next: string, previous: string): actionTypes.NavigateToAction => {
//     return {
//         type: actionTypes.NAVIGATE_ACTIONS.NAVIGATE_TO,
//         pages: {
//             current: current,
//             next: next,
//             previous: previous
//         }
//     }
// }