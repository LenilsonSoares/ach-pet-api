import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const MensagemSucesso = ({ onAcompanhar }) => (
  <View style={{ backgroundColor: '#4CAF50', borderRadius: 12, padding: 20, marginBottom: 20, alignItems: 'center' }}>
    <Ionicons name="checkmark-circle" size={50} color="white" />
    <Text style={{ fontSize: 18, fontWeight: '700', color: 'white', textAlign: 'center', marginTop: 10 }}>Solicitação Enviada!</Text>
    <Text style={{ fontSize: 14, color: 'white', textAlign: 'center', marginTop: 5, marginBottom: 15 }}>
      Sua solicitação de adoção foi enviada com sucesso para o abrigo.
    </Text>
    <TouchableOpacity style={{ backgroundColor: 'white', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 25 }} onPress={onAcompanhar}>
      <Text style={{ color: '#4CAF50', fontWeight: '600' }}>Acompanhar Solicitação</Text>
    </TouchableOpacity>
  </View>
);