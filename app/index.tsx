import React from 'react';
import { View, Dimensions } from 'react-native';
import Home from '../app/home';
import styles from './styles';

export default function HomeScreen() {

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  return (
    <View style={{ backgroundColor: 'black',
                  width: windowWidth,
                  height: windowHeight,
                  alignItems: 'center',
                  justifyContent: 'center'
      }}>
        <Home />
    </View>
  );
}