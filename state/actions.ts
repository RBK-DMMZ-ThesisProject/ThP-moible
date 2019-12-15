import * as actionTypes from './types';

export const changeStateItem = (id: number): actionTypes.ChangeStateAction => {

    return ({
        type: actionTypes.MENU_LIST_ACTION_TYPES.CHANGE_STATE,
        id: id
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
        type: actionTypes.LOGIN_STATE,
        hasProfile: state
    }))
    return ({
        type: actionTypes.LOGIN_STATE,
        hasProfile: state
    });
}

export const changeActivityIndicatorState = (state: boolean): actionTypes.ChangeActivityIndicatorState => {

    return ({
        type: actionTypes.LOGIN_STATE,
        activityIndicatorState: state
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