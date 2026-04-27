import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { logo } from '../utils/constantes';

export const TelaPerfilAdotante = ({ currentUser, applications, onLogout, onEditProfile }) => {
  const user = currentUser || {
    name: 'João Silva',
    email: 'joao@email.com',
    phone: '(77) 99999-8888',
    address: 'Rua das Flores, 123 - Centro',
    cpf: '123.456.789-00',
    birthDate: '10/05/1990'
  };

  const stats = {
    total: applications?.length || 0,
    approved: applications?.filter(a => a.status === 'Aprovada').length || 0,
    pending: applications?.filter(a => a.status === 'Pendente').length || 0,
    rejected: applications?.filter(a => a.status === 'Recusada').length || 0
  };

  const handleChangePassword = () => {
    Alert.alert('Função', 'Alterar senha será implementado em breve!');
  };

  const handleNotifications = () => {
    Alert.alert('Função', 'Configurações de notificação serão implementadas em breve!');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Excluir Conta',
      'Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => Alert.alert('Conta excluída', 'Sua conta foi excluída com sucesso.')
        }
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#EDEDED' }}>
      <View style={{ backgroundColor: '#F4A51C', paddingTop: 40, paddingHorizontal: 20, paddingBottom: 15 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Image source={logo} style={{ width: 50, height: 50 }} resizeMode="contain" />
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#1E1E1E' }}>Meu Perfil</Text>
          <TouchableOpacity onPress={onEditProfile}>
            <Ionicons name="create-outline" size={24} color="#1E1E1E" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ flex: 1, padding: 20 }} showsVerticalScrollIndicator={false}>
        <View style={{ 
          backgroundColor: 'white', 
          borderRadius: 16, 
          padding: 24, 
          alignItems: 'center', 
          marginBottom: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 3
        }}>
          <View style={{ 
            width: 100, 
            height: 100, 
            borderRadius: 50, 
            backgroundColor: '#F4A51C', 
            justifyContent: 'center', 
            alignItems: 'center',
            marginBottom: 16,
            borderWidth: 3,
            borderColor: '#FFF'
          }}>
            <Ionicons name="person" size={60} color="white" />
          </View>
          <Text style={{ fontSize: 22, fontWeight: '700', color: '#1E1E1E', marginBottom: 4 }}>
            {user.name}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={{ fontSize: 14, color: '#666', marginLeft: 4 }}>
              Vitória da Conquista, BA
            </Text>
          </View>
        </View>

        <View style={{ 
          backgroundColor: 'white', 
          borderRadius: 12, 
          padding: 16, 
          marginBottom: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 3
        }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#1E1E1E', marginBottom: 16 }}>
            Informações Pessoais
          </Text>
          
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 12, color: '#999', marginBottom: 2 }}>E-mail</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="mail-outline" size={16} color="#666" />
              <Text style={{ fontSize: 14, color: '#1E1E1E', marginLeft: 8 }}>{user.email}</Text>
            </View>
          </View>
          
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 12, color: '#999', marginBottom: 2 }}>Telefone</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="call-outline" size={16} color="#666" />
              <Text style={{ fontSize: 14, color: '#1E1E1E', marginLeft: 8 }}>{user.phone}</Text>
            </View>
          </View>
          
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 12, color: '#999', marginBottom: 2 }}>CPF</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="card-outline" size={16} color="#666" />
              <Text style={{ fontSize: 14, color: '#1E1E1E', marginLeft: 8 }}>{user.cpf}</Text>
            </View>
          </View>
          
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 12, color: '#999', marginBottom: 2 }}>Data de Nascimento</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={{ fontSize: 14, color: '#1E1E1E', marginLeft: 8 }}>{user.birthDate}</Text>
            </View>
          </View>
          
          <View>
            <Text style={{ fontSize: 12, color: '#999', marginBottom: 2 }}>Endereço</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="home-outline" size={16} color="#666" />
              <Text style={{ fontSize: 14, color: '#1E1E1E', marginLeft: 8, flex: 1 }}>{user.address}</Text>
            </View>
          </View>
        </View>

        <View style={{ 
          backgroundColor: 'white', 
          borderRadius: 12, 
          padding: 16, 
          marginBottom: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 3
        }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#1E1E1E', marginBottom: 16 }}>
            Histórico de Adoções
          </Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: '700', color: '#F4A51C' }}>{stats.total}</Text>
              <Text style={{ fontSize: 12, color: '#666' }}>Total</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: '700', color: '#4CAF50' }}>{stats.approved}</Text>
              <Text style={{ fontSize: 12, color: '#666' }}>Aprovadas</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: '700', color: '#F4A51C' }}>{stats.pending}</Text>
              <Text style={{ fontSize: 12, color: '#666' }}>Pendentes</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: '700', color: '#F44336' }}>{stats.rejected}</Text>
              <Text style={{ fontSize: 12, color: '#666' }}>Recusadas</Text>
            </View>
          </View>

          {applications && applications.length > 0 && (
            <View>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#1E1E1E', marginBottom: 8 }}>
                Últimas atividades
              </Text>
              {applications.slice(0, 3).map((app, index) => (
                <View 
                  key={index} 
                  style={{ 
                    flexDirection: 'row', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingVertical: 8,
                    borderBottomWidth: index < 2 ? 1 : 0,
                    borderBottomColor: '#F0F0F0'
                  }}
                >
                  <View>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#1E1E1E' }}>
                      {app.petName}
                    </Text>
                    <Text style={{ fontSize: 11, color: '#999' }}>
                      {new Date(app.date).toLocaleDateString('pt-BR')}
                    </Text>
                  </View>
                  <View style={{ 
                    backgroundColor: app.status === 'Pendente' ? '#FFF3E0' :
                                   app.status === 'Aprovada' ? '#E8F5E9' : '#FFEBEE',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12
                  }}>
                    <Text style={{ 
                      fontSize: 10, 
                      fontWeight: '600',
                      color: app.status === 'Pendente' ? '#F4A51C' :
                             app.status === 'Aprovada' ? '#4CAF50' : '#F44336'
                    }}>
                      {app.status}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={{ gap: 10, marginBottom: 20 }}>
          <TouchableOpacity 
            onPress={handleChangePassword}
            style={{ 
              backgroundColor: 'white', 
              paddingVertical: 14, 
              paddingHorizontal: 16,
              borderRadius: 12, 
              flexDirection: 'row', 
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 3
            }}
          >
            <Ionicons name="lock-closed-outline" size={20} color="#8B2E0F" />
            <Text style={{ color: '#1E1E1E', fontSize: 14, fontWeight: '600', marginLeft: 12, flex: 1 }}>
              Alterar Senha
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={handleNotifications}
            style={{ 
              backgroundColor: 'white', 
              paddingVertical: 14, 
              paddingHorizontal: 16,
              borderRadius: 12, 
              flexDirection: 'row', 
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 3
            }}
          >
            <Ionicons name="notifications-outline" size={20} color="#8B2E0F" />
            <Text style={{ color: '#1E1E1E', fontSize: 14, fontWeight: '600', marginLeft: 12, flex: 1 }}>
              Notificações
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={handleDeleteAccount}
            style={{ 
              backgroundColor: 'white', 
              paddingVertical: 14, 
              paddingHorizontal: 16,
              borderRadius: 12, 
              flexDirection: 'row', 
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 3
            }}
          >
            <Ionicons name="warning-outline" size={20} color="#F44336" />
            <Text style={{ color: '#F44336', fontSize: 14, fontWeight: '600', marginLeft: 12, flex: 1 }}>
              Excluir Conta
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#F44336" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={{ 
            backgroundColor: '#D32F2F', 
            paddingVertical: 14, 
            borderRadius: 50, 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'center', 
            marginBottom: 30,
            shadowColor: '#D32F2F',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5
          }} 
          onPress={onLogout}
        >
          <Ionicons name="exit-outline" size={20} color="white" />
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', marginLeft: 8 }}>Sair da Conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};