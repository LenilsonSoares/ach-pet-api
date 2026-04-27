import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CabecalhoAbrigo } from '../components/CabecalhoAbrigo';

export const TelaPerfilAbrigo = ({ currentUser, stats, successRate, onLogout, onVoltar }) => {
  return (
    <View style={{ flex: 1, backgroundColor: '#EDEDED' }}>
      <CabecalhoAbrigo title="Perfil" onBack={onVoltar} />

      <ScrollView style={{ flex: 1, padding: 20, paddingBottom: 70 }}>
        <View style={{ backgroundColor: '#F4A51C', borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 20, shadowColor: '#F4A51C', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 5 }}>
          <Ionicons name="business" size={56} color="white" />
          <Text style={{ fontSize: 20, fontWeight: '700', color: 'white', marginBottom: 4, marginTop: 12 }}>{currentUser?.name}</Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)' }}>📍 Vitória da Conquista, BA</Text>
        </View>

        <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E1E1E', marginBottom: 12 }}>Informações do Abrigo</Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' }}>
            <Text style={{ fontSize: 13, color: '#666', fontWeight: '600' }}>E-mail</Text>
            <Text style={{ fontSize: 13, color: '#1E1E1E', fontWeight: '500' }}>{currentUser?.email}</Text>
          </View>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' }}>
            <Text style={{ fontSize: 13, color: '#666', fontWeight: '600' }}>Telefone</Text>
            <Text style={{ fontSize: 13, color: '#1E1E1E', fontWeight: '500' }}>{currentUser?.phone}</Text>
          </View>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 }}>
            <Text style={{ fontSize: 13, color: '#666', fontWeight: '600' }}>Endereço</Text>
            <Text style={{ fontSize: 13, color: '#1E1E1E', fontWeight: '500', textAlign: 'right' }}>{currentUser?.address}</Text>
          </View>
        </View>

        <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E1E1E', marginBottom: 12 }}>Estatísticas</Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' }}>
            <Text style={{ fontSize: 13, color: '#666', fontWeight: '600' }}>Pets cadastrados</Text>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#8B2E0F' }}>{stats.pets}</Text>
          </View>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' }}>
            <Text style={{ fontSize: 13, color: '#666', fontWeight: '600' }}>Adoções realizadas</Text>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#8B2E0F' }}>{stats.adoptions}</Text>
          </View>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 }}>
            <Text style={{ fontSize: 13, color: '#666', fontWeight: '600' }}>Taxa de sucesso</Text>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#2E7D32' }}>{successRate}%</Text>
          </View>
        </View>

        <View style={{ gap: 10 }}>
          <TouchableOpacity onPress={() => Alert.alert('Função', 'Alterar senha')} style={{ backgroundColor: '#F4A51C', paddingVertical: 14, borderRadius: 50, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
            <Ionicons name="lock-closed-outline" size={20} color="white" />
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>Alterar Senha</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Alert.alert('Função', 'Notificações')} style={{ backgroundColor: '#F4A51C', paddingVertical: 14, borderRadius: 50, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
            <Ionicons name="notifications-outline" size={20} color="white" />
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>Notificações</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onLogout} style={{ backgroundColor: '#D32F2F', paddingVertical: 14, borderRadius: 50, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
            <Ionicons name="exit-outline" size={20} color="white" />
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>Sair</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};