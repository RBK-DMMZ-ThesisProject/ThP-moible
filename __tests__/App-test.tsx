/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';
import CategoriesScreen from '../components/CategoriesScreen';
import HomeScreen from '../components/HomeScreen';


// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  renderer.create(<App />);
});


