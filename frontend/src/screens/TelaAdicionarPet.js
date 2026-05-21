import React from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CabecalhoAbrigo } from '../components/CabecalhoAbrigo';

const inputStyle = {
  backgroundColor: 'white',
  borderRadius: 8,
  padding: 12,
  fontSize: 13,
  color: '#1E1E1E'
};

export const TelaAdicionarPet = ({
  isEditing,
  petForm,
  petPhoto,
  onFormChange,
  onPhotoChange,
  onSave,
  isSaving = false,
  onCancel,
  onVoltar
}) => {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#EDEDED' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <CabecalhoAbrigo title={isEditing ? "Editar Pet" : "Novo Pet"} onBack={onVoltar} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 48 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginBottom: 16 }}>
          <View style={{ width: '100%', height: 150, backgroundColor: 'white', borderRadius: 12, marginBottom: 12, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
            {petPhoto ? (
              <Image source={typeof petPhoto === 'string' ? { uri: petPhoto } : petPhoto} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            ) : (
              <Ionicons name="camera-outline" size={48} color="#999" />
            )}
          </View>
          <TouchableOpacity
            onPress={onPhotoChange}
            disabled={isSaving}
            style={{ backgroundColor: '#F4A51C', paddingVertical: 12, borderRadius: 50, alignItems: 'center', marginBottom: 12, opacity: isSaving ? 0.65 : 1 }}
          >
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>{petPhoto ? 'Trocar Foto' : 'Carregar Foto'}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 6 }}>Nome do Pet *</Text>
          <TextInput 
            style={inputStyle} 
            placeholder="Ex: Rex" 
            placeholderTextColor="#999"
            value={petForm.nome} 
            onChangeText={(text) => onFormChange('nome', text)} 
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 6 }}>Idade (anos) *</Text>
          <TextInput 
            style={inputStyle} 
            placeholder="2" 
            placeholderTextColor="#999"
            keyboardType="numeric" 
            value={petForm.idade} 
            onChangeText={(text) => onFormChange('idade', text)} 
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 6 }}>Tipo *</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[
              { label: 'Cão', value: 'dogs' },
              { label: 'Gato', value: 'cats' },
              { label: 'Outro', value: 'others' }
            ].map(item => (
              <TouchableOpacity
                key={item.value}
                onPress={() => onFormChange('tipo', item.value)}
                style={{ flex: 1, backgroundColor: petForm.tipo === item.value ? '#8B2E0F' : 'white', padding: 12, borderRadius: 8, alignItems: 'center' }}
              >
                <Text style={{ color: petForm.tipo === item.value ? 'white' : '#333', fontWeight: '600', fontSize: 12 }}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
            style={[inputStyle, { minHeight: 80, textAlignVertical: 'top' }]} 
            placeholder="Descreva o pet..." 
            placeholderTextColor="#999"
            multiline 
            value={petForm.descricao} 
            onChangeText={(text) => onFormChange('descricao', text)} 
          />
        </View>

        <TouchableOpacity
          onPress={onSave}
          disabled={isSaving}
          style={{ backgroundColor: '#8B2E0F', paddingVertical: 14, borderRadius: 50, alignItems: 'center', marginTop: 10, opacity: isSaving ? 0.75 : 1 }}
        >
          {isSaving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Salvar Pet</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={onCancel} disabled={isSaving} style={{ paddingVertical: 14, alignItems: 'center', opacity: isSaving ? 0.65 : 1 }}>
          <Text style={{ color: '#8B2E0F', fontSize: 14, fontWeight: '600' }}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
