import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { CabecalhoAbrigo } from '../components/CabecalhoAbrigo';

export const TelaDetalheAdocao = ({ adoption, onEndAdoption, onVoltar }) => {
  return (
    <View style={{ flex: 1, backgroundColor: '#EDEDED' }}>
      <CabecalhoAbrigo title="Detalhes da Adoção" onBack={onVoltar} />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 28 }} showsVerticalScrollIndicator={false}>
        <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: '#999', marginBottom: 4 }}>Pet</Text>
          <Text style={{ fontSize: 15, fontWeight: '600', color: '#1E1E1E' }}>{adoption?.petName || 'Não informado'}</Text>
        </View>

        <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: '#999', marginBottom: 4 }}>Adotante</Text>
          <Text style={{ fontSize: 15, fontWeight: '600', color: '#1E1E1E' }}>{adoption?.adopterName || 'Não informado'}</Text>
        </View>

        <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: '#999', marginBottom: 4 }}>Dias desde adoção</Text>
          <Text style={{ fontSize: 15, fontWeight: '600', color: '#1E1E1E' }}>{adoption?.daysSinceAdoption ?? '0 dias'}</Text>
        </View>

        <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 15, marginTop: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }}>
          <Text style={{ fontSize: 13, color: '#666', lineHeight: 20 }}>Histórico de fotos e atualizações aparecerão aqui.</Text>
        </View>

        <TouchableOpacity onPress={onEndAdoption} style={{ backgroundColor: '#8B2E0F', paddingVertical: 14, borderRadius: 50, alignItems: 'center', marginTop: 15 }}>
          <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85} style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Encerrar Acompanhamento</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
