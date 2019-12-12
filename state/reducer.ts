import * as types from './types'
export const initialState: types.MenuItemsListState = [{
    id: 1,
    itemtxt: 'Heollow from redux',
    toPage: 'Home'
}];

export const menuList = (
    state: types.MenuItemsListState = initialState,
    action: types.MenuItemsListAction
) => {
    switch (action.type) {
        default:
            return state;
    }
}

