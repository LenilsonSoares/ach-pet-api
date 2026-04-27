import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { logo, cores } from '../utils/constantes';

export const CabecalhoArredondado = ({ children, height = '20%', showBack, onBack }) => (
  <View style={{ 
    backgroundColor: cores.amarelo, 
    height: height,
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    position: 'relative'
  }}>
    {showBack && (
      <TouchableOpacity onPress={onBack} style={{ position: 'absolute', left: 20, top: 40 }}>
        <Ionicons name="arrow-back" size={24} color={cores.preto} />
      </TouchableOpacity>
    )}
    {children || <Image source={logo} style={{ width: 100, height: 100 }} resizeMode="contain" />}
  </View>
);