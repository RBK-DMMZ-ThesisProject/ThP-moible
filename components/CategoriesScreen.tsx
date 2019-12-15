import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import { Card, ListItem, Button, Header } from 'react-native-elements';
import { Left, Right, Icon } from 'native-base';

import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';
import HandyHeader from './HandyHeader';
import categories from './categories';
import ProfilesScreen from './ProfilesScreen';
export interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

class CategoriesScreen extends React.Component<Props, object> {
  render() {
    const { navigation } = this.props;
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
            <HandyHeader navigation={navigation} title="Categories" />
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}>
                {categories.map(category => {
                  return (
                    <View key={category.id} style={{ width: 33 + '%' }}>
                      <Card
                        containerStyle={{
                          paddingTop: 2,
                          backgroundColor: '#f2f2f2',
                          width: 90,
                          elevation: 0,
                          borderColor: '#f2f2f2'
                        }}
                        imageWrapperStyle={{ borderRadius: 35 }}
                        imageStyle={{ width: 70, height: 70 }}
                        image={category.img}>
                        <Button
                          titleStyle={{ fontSize: 12 }}
                          buttonStyle={{
                            backgroundColor: '#078ca9',
                            borderRadius: 5,
                            marginLeft: 0,
                            marginRight: 0,
                            marginBottom: 0,
                            padding: 5,
                            width: 70
                          }}
                          title={category.name}
                          onPress={() =>
                            navigation.navigate('ProfilesScreen', {
                              categoryName: category.name,
                            })
                          }
                        />
                      </Card>
                    </View>
                  );
                })}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  baseText: {
    fontFamily: 'Cochin',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default CategoriesScreen;
