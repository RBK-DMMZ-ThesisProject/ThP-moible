import * as actionTypes from './types';

export const changeStateItem = (id: number, state: number): actionTypes.ChangeStateAction => {

    return ({
        type: actionTypes.MENU_LIST_ACTION_TYPES.CHANGE_STATE,
        id: id,
        show: state
    });
}
export const changeStateSignedIn = (state: number): actionTypes.ChangeStateSignedIn => {
    return ({
        type: actionTypes.LOGIN_STATE,
        login: state
    });
}
export const changeHasProfileState = (state: number): actionTypes.ChangeHasProfileState => {
    console.log(({
        type: actionTypes.HAS_PROFILE_STATE,
        hasProfile: state
    }))
    return ({
        type: actionTypes.HAS_PROFILE_STATE,
        hasProfile: state
    });
}

export const changeActivityIndicatorState = (state: boolean): actionTypes.ChangeActivityIndicatorState => {

    return ({
        type: actionTypes.ACTIVITY_INDICATOR_STATE,
        activityIndicatorState: state
    });
}

export const setUserId = (id: number): actionTypes.SetUserId => {

    return ({
        type: actionTypes.SET_USER_ID,
        userId: id
    });
}

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