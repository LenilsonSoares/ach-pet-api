import React from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MensagemSucesso } from '../components/MensagemSucesso';
import { logo } from '../utils/constantes';

export const TelaHomeAdotante = ({
  showSuccessMessage,
  activeCategory,
  filteredPets,
  favorites,
  onFilterByCategory,
  onOpenFilters,
  onShowPetDetails,
  onToggleFavorite,
  onGoToRequests,
  onSearch
}) => {
  const BannerMotivacional = () => (
    <View style={{ backgroundColor: '#F4A51C', borderRadius: 16, padding: 20, marginBottom: 20, borderBottomWidth: 3, borderBottomColor: '#8B2E0F' }}>
      <Text style={{ fontSize: 18, fontWeight: '700', color: 'white', textAlign: 'center' }}>Encontre seu novo amigo!</Text>
      <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', textAlign: 'center' }}>{filteredPets.length} pets esperando um lar</Text>
    </View>
  );

  const renderIcon = (iconName, size, color, family) => {
    if (family === 'FontAwesome5') return <FontAwesome5 name={iconName} size={size} color={color} />;
    return <Ionicons name={iconName} size={size} color={color} />;
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#EDEDED' }}>
      <View style={{ backgroundColor: '#F4A51C', paddingTop: 40, paddingHorizontal: 20, paddingBottom: 15 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Image source={logo} style={{ width: 50, height: 50 }} resizeMode="contain" />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="location-outline" size={16} color="#1E1E1E" />
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#1E1E1E', marginLeft: 4 }}>Vitória da Conquista, BA</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={20} color="#1E1E1E" />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 20, paddingHorizontal: 12 }}>
          <Ionicons name="search-outline" size={18} color="#999" />
          <TextInput 
            style={{ flex: 1, padding: 10, fontSize: 13 }} 
            placeholder="Buscar pets..." 
            placeholderTextColor="#999"
            onChangeText={onSearch}
          />
        </View>
      </View>

      <ScrollView style={{ flex: 1, padding: 20 }} showsVerticalScrollIndicator={false}>
        {showSuccessMessage && <MensagemSucesso onAcompanhar={onGoToRequests} />}
        <BannerMotivacional />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {[
              { label: 'Cães', icon: 'dog', family: 'FontAwesome5', category: 'dogs' },
              { label: 'Gatos', icon: 'cat', family: 'FontAwesome5', category: 'cats' },
              { label: 'Outros', icon: 'paw', family: 'FontAwesome5', category: 'others' }
            ].map((item, index) => (
              <TouchableOpacity
                key={index}
                style={{ backgroundColor: activeCategory === item.category ? '#8B2E0F' : 'white', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 10, flexDirection: 'row', alignItems: 'center' }}
                onPress={() => onFilterByCategory(item.category)}
              >
                {renderIcon(item.icon, 16, activeCategory === item.category ? 'white' : '#555', item.family)}
                <Text style={{ color: activeCategory === item.category ? 'white' : '#555', fontWeight: '600', fontSize: 13, marginLeft: 6 }}>{item.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={{ backgroundColor: 'white', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, flexDirection: 'row', alignItems: 'center' }} onPress={onOpenFilters}>
              <Ionicons name="options-outline" size={16} color="#555" />
              <Text style={{ color: '#555', fontWeight: '600', fontSize: 13, marginLeft: 6 }}>Filtros</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={{ gap: 16 }}>
          {filteredPets.map((pet) => (
            <TouchableOpacity
              key={pet.id}
              style={{ backgroundColor: 'white', borderRadius: 16, padding: 16, flexDirection: 'row', gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }}
              onPress={() => onShowPetDetails(pet)}
            >
              <Image source={pet.image} style={{ width: 70, height: 70, borderRadius: 12, backgroundColor: '#F5F5F5' }} resizeMode="cover" />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#1E1E1E' }}>{pet.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <Ionicons name="location-outline" size={12} color="#555" />
                  <Text style={{ fontSize: 12, color: '#555', marginLeft: 2 }}>{pet.neighborhood}, {pet.city}</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                  {pet.tags.slice(0, 3).map((tag, i) => (
                    <View key={i} style={{ backgroundColor: '#F5F5F5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                      <Text style={{ fontSize: 11, fontWeight: '600', color: '#555' }}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <TouchableOpacity style={{ position: 'absolute', top: 12, right: 12 }} onPress={() => onToggleFavorite(pet.id)}>
                <Ionicons name={favorites[pet.id] ? 'heart' : 'heart-outline'} size={20} color={favorites[pet.id] ? '#8B2E0F' : '#555'} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
          
          {filteredPets.length === 0 && (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <Ionicons name="sad-outline" size={50} color="#999" />
              <Text style={{ fontSize: 16, color: '#999', textAlign: 'center', marginTop: 10 }}>Nenhum pet encontrado com os filtros selecionados</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};