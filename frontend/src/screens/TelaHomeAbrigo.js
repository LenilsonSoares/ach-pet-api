import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CabecalhoAbrigo } from '../components/CabecalhoAbrigo';

export const TelaHomeAbrigo = ({ 
  currentUser, 
  stats, 
  onManagePets, 
  onApplications, 
  onAdoptions, 
  onAddPet 
}) => {
  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <CabecalhoAbrigo showBack={false} />

      <ScrollView style={{ flex: 1, padding: 20 }} showsVerticalScrollIndicator={false}>
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 28, fontWeight: '700', color: '#1E1E1E' }}>
            Bem-vindo, 👋
          </Text>
          <Text style={{ fontSize: 20, fontWeight: '600', color: '#8B2E0F', marginTop: 4 }}>
            {currentUser?.name}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 }}>
          <View style={{ 
            flex: 1, 
            backgroundColor: 'white', 
            borderRadius: 20, 
            padding: 16, 
            marginRight: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
            alignItems: 'center'
          }}>
            <View style={{ 
              width: 48, 
              height: 48, 
              borderRadius: 24, 
              backgroundColor: '#FFF3E0', 
              justifyContent: 'center', 
              alignItems: 'center',
              marginBottom: 12
            }}>
              <Ionicons name="paw" size={24} color="#8B2E0F" />
            </View>
            <Text style={{ fontSize: 24, fontWeight: '700', color: '#8B2E0F' }}>{stats.pets}</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#666', marginTop: 4 }}>Pets</Text>
          </View>

          <View style={{ 
            flex: 1, 
            backgroundColor: 'white', 
            borderRadius: 20, 
            padding: 16, 
            marginHorizontal: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
            alignItems: 'center'
          }}>
            <View style={{ 
              width: 48, 
              height: 48, 
              borderRadius: 24, 
              backgroundColor: '#FFF3E0', 
              justifyContent: 'center', 
              alignItems: 'center',
              marginBottom: 12
            }}>
              <Ionicons name="chatbubble" size={24} color="#8B2E0F" />
            </View>
            <Text style={{ fontSize: 24, fontWeight: '700', color: '#8B2E0F' }}>{stats.applications}</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#666', marginTop: 4 }}>Solicitações</Text>
          </View>

          <View style={{ 
            flex: 1, 
            backgroundColor: 'white', 
            borderRadius: 20, 
            padding: 16, 
            marginLeft: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
            alignItems: 'center'
          }}>
            <View style={{ 
              width: 48, 
              height: 48, 
              borderRadius: 24, 
              backgroundColor: '#FFF3E0', 
              justifyContent: 'center', 
              alignItems: 'center',
              marginBottom: 12
            }}>
              <Ionicons name="heart" size={24} color="#8B2E0F" />
            </View>
            <Text style={{ fontSize: 24, fontWeight: '700', color: '#8B2E0F' }}>{stats.adoptions}</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#666', marginTop: 4 }}>Adoções</Text>
          </View>
        </View>

        <Text style={{ fontSize: 18, fontWeight: '700', color: '#1E1E1E', marginBottom: 16 }}>
          Ações Rápidas
        </Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 }}>
          <TouchableOpacity 
            onPress={onManagePets} 
            style={{ 
              width: '48%', 
              backgroundColor: 'white', 
              borderRadius: 16, 
              padding: 20, 
              marginBottom: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 6,
              elevation: 3,
              alignItems: 'center'
            }}
          >
            <View style={{ 
              width: 56, 
              height: 56, 
              borderRadius: 28, 
              backgroundColor: '#F4A51C', 
              justifyContent: 'center', 
              alignItems: 'center',
              marginBottom: 12
            }}>
              <Ionicons name="paw-outline" size={28} color="white" />
            </View>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#1E1E1E', marginBottom: 4 }}>Gerenciar Pets</Text>
            <Text style={{ fontSize: 12, color: '#999', textAlign: 'center' }}>Cadastre e edite seus pets</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={onApplications} 
            style={{ 
              width: '48%', 
              backgroundColor: 'white', 
              borderRadius: 16, 
              padding: 20, 
              marginBottom: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 6,
              elevation: 3,
              alignItems: 'center'
            }}
          >
            <View style={{ 
              width: 56, 
              height: 56, 
              borderRadius: 28, 
              backgroundColor: '#F4A51C', 
              justifyContent: 'center', 
              alignItems: 'center',
              marginBottom: 12
            }}>
              <Ionicons name="chatbubble-outline" size={28} color="white" />
            </View>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#1E1E1E', marginBottom: 4 }}>Solicitações</Text>
            <Text style={{ fontSize: 12, color: '#999', textAlign: 'center' }}>{stats.applications} pendentes</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={onAdoptions} 
            style={{ 
              width: '48%', 
              backgroundColor: 'white', 
              borderRadius: 16, 
              padding: 20, 
              marginBottom: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 6,
              elevation: 3,
              alignItems: 'center'
            }}
          >
            <View style={{ 
              width: 56, 
              height: 56, 
              borderRadius: 28, 
              backgroundColor: '#F4A51C', 
              justifyContent: 'center', 
              alignItems: 'center',
              marginBottom: 12
            }}>
              <Ionicons name="heart-outline" size={28} color="white" />
            </View>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#1E1E1E', marginBottom: 4 }}>Acompanhamento</Text>
            <Text style={{ fontSize: 12, color: '#999', textAlign: 'center' }}>{stats.adoptions} adoções ativas</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={onAddPet} 
            style={{ 
              width: '48%', 
              backgroundColor: '#8B2E0F', 
              borderRadius: 16, 
              padding: 20, 
              marginBottom: 16,
              shadowColor: '#8B2E0F',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
              alignItems: 'center'
            }}
          >
            <View style={{ 
              width: 56, 
              height: 56, 
              borderRadius: 28, 
              backgroundColor: 'rgba(255,255,255,0.2)', 
              justifyContent: 'center', 
              alignItems: 'center',
              marginBottom: 12
            }}>
              <Ionicons name="add-outline" size={32} color="white" />
            </View>
            <Text style={{ fontSize: 16, fontWeight: '600', color: 'white', marginBottom: 4 }}>Cadastrar Pet</Text>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', textAlign: 'center' }}>Adicione um novo pet</Text>
          </TouchableOpacity>
        </View>

        <View style={{ 
          backgroundColor: '#F4A51C', 
          borderRadius: 16, 
          padding: 20, 
          marginBottom: 30,
          shadowColor: '#F4A51C',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 5
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <View style={{ 
              width: 40, 
              height: 40, 
              borderRadius: 20, 
              backgroundColor: 'white', 
              justifyContent: 'center', 
              alignItems: 'center',
              marginRight: 12
            }}>
              <Ionicons name="bulb-outline" size={24} color="#F4A51C" />
            </View>
            <Text style={{ fontSize: 16, fontWeight: '700', color: 'white' }}>Dica do Dia</Text>
          </View>
          <Text style={{ fontSize: 14, color: 'white', lineHeight: 20 }}>
            Mantenha os dados dos seus pets sempre atualizados para receber mais solicitações de adoção! 
            Quanto mais informações, mais chances de encontrar um lar para eles.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};