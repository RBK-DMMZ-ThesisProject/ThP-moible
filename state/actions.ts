import * as actionTypes from './types';

export const changeStateItem = (id: number): actionTypes.ChangeStateAction => {

    return ({
        type: actionTypes.MENU_LIST_ACTION_TYPES.CHANGE_STATE,
        id: id
    });
}
export const changeStateSignedIn = (): actionTypes.ChangeStateSignedIn => {
    console.log(({
        type: actionTypes.LOGIN_STATE,
    }))
    return ({
        type: actionTypes.LOGIN_STATE,
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