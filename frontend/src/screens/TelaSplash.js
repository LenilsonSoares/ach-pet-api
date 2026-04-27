import React from 'react';
import { View, Image } from 'react-native';
import { logo, cores } from '../utils/constantes';

export const TelaSplash = () => (
  <View style={{ flex: 1, backgroundColor: cores.amarelo, justifyContent: 'center', alignItems: 'center' }}>
    <Image source={logo} style={{ width: 180, height: 180 }} resizeMode="contain" />
  </View>
);