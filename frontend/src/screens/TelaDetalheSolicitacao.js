import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CabecalhoAbrigo } from '../components/CabecalhoAbrigo';

export const TelaDetalheSolicitacao = ({
  application,
  showRejectConfirm,
  onApprove,
  onReject,
  onConfirmReject,
  onCancelReject,
  onOpenChat,
  onVoltar
}) => {
  const canOpenChat = application?.status === 'Aprovada' && !!application?.threadId;
  const canReview = application?.status === 'Pendente';

  return (
    <View style={{ flex: 1, backgroundColor: '#EDEDED' }}>
      <CabecalhoAbrigo title="Detalhes" onBack={onVoltar} />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 28 }} showsVerticalScrollIndicator={false}>
        <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: '#999', marginBottom: 4 }}>Nome do Adotante</Text>
          <Text style={{ fontSize: 15, fontWeight: '600', color: '#1E1E1E' }}>{application?.adopterName || 'Não informado'}</Text>
        </View>

        <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: '#999', marginBottom: 4 }}>E-mail</Text>
          <Text style={{ fontSize: 15, fontWeight: '600', color: '#1E1E1E' }}>{application?.adopterEmail || 'Não informado'}</Text>
        </View>

        <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: '#999', marginBottom: 4 }}>Telefone</Text>
          <Text style={{ fontSize: 15, fontWeight: '600', color: '#1E1E1E' }}>{application?.adopterPhone || 'Não informado'}</Text>
        </View>

        <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: '#999', marginBottom: 4 }}>Pet Solicitado</Text>
          <Text style={{ fontSize: 15, fontWeight: '600', color: '#1E1E1E' }}>{application?.petName || 'Não informado'}</Text>
        </View>

        <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: '#999', marginBottom: 4 }}>Status</Text>
          <View style={{ backgroundColor: application?.status === 'Pendente' ? '#FFF3E0' : (application?.status === 'Aprovada' ? '#E8F5E9' : '#FFEBEE'), paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignSelf: 'flex-start' }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: application?.status === 'Pendente' ? '#E65100' : (application?.status === 'Aprovada' ? '#2E7D32' : '#C62828') }}>{application?.status}</Text>
          </View>
        </View>

        {!showRejectConfirm ? (
          <View>
            <TouchableOpacity disabled={!canReview} onPress={onApprove} style={{ backgroundColor: canReview ? '#8B2E0F' : '#CCC', paddingVertical: 14, borderRadius: 50, alignItems: 'center', marginTop: 15, flexDirection: 'row', justifyContent: 'center' }}>
              <Ionicons name="checkmark-outline" size={20} color={canReview ? 'white' : '#666'} />
              <Text style={{ color: canReview ? 'white' : '#666', fontSize: 16, fontWeight: '600', marginLeft: 8 }}>Aprovar</Text>
            </TouchableOpacity>

            <TouchableOpacity disabled={!canReview} onPress={onReject} style={{ backgroundColor: '#CCC', paddingVertical: 14, borderRadius: 50, alignItems: 'center', marginTop: 10, flexDirection: 'row', justifyContent: 'center' }}>
              <Ionicons name="close-outline" size={20} color={canReview ? '#333' : '#777'} />
              <Text style={{ color: canReview ? '#333' : '#777', fontSize: 16, fontWeight: '600', marginLeft: 8 }}>Recusar</Text>
            </TouchableOpacity>

            <TouchableOpacity disabled={!canOpenChat} onPress={onOpenChat} style={{ backgroundColor: canOpenChat ? '#66BB6A' : '#CCC', paddingVertical: 14, borderRadius: 50, alignItems: 'center', marginTop: 10, flexDirection: 'row', justifyContent: 'center' }}>
              <Ionicons name="chatbubble-outline" size={20} color={canOpenChat ? 'white' : '#666'} />
              <Text style={{ color: canOpenChat ? 'white' : '#666', fontSize: 16, fontWeight: '600', marginLeft: 8 }}>Conversar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ marginTop: 15 }}>
            <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#E65100' }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 }}>Tem certeza?</Text>
              <Text style={{ fontSize: 13, color: '#666', lineHeight: 18 }}>Você está prestes a recusar esta solicitação de adoção.</Text>
            </View>

            <TouchableOpacity onPress={onConfirmReject} style={{ backgroundColor: '#E65100', paddingVertical: 14, borderRadius: 50, alignItems: 'center' }}>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Sim, Recusar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onCancelReject} style={{ backgroundColor: '#F4A51C', paddingVertical: 14, borderRadius: 50, alignItems: 'center', marginTop: 10 }}>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Voltar</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};
