import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CabecalhoArredondado } from '../components/CabecalhoArredondado';
import { logo, cores } from '../utils/constantes';

export const TelaEscolhaPerfil = ({ onSelectPerfil }) => (
  <View style={{ flex: 1, backgroundColor: cores.cinza }}>
    <CabecalhoArredondado height="15%">
      <Image source={logo} style={{ width: 100, height: 100 }} resizeMode="contain" />
    </CabecalhoArredondado>
    
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: '700', color: cores.preto, marginBottom: 20 }}>Quem é você?</Text>
      
      <View style={{ flexDirection: 'row', gap: 20 }}>
        <TouchableOpacity 
          style={{ 
            flex: 1, 
            backgroundColor: 'white', 
            borderRadius: 20, 
            padding: 20, 
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3
          }}
          onPress={() => onSelectPerfil('adopter')}
        >
          <Ionicons name="person-outline" size={40} color={cores.preto} />
          <Text style={{ fontSize: 13, fontWeight: '600', color: cores.preto, textAlign: 'center', marginTop: 12 }}>Sou Adotante</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={{ 
            flex: 1, 
            backgroundColor: 'white', 
            borderRadius: 20, 
            padding: 20, 
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3
          }}
          onPress={() => onSelectPerfil('shelter')}
        >
          <Ionicons name="business-outline" size={40} color={cores.preto} />
          <Text style={{ fontSize: 13, fontWeight: '600', color: cores.preto, textAlign: 'center', marginTop: 12 }}>Sou Abrigo/ONG</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);