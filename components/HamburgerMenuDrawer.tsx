
import React, { Component } from 'react';
import { ScrollView, Text, View, Image } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { MenuItemsListState } from '../state/types';
import { connect } from 'react-redux';
import { menuList } from '../state/reducer';
import * as types from '../state/types';
import NavigationService from './NavigationService.js';

import {
    NavigationParams,
    NavigationScreenProp,
    NavigationState

} from 'react-navigation';

export interface Props {
    items: [],
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

class CustomHamburgerMenuDrawer extends Component<Props> {

    navigateToScreen(page: string) {
        const { navigation } = this.props;
        console.log('naviatione ')
        NavigationService.navigate(page);
    }
    render() {
        console.log(this.props.items);
        return (
            <View style={{ flex: 1, paddingTop: 30 }}>
                <View style={{ height: 80, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
                    <Text >Handy</Text>
                </View>
                <ScrollView>
                    <View>
                        {this.props.items.menuList.map((item: any) => (
                            <Text
                                key={item.id}
                                style={{ fontSize: 16, lineHeight: 30, textAlign: 'center' }}
                                onPress={() => this.navigateToScreen(item.toPage)}
                            >
                                {item.itemtxt}
                            </Text>
                        ))}
                    </View>
                </ScrollView>
            </View>
        );
    }
}
const mapStateToProps = (state: types.MenuItemsListState, navigation: NavigationScreenProp<NavigationState, NavigationParams>) => ({
    items: state,
    navigation: navigation
});
// const mapDipatchToProps = () => {
//     console.log('IN mapDispatchToProps')
//     return {
//         onClick: store.dispatch(changeCurrentPage(store.getState(), types.NAVIGATE_ACTIONS.NAVIGATE_TO))

//     }
// };


export default connect(mapStateToProps, null)(CustomHamburgerMenuDrawer);