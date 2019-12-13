import * as types from './types'
export const initialState: types.MenuItemsListState = [{
    id: 1,
    itemtxt: 'Home Page',
    toPage: 'Home'
},
{
    id: 2,
    itemtxt: 'Find Me',
    toPage: 'Categories'
},
{
    id: 3,
    itemtxt: 'Sign in',
    toPage: 'SignIn'
},
{
    id: 4,
    itemtxt: 'Sign Up',
    toPage: 'SignUp'
},
    // {
    //     id: 5,
    //     itemtxt: 'FAQ',
    //     toPage: 'FAQ'
    // },
    // {
    //     id: 6,
    //     itemtxt: 'About',
    //     toPage: 'About'
    // }
];

export const menuList = (
    state: types.MenuItemsListState = initialState,
    action: types.MenuItemsListAction
) => {
    switch (action.type) {
        default:
            return state;
    }
}

