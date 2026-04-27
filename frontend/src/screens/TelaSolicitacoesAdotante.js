import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { logo } from '../utils/constantes';

export const TelaSolicitacoesAdotante = ({ 
  activeTab, 
  onTabChange, 
  applications, 
  onOpenChat 
}) => {
  const getApplicationsByStatus = (status) => {
    if (status === 'analyzing') return applications.filter(a => a.status === 'Pendente');
    if (status === 'approved') return applications.filter(a => a.status === 'Aprovada');
    if (status === 'rejected') return applications.filter(a => a.status === 'Recusada');
    return [];
  };

  const filteredApps = getApplicationsByStatus(activeTab);

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Pendente':
        return { bg: '#FFF3E0', text: '#F4A51C', label: 'Em análise' };
      case 'Aprovada':
        return { bg: '#E8F5E9', text: '#4CAF50', label: 'Aprovada' };
      case 'Recusada':
        return { bg: '#FFEBEE', text: '#F44336', label: 'Recusada' };
      default:
        return { bg: '#F5F5F5', text: '#999', label: status };
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#EDEDED' }}>
      <View style={{ backgroundColor: '#F4A51C', paddingTop: 40, paddingHorizontal: 20, paddingBottom: 15 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Image source={logo} style={{ width: 50, height: 50 }} resizeMode="contain" />
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#1E1E1E' }}>Solicitações</Text>
          <View style={{ width: 50 }} />
        </View>
      </View>

      <View style={{ flex: 1, padding: 20 }}>
        {/* Abas de navegação */}
        <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#DDD', marginBottom: 20 }}>
          {[
            { key: 'analyzing', label: 'Em análise' },
            { key: 'approved', label: 'Aprovadas' },
            { key: 'rejected', label: 'Recusadas' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={{ 
                flex: 1, 
                paddingVertical: 12, 
                borderBottomWidth: 3, 
                borderBottomColor: activeTab === tab.key ? '#8B2E0F' : 'transparent' 
              }}
              onPress={() => onTabChange(tab.key)}
            >
              <Text style={{ 
                textAlign: 'center', 
                color: activeTab === tab.key ? '#8B2E0F' : '#999', 
                fontWeight: '600', 
                fontSize: 13 
              }}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Lista de solicitações */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ gap: 12 }}>
            {filteredApps.length > 0 ? (
              filteredApps.map((app) => {
                const statusStyle = getStatusStyle(app.status);
                
                return (
                  <View 
                    key={app.id} 
                    style={{ 
                      backgroundColor: 'white', 
                      borderRadius: 12, 
                      padding: 16, 
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.08,
                      shadowRadius: 8,
                      elevation: 3
                    }}
                  >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 16, fontWeight: '700', color: '#1E1E1E', marginBottom: 4 }}>
                          {app.petName}
                        </Text>
                        <Text style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
                          Solicitado em {new Date(app.date).toLocaleDateString('pt-BR')}
                        </Text>
                        
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                          <Ionicons name="person-outline" size={12} color="#666" />
                          <Text style={{ fontSize: 12, color: '#666', marginLeft: 4 }}>
                            Abrigo: {app.shelter || 'Abrigo'}
                          </Text>
                        </View>
                      </View>
                      
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        {app.status === 'Pendente' && (
                          <TouchableOpacity 
                            onPress={() => onOpenChat(app.shelterId, app.shelter || 'Abrigo', app.petName)} 
                            style={{ 
                              backgroundColor: '#F4A51C', 
                              padding: 8, 
                              borderRadius: 8,
                              shadowColor: '#F4A51C',
                              shadowOffset: { width: 0, height: 2 },
                              shadowOpacity: 0.2,
                              shadowRadius: 4,
                              elevation: 2
                            }}
                          >
                            <Ionicons name="chatbubble-outline" size={16} color="#1E1E1E" />
                          </TouchableOpacity>
                        )}
                        
                        <View style={{ 
                          backgroundColor: statusStyle.bg, 
                          paddingHorizontal: 12, 
                          paddingVertical: 6, 
                          borderRadius: 20 
                        }}>
                          <Text style={{ fontSize: 12, fontWeight: '600', color: statusStyle.text }}>
                            {statusStyle.label}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {app.status === 'Aprovada' && (
                      <View style={{ 
                        marginTop: 12, 
                        paddingTop: 12, 
                        borderTopWidth: 1, 
                        borderTopColor: '#F0F0F0',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8
                      }}>
                        <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                        <Text style={{ fontSize: 12, color: '#4CAF50', flex: 1 }}>
                          Parabéns! Sua solicitação foi aprovada. Entre em contato com o abrigo.
                        </Text>
                      </View>
                    )}

                    {app.status === 'Recusada' && (
                      <View style={{ 
                        marginTop: 12, 
                        paddingTop: 12, 
                        borderTopWidth: 1, 
                        borderTopColor: '#F0F0F0',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8
                      }}>
                        <Ionicons name="alert-circle" size={16} color="#F44336" />
                        <Text style={{ fontSize: 12, color: '#F44336', flex: 1 }}>
                          Solicitação não aprovada desta vez. Continue procurando outros pets!
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })
            ) : (
              <View style={{ 
                padding: 40, 
                alignItems: 'center',
                backgroundColor: 'white',
                borderRadius: 12,
                marginTop: 20
              }}>
                <Ionicons 
                  name={
                    activeTab === 'analyzing' ? 'time-outline' :
                    activeTab === 'approved' ? 'checkmark-circle-outline' : 'close-circle-outline'
                  } 
                  size={60} 
                  color="#999" 
                />
                <Text style={{ fontSize: 16, color: '#999', textAlign: 'center', marginTop: 10 }}>
                  {activeTab === 'analyzing' && 'Nenhuma solicitação em análise'}
                  {activeTab === 'approved' && 'Nenhuma solicitação aprovada'}
                  {activeTab === 'rejected' && 'Nenhuma solicitação recusada'}
                </Text>
                <Text style={{ fontSize: 14, color: '#999', textAlign: 'center', marginTop: 5 }}>
                  {activeTab === 'analyzing' && 'Suas solicitações aparecerão aqui'}
                  {activeTab === 'approved' && 'Suas solicitações aprovadas aparecerão aqui'}
                  {activeTab === 'rejected' && 'Suas solicitações recusadas aparecerão aqui'}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};