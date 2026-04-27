import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const MenuInferior = ({ 
  userType, 
  activeNavTab, 
  currentScreen, 
  onNavigate 
}) => {
  const navHeight = 70;
  const iconSize = 24;
  const fontSize = 13;

  if (userType === 'adopter') {
    return (
      <View style={{ flexDirection: 'row', backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#DDD', height: navHeight, paddingVertical: 8 }}>
        {[
          { key: 'home', icon: 'home-outline', activeIcon: 'home', label: 'Home' },
          { key: 'favorites', icon: 'heart-outline', activeIcon: 'heart', label: 'Favoritos' },
          { key: 'requests', icon: 'chatbubble-outline', activeIcon: 'chatbubble', label: 'Solicitações' },
          { key: 'profile', icon: 'person-outline', activeIcon: 'person', label: 'Perfil' },
        ].map((item) => (
          <TouchableOpacity
            key={item.key}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => onNavigate(item.key)}
          >
            <Ionicons 
              name={activeNavTab === item.key ? item.activeIcon : item.icon} 
              size={iconSize} 
              color={activeNavTab === item.key ? '#8B2E0F' : '#999'} 
            />
            <Text style={{ fontSize: fontSize, fontWeight: '600', color: activeNavTab === item.key ? '#8B2E0F' : '#999', marginTop: 4 }}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  } else {
    return (
      <View style={{ flexDirection: 'row', backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#DDD', height: navHeight, paddingVertical: 8 }}>
        {[
          { key: 'home', icon: 'home-outline', activeIcon: 'home', label: 'Home' },
          { key: 'pets', icon: 'paw-outline', activeIcon: 'paw', label: 'Pets' },
          { key: 'applications', icon: 'chatbubble-outline', activeIcon: 'chatbubble', label: 'Solicitações' },
          { key: 'profile', icon: 'person-outline', activeIcon: 'person', label: 'Perfil' },
        ].map((item) => (
          <TouchableOpacity
            key={item.key}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => onNavigate(item.key)}
          >
            <Ionicons 
              name={
                (item.key === 'home' && currentScreen === 'home') ? item.activeIcon :
                (item.key === 'pets' && currentScreen === 'shelter-manage-pets') ? item.activeIcon :
                (item.key === 'applications' && (currentScreen === 'shelter-applications' || currentScreen === 'shelter-application-detail')) ? item.activeIcon :
                (item.key === 'profile' && currentScreen === 'shelter-profile') ? item.activeIcon :
                item.icon
              } 
              size={iconSize} 
              color={
                (item.key === 'home' && currentScreen === 'home') ? '#8B2E0F' :
                (item.key === 'pets' && currentScreen === 'shelter-manage-pets') ? '#8B2E0F' :
                (item.key === 'applications' && (currentScreen === 'shelter-applications' || currentScreen === 'shelter-application-detail')) ? '#8B2E0F' :
                (item.key === 'profile' && currentScreen === 'shelter-profile') ? '#8B2E0F' :
                '#999'
              } 
            />
            <Text style={{ 
              fontSize: fontSize, 
              fontWeight: '600', 
              color: (item.key === 'home' && currentScreen === 'home') ? '#8B2E0F' :
                     (item.key === 'pets' && currentScreen === 'shelter-manage-pets') ? '#8B2E0F' :
                     (item.key === 'applications' && (currentScreen === 'shelter-applications' || currentScreen === 'shelter-application-detail')) ? '#8B2E0F' :
                     (item.key === 'profile' && currentScreen === 'shelter-profile') ? '#8B2E0F' :
                     '#999',
              marginTop: 4
            }}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }
};