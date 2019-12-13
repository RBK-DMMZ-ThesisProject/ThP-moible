import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {Card, ListItem, Button, Header} from 'react-native-elements';
import {Left, Right, Icon} from 'native-base';

import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';
import HandyHeader from './../HandyHeader';

import {GiftedChat} from 'react-native-gifted-chat';
import PubNubReact from 'pubnub-react';

export interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

class Chatt extends React.Component<Props, object> {
  state = {
    messages: [],
  };
  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ],
    });
  }
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }
  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    );
  }
}

export default Chatt;
