import React from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CabecalhoAbrigo } from '../components/CabecalhoAbrigo';

export const TelaAdicionarPet = ({
  isEditing,
  petForm,
  petPhoto,
  onFormChange,
  onPhotoChange,
  onSave,
  onCancel,
  onVoltar
}) => {
  return (
    <View style={{ flex: 1, backgroundColor: '#EDEDED' }}>
      <CabecalhoAbrigo title={isEditing ? "Editar Pet" : "Novo Pet"} onBack={onVoltar} />

      <ScrollView style={{ flex: 1, padding: 20, paddingBottom: 70 }} showsVerticalScrollIndicator={false}>
        <View style={{ marginBottom: 16 }}>
          <View style={{ width: '100%', height: 150, backgroundColor: 'white', borderRadius: 12, marginBottom: 12, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
            {petPhoto ? (
              <Image source={typeof petPhoto === 'string' ? { uri: petPhoto } : petPhoto} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            ) : (
              <Ionicons name="camera-outline" size={48} color="#999" />
            )}
          </View>
          <TouchableOpacity onPress={onPhotoChange} style={{ backgroundColor: '#F4A51C', paddingVertical: 12, borderRadius: 50, alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>Carregar Foto</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 6 }}>Nome do Pet *</Text>
          <TextInput 
            style={{ backgroundColor: 'white', borderRadius: 8, padding: 12, fontSize: 13 }} 
            placeholder="Ex: Rex" 
            value={petForm.nome} 
            onChangeText={(text) => onFormChange('nome', text)} 
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 6 }}>Idade (anos) *</Text>
          <TextInput 
            style={{ backgroundColor: 'white', borderRadius: 8, padding: 12, fontSize: 13 }} 
            placeholder="2" 
            keyboardType="numeric" 
            value={petForm.idade} 
            onChangeText={(text) => onFormChange('idade', text)} 
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 6 }}>Sexo *</Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity onPress={() => onFormChange('sexo', 'Macho')} style={{ flex: 1, backgroundColor: petForm.sexo === 'Macho' ? '#8B2E0F' : 'white', padding: 12, borderRadius: 8, alignItems: 'center' }}>
              <Text style={{ color: petForm.sexo === 'Macho' ? 'white' : '#333', fontWeight: '600' }}>Macho</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onFormChange('sexo', 'Fêmea')} style={{ flex: 1, backgroundColor: petForm.sexo === 'Fêmea' ? '#8B2E0F' : 'white', padding: 12, borderRadius: 8, alignItems: 'center' }}>
              <Text style={{ color: petForm.sexo === 'Fêmea' ? 'white' : '#333', fontWeight: '600' }}>Fêmea</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 6 }}>Porte *</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {['Pequeno', 'Médio', 'Grande'].map(size => (
              <TouchableOpacity 
                key={size} 
                onPress={() => onFormChange('porte', size)} 
                style={{ flex: 1, backgroundColor: petForm.porte === size ? '#8B2E0F' : 'white', padding: 12, borderRadius: 8, alignItems: 'center' }}
              >
                <Text style={{ color: petForm.porte === size ? 'white' : '#333', fontWeight: '600', fontSize: 12 }}>{size}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 6 }}>Descrição *</Text>
          <TextInput 
            style={{ backgroundColor: 'white', borderRadius: 8, padding: 12, fontSize: 13, minHeight: 80, textAlignVertical: 'top' }} 
            placeholder="Descreva o pet..." 
            multiline 
            value={petForm.descricao} 
            onChangeText={(text) => onFormChange('descricao', text)} 
          />
        </View>

        <TouchableOpacity onPress={onSave} style={{ backgroundColor: '#8B2E0F', paddingVertical: 14, borderRadius: 50, alignItems: 'center', marginTop: 10 }}>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Salvar Pet</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onCancel} style={{ paddingVertical: 14, alignItems: 'center' }}>
          <Text style={{ color: '#8B2E0F', fontSize: 14, fontWeight: '600' }}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};