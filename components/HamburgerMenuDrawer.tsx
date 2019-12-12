
import React, { Component } from 'react';
import { ScrollView, Text, View, Image } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { MenuItemsListState } from '../state/types';
import { connect } from 'react-redux';
import { menuList } from '../state/reducer';
import * as types from '../state/types'

export interface Props {
    items: []
}

class CustomHamburgerMenuDrawer extends Component<Props> {

    render() {
        console.log(this.props.items);
        return (
            <View style={{ flex: 1, paddingTop: 30 }}>
                <View style={{ height: 80, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
                    <Text >{this.props.items.menuList[0]["itemtxt"]}</Text>
                    <Text>cc</Text>
                </View>
                <ScrollView>
                    <View>
                        {/* {this.state.data.map(x => (
                            <Text
                                key={x.id}
                                style={{ fontSize: 16, lineHeight: 30, textAlign: 'center' }}
                                onPress={this.navigateToScreen('page2')}
                            >
                                {x.name}
                            </Text>
                        ))} */}
                    </View>
                </ScrollView>
            </View>
        );
    }
}
const mapStateToProps = (state: types.MenuItemsListState) => ({
    items: state
});
// const mapDipatchToProps = () => {
//     console.log('IN mapDispatchToProps')
//     return {
//         onClick: store.dispatch(changeCurrentPage(store.getState(), types.NAVIGATE_ACTIONS.NAVIGATE_TO))

//     }
// };


export default connect(mapStateToProps, null)(CustomHamburgerMenuDrawer);