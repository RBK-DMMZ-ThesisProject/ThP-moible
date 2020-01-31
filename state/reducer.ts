import * as types from './types'
import { setUserName } from './actions';
export const initialItemState: types.MenuItemsListState = [{
    id: 1,
    itemtxt: 'Home Page',
    toPage: 'Home',
    show: 1
},
{
    id: 2,
    itemtxt: 'Find a Handyman',
    toPage: 'Categories',
    show: 1
},
{
    id: 3,
    itemtxt: 'Sign in',
    toPage: 'SignIn',
    show: 1
},
{
    id: 4,
    itemtxt: 'Sign Up',
    toPage: 'SignUp',
    show: 1
},
{
    id: 5,
    itemtxt: 'FAQ',
    toPage: 'FAQ',
    show: 0
},
{
    id: 6,
    itemtxt: 'About',
    toPage: 'About',
    show: 0
},
//Employer Screens
{
    id: 7,
    itemtxt: 'Add Profile',
    toPage: 'AddProfileScreen',
    show: 0
},
{
    id: 8,
    itemtxt: 'Favorites',
    toPage: 'Favorites',
    show: 0
},
{
    id: 13,
    itemtxt: 'Offers',
    toPage: 'Offers',
    show: 0
},

{
    id: 12,
    itemtxt: 'Messages',
    toPage: 'Messages',
    show: 0
},
//service provider
{
    id: 20,
    itemtxt: 'View Profile',
    toPage: 'ProviderProfile',
    show: 0
},
//General for signed in users
{
    id: 30,
    itemtxt: 'Log out',
    toPage: 'Logout',
    show: 0
}
];

export const menuList = (
    state: types.MenuItemsListState = initialItemState,
    action: types.MenuItemsListAction
) => {
    switch (action.type) {
        case types.MENU_LIST_ACTION_TYPES.CHANGE_STATE:
            return state.map((item, index) => {
                if (item.id === action.id) {
                    return Object.assign({}, item, {
                        show: action.show
                    })
                }
                return item
            })

        default:
            return state;
    }
}

export const login: types.LoginState = 0
export const hasProfile: types.HasProfileState = 0
export const activityIndicatorState: types.ActivityIndicatorState = false
export const userId: types.UserId = 0
export const profileId: types.profileId = ''
export const userName: types.userName = ''

export const initialState: types.AppState = {
    menuList: initialItemState,
    login: login,
    hasProfile: hasProfile,
    activityIndicatorState: activityIndicatorState,
    userId: userId,
    profileId: profileId,
    userName: userName,
}


export const changeGeneralState = (
    state: types.AppState = initialState,
    action: types.GeneralAction
) => {
    switch (action.type) {
        case types.LOGIN_STATE:
            const { login } = <types.ChangeStateSignedIn>action
            return Object.assign({}, state, {
                login: login
            });

        case types.HAS_PROFILE_STATE:
            const { hasProfile } = <types.ChangeHasProfileState>action

            return Object.assign({}, state, {
                hasProfile: hasProfile
            })
        case types.ACTIVITY_INDICATOR_STATE:
            const { activityIndicatorState } = <types.ChangeActivityIndicatorState>action
            return Object.assign({}, state, {
                activityIndicatorState: activityIndicatorState
            })
        case types.SET_USER_ID:
            const { userId } = <types.SetUserId>action
            return Object.assign({}, state, {
                userId: userId
            })
        case types.SET_USER_NAME:
            const { userName } = <types.SetUserName>action
            return Object.assign({}, state, {
                userName: userName
            })

        case types.SET_PROFILE_ID:
            const { profileId } = <types.SetProfileId>action
            return Object.assign({}, state, {
                profileId: profileId
            })
        default:
            return state;
    }
}
