import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CabecalhoAbrigo } from '../components/CabecalhoAbrigo';

export const TelaGerenciarPets = ({ shelterPets, onAddPet, onEditPet, onDeletePet, onVoltar }) => {
  const renderShelterPetsList = () => {
    if (shelterPets.length === 0) {
      return (
        <View style={{ padding: 40, alignItems: 'center' }}>
          <Ionicons name="paw-outline" size={60} color="#999" />
          <Text style={{ fontSize: 16, color: '#999', textAlign: 'center', marginTop: 10 }}>Nenhum pet cadastrado</Text>
        </View>
      );
    }

    return shelterPets.map(pet => (
      <View key={pet.id} style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }}>
        <View style={{ flex: 1, flexDirection: 'row', gap: 12 }}>
          <Image source={pet.image} style={{ width: 60, height: 60, borderRadius: 8 }} resizeMode="cover" />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#1E1E1E' }}>{pet.name}</Text>
            <Text style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>{pet.tags.find(t => t.includes('anos'))} • {pet.tags.find(t => t === 'Pequeno' || t === 'Médio' || t === 'Grande')}</Text>
            <View style={{ backgroundColor: pet.status === 'Disponível' ? '#E8F5E9' : '#FFF3E0', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start' }}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: pet.status === 'Disponível' ? '#2E7D32' : '#E65100' }}>{pet.status}</Text>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity onPress={() => onEditPet(pet.id)} style={{ width: 36, height: 36, backgroundColor: '#F4A51C', borderRadius: 8, justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="create-outline" size={18} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDeletePet(pet.id)} style={{ width: 36, height: 36, backgroundColor: '#ccc', borderRadius: 8, justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="trash-outline" size={18} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
    ));
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#EDEDED' }}>
      <CabecalhoAbrigo title="Gerenciar Pets" onBack={onVoltar} />

      <View style={{ flex: 1, padding: 20, paddingBottom: 70 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#1E1E1E' }}>Meus Pets</Text>
          <TouchableOpacity onPress={onAddPet} style={{ backgroundColor: '#8B2E0F', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="add-outline" size={18} color="white" />
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '600', marginLeft: 4 }}>Adicionar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {renderShelterPetsList()}
        </ScrollView>
      </View>
    </View>
  );
};