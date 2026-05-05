import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const marrom = '#8B2E0F';
const cinzaTexto = '#999';

export const MenuInferior = ({
  userType,
  activeNavTab,
  currentScreen,
  onNavigate
}) => {
  const insets = useSafeAreaInsets();
  const navHeight = 64;
  const bottomInset = Math.max(insets.bottom, 6);
  const iconSize = 23;
  const fontSize = 12;

  const adopterItems = [
    { key: 'home', icon: 'home-outline', activeIcon: 'home', label: 'Home' },
    { key: 'favorites', icon: 'heart-outline', activeIcon: 'heart', label: 'Favoritos' },
    { key: 'requests', icon: 'chatbubble-outline', activeIcon: 'chatbubble', label: 'Solicitações' },
    { key: 'profile', icon: 'person-outline', activeIcon: 'person', label: 'Perfil' }
  ];

  const shelterItems = [
    { key: 'home', icon: 'home-outline', activeIcon: 'home', label: 'Home' },
    { key: 'pets', icon: 'paw-outline', activeIcon: 'paw', label: 'Pets' },
    { key: 'applications', icon: 'chatbubble-outline', activeIcon: 'chatbubble', label: 'Solicitações' },
    { key: 'profile', icon: 'person-outline', activeIcon: 'person', label: 'Perfil' }
  ];

  const isShelterActive = (key) => {
    if (key === 'home') return currentScreen === 'home';
    if (key === 'pets') return currentScreen === 'shelter-manage-pets';
    if (key === 'applications') {
      return currentScreen === 'shelter-applications' || currentScreen === 'shelter-application-detail';
    }
    if (key === 'profile') return currentScreen === 'shelter-profile';
    return false;
  };

  const items = userType === 'adopter' ? adopterItems : shelterItems;

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#DDD',
        height: navHeight + bottomInset,
        paddingTop: 6,
        paddingBottom: bottomInset
      }}
    >
      {items.map((item) => {
        const active = userType === 'adopter'
          ? activeNavTab === item.key
          : isShelterActive(item.key);

        return (
          <TouchableOpacity
            key={item.key}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', minWidth: 0 }}
            onPress={() => onNavigate(item.key)}
          >
            <Ionicons
              name={active ? item.activeIcon : item.icon}
              size={iconSize}
              color={active ? marrom : cinzaTexto}
            />
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.82}
              style={{
                width: '100%',
                textAlign: 'center',
                fontSize,
                fontWeight: '600',
                color: active ? marrom : cinzaTexto,
                marginTop: 3
              }}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
