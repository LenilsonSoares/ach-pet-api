import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { logo } from '../utils/constantes';

export const TelaFavoritos = ({ favoritePets, onShowPetDetails, onToggleFavorite }) => (
  <View style={{ flex: 1, backgroundColor: '#EDEDED' }}>
    <View style={{ backgroundColor: '#F4A51C', paddingTop: 40, paddingHorizontal: 20, paddingBottom: 15 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Image source={logo} style={{ width: 50, height: 50 }} resizeMode="contain" />
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#1E1E1E' }}>Favoritos</Text>
        <View style={{ width: 50 }} />
      </View>
    </View>

    <ScrollView style={{ flex: 1, padding: 20 }}>
      {favoritePets.length > 0 ? (
        favoritePets.map((pet) => (
          <TouchableOpacity key={pet.id} style={{ backgroundColor: 'white', borderRadius: 16, padding: 16, flexDirection: 'row', gap: 12, marginBottom: 16 }} onPress={() => onShowPetDetails(pet)}>
            <Image source={pet.image} style={{ width: 70, height: 70, borderRadius: 12, backgroundColor: '#F5F5F5' }} resizeMode="cover" />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#1E1E1E' }}>{pet.name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Ionicons name="location-outline" size={12} color="#555" />
                <Text style={{ fontSize: 12, color: '#555', marginLeft: 2 }}>{pet.neighborhood}</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {pet.tags.slice(0, 2).map((tag, i) => (
                  <View key={i} style={{ backgroundColor: '#F5F5F5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                    <Text style={{ fontSize: 11, fontWeight: '600', color: '#555' }}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
            <TouchableOpacity style={{ position: 'absolute', top: 12, right: 12 }} onPress={() => onToggleFavorite(pet.id)}>
              <Ionicons name="heart" size={20} color="#8B2E0F" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 50 }}>
          <Ionicons name="heart-outline" size={60} color="#999" />
          <Text style={{ fontSize: 16, color: '#999', marginTop: 10 }}>Nenhum favorito ainda</Text>
          <Text style={{ fontSize: 14, color: '#999', textAlign: 'center', marginTop: 5 }}>Toque no coração nos cards para adicionar aos favoritos</Text>
        </View>
      )}
    </ScrollView>
  </View>
);