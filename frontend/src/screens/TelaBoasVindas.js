import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { petsImage, logo, cores } from '../utils/constantes';

export const TelaBoasVindas = ({ onComecar }) => (
  <View style={{ flex: 1, backgroundColor: cores.cinza }}>
    <View style={{ 
      backgroundColor: cores.amarelo, 
      height: '65%',
      borderBottomLeftRadius: 200,
      borderBottomRightRadius: 200,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 30
    }}>
      <Image source={petsImage} style={{ width: 260, height: 200 }} resizeMode="contain" />
      <Image source={logo} style={{ width: 100, height: 100, marginTop: 20 }} resizeMode="contain" />
    </View>
    
    <View style={{ flex: 1, padding: 30, alignItems: 'center' }}>
      <Text style={{ fontSize: 22, fontWeight: '700', color: cores.preto, textAlign: 'center', marginBottom: 12 }}>
        Dê um lar ou ajude a encontrar um a quem mais precisa!
      </Text>
      <Text style={{ fontSize: 14, color: '#555', textAlign: 'center', marginBottom: 24 }}>
        Encontre seu novo amigo ou cadastre um pet para adoção de forma simples e segura.
      </Text>
      
      <TouchableOpacity 
        style={{ 
          backgroundColor: cores.marrom, 
          paddingVertical: 14, 
          paddingHorizontal: 60, 
          borderRadius: 50,
          shadowColor: cores.marrom,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 15,
          elevation: 5
        }}
        onPress={onComecar}
      >
        <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Começar!</Text>
      </TouchableOpacity>
    </View>
  </View>
);