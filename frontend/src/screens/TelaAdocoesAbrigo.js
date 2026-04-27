import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CabecalhoAbrigo } from '../components/CabecalhoAbrigo';

export const TelaAdocoesAbrigo = ({ adoptions, onViewDetail, onOpenChat, onVoltar }) => {
  const renderShelterAdoptionsList = () => {
    if (adoptions.length === 0) {
      return (
        <View style={{ padding: 40, alignItems: 'center' }}>
          <Ionicons name="heart-outline" size={60} color="#999" />
          <Text style={{ fontSize: 16, color: '#999', textAlign: 'center', marginTop: 10 }}>Nenhuma adoção em acompanhamento</Text>
        </View>
      );
    }

    return adoptions.map(adoption => (
      <View key={adoption.id} style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }}>
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#1E1E1E', marginBottom: 5 }}>{adoption.petName}</Text>
        <Text style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>Adotante: <Text style={{ fontWeight: '600' }}>{adoption.adopterName}</Text></Text>
        <Text style={{ fontSize: 12, color: '#999', marginBottom: 12 }}>Adoção há {adoption.daysSinceAdoption}</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
          <TouchableOpacity onPress={() => onViewDetail(adoption.id)} style={{ flex: 1, backgroundColor: '#8B2E0F', paddingVertical: 10, borderRadius: 50, alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>Ver Detalhes</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onOpenChat(adoption.adopterId, adoption.adopterName, adoption.petName)} style={{ flex: 1, backgroundColor: '#66BB6A', paddingVertical: 10, borderRadius: 50, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
            <Ionicons name="chatbubble-outline" size={16} color="white" />
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '600', marginLeft: 4 }}>Chat</Text>
          </TouchableOpacity>
        </View>
      </View>
    ));
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#EDEDED' }}>
      <CabecalhoAbrigo title="Acompanhamento" onBack={onVoltar} />

      <View style={{ flex: 1, padding: 20, paddingBottom: 70 }}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#1E1E1E', marginBottom: 20 }}>Adoções em Acompanhamento</Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          {renderShelterAdoptionsList()}
        </ScrollView>
      </View>
    </View>
  );
};