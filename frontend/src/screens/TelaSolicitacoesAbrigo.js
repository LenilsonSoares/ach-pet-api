import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CabecalhoAbrigo } from '../components/CabecalhoAbrigo';

export const TelaSolicitacoesAbrigo = ({ applications, onViewDetail, onOpenChat, onVoltar }) => {
  const renderShelterApplicationsList = () => {
    if (applications.length === 0) {
      return (
        <View style={{ padding: 40, alignItems: 'center' }}>
          <Ionicons name="chatbubble-outline" size={60} color="#999" />
          <Text style={{ fontSize: 16, color: '#999', textAlign: 'center', marginTop: 10 }}>Nenhuma solicitação recebida</Text>
        </View>
      );
    }

    return applications.map(app => {
      const statusColor = app.status === 'Pendente' ? '#FFF3E0' : (app.status === 'Aprovada' ? '#E8F5E9' : '#FFEBEE');
      const statusTextColor = app.status === 'Pendente' ? '#E65100' : (app.status === 'Aprovada' ? '#2E7D32' : '#C62828');

      return (
        <TouchableOpacity key={app.id} style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }} onPress={() => onViewDetail(app.id)}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#1E1E1E', marginBottom: 8 }}>{app.adopterName}</Text>
          <Text style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>Pet: <Text style={{ fontWeight: '600' }}>{app.petName}</Text></Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ backgroundColor: statusColor, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignSelf: 'flex-start' }}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: statusTextColor }}>{app.status}</Text>
            </View>
            {app.threadId && (
              <TouchableOpacity onPress={() => onOpenChat(app.threadId, app.adopterName, app.petName)} style={{ backgroundColor: '#F4A51C', padding: 8, borderRadius: 8 }}>
                <Ionicons name="chatbubble-outline" size={16} color="#1E1E1E" />
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      );
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#EDEDED' }}>
      <CabecalhoAbrigo title="Solicitações" onBack={onVoltar} />

      <View style={{ flex: 1, padding: 20, paddingBottom: 70 }}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#1E1E1E', marginBottom: 20 }}>Solicitações de Adoção</Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          {renderShelterApplicationsList()}
        </ScrollView>
      </View>
    </View>
  );
};
