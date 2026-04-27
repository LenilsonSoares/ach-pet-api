import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { width } from '../utils/constantes';

export const TelaDetalhesPet = ({
  pet,
  favorites,
  currentGalleryIndex,
  onVoltar,
  onToggleFavorite,
  onPrevGallery,
  onNextGallery,
  onAdotar,
  onOpenChat
}) => {
  const isFavorite = favorites[pet?.id] || false;

  return (
    <View style={{ flex: 1, backgroundColor: '#EDEDED' }}>
      <View style={{ backgroundColor: '#F4A51C', padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <TouchableOpacity onPress={onVoltar}>
          <Ionicons name="arrow-back" size={24} color="#1E1E1E" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#1E1E1E' }}>{pet?.name}</Text>
        <TouchableOpacity onPress={() => onToggleFavorite(pet?.id)}>
          <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={24} color={isFavorite ? '#8B2E0F' : '#555'} />
        </TouchableOpacity>
      </View>

      <View style={{ height: 250, backgroundColor: '#F4A51C', position: 'relative' }}>
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          onNextGallery(index);
        }}>
          {pet?.gallery.map((image, index) => (
            <Image key={index} source={image} style={{ width, height: 250 }} resizeMode="cover" />
          ))}
        </ScrollView>

        <View style={{ position: 'absolute', bottom: 12, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 6 }}>
          {pet?.gallery.map((_, index) => (
            <View key={index} style={{ width: currentGalleryIndex === index ? 24 : 8, height: 8, borderRadius: 4, backgroundColor: currentGalleryIndex === index ? 'white' : 'rgba(255,255,255,0.5)' }} />
          ))}
        </View>

        <TouchableOpacity style={{ position: 'absolute', left: 12, top: '50%', transform: [{ translateY: -18 }], backgroundColor: 'rgba(0,0,0,0.4)', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' }} onPress={onPrevGallery}>
          <Ionicons name="chevron-back" size={20} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={{ position: 'absolute', right: 12, top: '50%', transform: [{ translateY: -18 }], backgroundColor: 'rgba(0,0,0,0.4)', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' }} onPress={onNextGallery}>
          <Ionicons name="chevron-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#1E1E1E' }}>{pet?.name}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          <Ionicons name="location-outline" size={16} color="#555" />
          <Text style={{ fontSize: 13, color: '#555', marginLeft: 4 }}>{pet?.location}</Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
          {pet?.tags.map((tag, index) => (
            <View key={index} style={{ backgroundColor: '#F5F5F5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: '#555' }}>{tag}</Text>
            </View>
          ))}
        </View>

        <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, marginTop: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E1E1E', marginBottom: 8 }}>Sobre</Text>
          <Text style={{ fontSize: 13, color: '#555', lineHeight: 18 }}>{pet?.description}</Text>
        </View>

        <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, marginTop: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E1E1E', marginBottom: 12 }}>Informações do Abrigo</Text>
          <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
            <View style={{ width: 50, height: 50, backgroundColor: '#F5F5F5', borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
              <Ionicons name="business" size={30} color="#1E1E1E" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E1E1E' }}>{pet?.shelter}</Text>
              <Text style={{ fontSize: 12, color: '#555' }}>{pet?.shelterLocation}</Text>
              <Text style={{ fontSize: 12, color: '#555', marginTop: 2 }}>📞 {pet?.shelterPhone}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={{ padding: 16, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#DDD' }}>
        <TouchableOpacity 
          style={{ backgroundColor: '#8B2E0F', paddingVertical: 14, borderRadius: 50, shadowColor: '#8B2E0F', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 5 }} 
          onPress={onAdotar}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', textAlign: 'center' }}>Adote-me! 🐾</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};