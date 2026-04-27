import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { logo, cores } from '../utils/constantes';

export const CabecalhoAbrigo = ({ title, showBack = true, onBack }) => (
  <View style={{ backgroundColor: cores.amarelo, paddingTop: 40, paddingBottom: 15, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' }}>
    {showBack && (
      <TouchableOpacity onPress={onBack} style={{ padding: 8 }}>
        <Ionicons name="arrow-back" size={24} color={cores.preto} />
      </TouchableOpacity>
    )}
    <Image source={logo} style={{ width: 50, height: 50, marginLeft: showBack ? 8 : 0 }} resizeMode="contain" />
    {title && <Text style={{ fontSize: 18, fontWeight: '700', color: cores.preto, marginLeft: 12, flex: 1 }}>{title}</Text>}
  </View>
);