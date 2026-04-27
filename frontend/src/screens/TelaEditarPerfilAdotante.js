import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CabecalhoAbrigo } from '../components/CabecalhoAbrigo';
import { logo } from '../utils/constantes';

export const TelaEditarPerfilAdotante = ({ currentUser, onSave, onVoltar }) => {
  const [formData, setFormData] = useState({
    name: currentUser?.name || 'João Silva',
    email: currentUser?.email || 'joao@email.com',
    phone: currentUser?.phone || '(77) 99999-8888',
    cpf: currentUser?.cpf || '123.456.789-00',
    birthDate: currentUser?.birthDate || '10/05/1990',
    address: currentUser?.address || 'Rua das Flores, 123 - Centro',
    city: 'Vitória da Conquista',
    state: 'BA',
    cep: '45000-000'
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Erro', 'Nome é obrigatório');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      Alert.alert('Erro', 'E-mail inválido');
      return false;
    }
    if (!formData.phone.trim()) {
      Alert.alert('Erro', 'Telefone é obrigatório');
      return false;
    }
    if (!formData.cpf.trim()) {
      Alert.alert('Erro', 'CPF é obrigatório');
      return false;
    }
    if (!formData.birthDate.trim()) {
      Alert.alert('Erro', 'Data de nascimento é obrigatória');
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (validateForm()) {
      setIsLoading(true);
      
      // Simula um delay de salvamento
      setTimeout(() => {
        setIsLoading(false);
        onSave(formData);
        Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      }, 1000);
    }
  };

  const formatPhone = (text) => {
    let cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 10) {
      cleaned = cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
      cleaned = cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return cleaned;
  };

  const formatCPF = (text) => {
    let cleaned = text.replace(/\D/g, '');
    cleaned = cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    return cleaned;
  };

  const formatDate = (text) => {
    let cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 8) {
      cleaned = cleaned.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
    }
    return cleaned;
  };

  const formatCEP = (text) => {
    let cleaned = text.replace(/\D/g, '');
    cleaned = cleaned.replace(/(\d{5})(\d{3})/, '$1-$2');
    return cleaned;
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: '#EDEDED' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <CabecalhoAbrigo title="Editar Perfil" onBack={onVoltar} />

      <ScrollView style={{ flex: 1, padding: 20 }} showsVerticalScrollIndicator={false}>
        {/* Foto do perfil */}
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
          <View style={{ position: 'relative' }}>
            <View style={{ 
              width: 120, 
              height: 120, 
              borderRadius: 60, 
              backgroundColor: '#F4A51C', 
              justifyContent: 'center', 
              alignItems: 'center',
              marginBottom: 16,
              borderWidth: 3,
              borderColor: '#FFF'
            }}>
              <Ionicons name="person" size={70} color="white" />
            </View>
            <TouchableOpacity 
              style={{ 
                position: 'absolute',
                bottom: 16,
                right: 0,
                backgroundColor: '#8B2E0F',
                width: 40,
                height: 40,
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 2,
                borderColor: 'white'
              }}
              onPress={() => Alert.alert('Função', 'Alterar foto será implementado em breve!')}
            >
              <Ionicons name="camera" size={20} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#1E1E1E' }}>
            {formData.name}
          </Text>
          <Text style={{ fontSize: 14, color: '#666' }}>
            Clique no ícone da câmera para alterar a foto
          </Text>
        </View>

        {/* Formulário de edição */}
        <View style={{ 
          backgroundColor: 'white', 
          borderRadius: 12, 
          padding: 20, 
          marginBottom: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 3
        }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#1E1E1E', marginBottom: 20 }}>
            Informações Pessoais
          </Text>

          {/* Nome completo */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 6 }}>
              Nome Completo *
            </Text>
            <TextInput
              style={{
                backgroundColor: '#F5F5F5',
                borderRadius: 8,
                padding: 12,
                fontSize: 14,
                borderWidth: 1,
                borderColor: '#E0E0E0'
              }}
              value={formData.name}
              onChangeText={(text) => handleInputChange('name', text)}
              placeholder="Digite seu nome completo"
            />
          </View>

          {/* E-mail */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 6 }}>
              E-mail *
            </Text>
            <TextInput
              style={{
                backgroundColor: '#F5F5F5',
                borderRadius: 8,
                padding: 12,
                fontSize: 14,
                borderWidth: 1,
                borderColor: '#E0E0E0'
              }}
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              placeholder="seu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Telefone */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 6 }}>
              Telefone *
            </Text>
            <TextInput
              style={{
                backgroundColor: '#F5F5F5',
                borderRadius: 8,
                padding: 12,
                fontSize: 14,
                borderWidth: 1,
                borderColor: '#E0E0E0'
              }}
              value={formData.phone}
              onChangeText={(text) => handleInputChange('phone', formatPhone(text))}
              placeholder="(77) 99999-9999"
              keyboardType="phone-pad"
              maxLength={15}
            />
          </View>

          {/* CPF */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 6 }}>
              CPF *
            </Text>
            <TextInput
              style={{
                backgroundColor: '#F5F5F5',
                borderRadius: 8,
                padding: 12,
                fontSize: 14,
                borderWidth: 1,
                borderColor: '#E0E0E0'
              }}
              value={formData.cpf}
              onChangeText={(text) => handleInputChange('cpf', formatCPF(text))}
              placeholder="000.000.000-00"
              keyboardType="numeric"
              maxLength={14}
            />
          </View>

          {/* Data de Nascimento */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 6 }}>
              Data de Nascimento *
            </Text>
            <TextInput
              style={{
                backgroundColor: '#F5F5F5',
                borderRadius: 8,
                padding: 12,
                fontSize: 14,
                borderWidth: 1,
                borderColor: '#E0E0E0'
              }}
              value={formData.birthDate}
              onChangeText={(text) => handleInputChange('birthDate', formatDate(text))}
              placeholder="DD/MM/AAAA"
              keyboardType="numeric"
              maxLength={10}
            />
          </View>

          <Text style={{ fontSize: 16, fontWeight: '700', color: '#1E1E1E', marginTop: 10, marginBottom: 20 }}>
            Endereço
          </Text>

          {/* Endereço */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 6 }}>
              Endereço *
            </Text>
            <TextInput
              style={{
                backgroundColor: '#F5F5F5',
                borderRadius: 8,
                padding: 12,
                fontSize: 14,
                borderWidth: 1,
                borderColor: '#E0E0E0'
              }}
              value={formData.address}
              onChangeText={(text) => handleInputChange('address', text)}
              placeholder="Rua, número, complemento"
            />
          </View>

          {/* Cidade e Estado em linha */}
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
            <View style={{ flex: 2 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 6 }}>
                Cidade
              </Text>
              <TextInput
                style={{
                  backgroundColor: '#F5F5F5',
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 14,
                  borderWidth: 1,
                  borderColor: '#E0E0E0'
                }}
                value={formData.city}
                onChangeText={(text) => handleInputChange('city', text)}
                placeholder="Cidade"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 6 }}>
                UF
              </Text>
              <TextInput
                style={{
                  backgroundColor: '#F5F5F5',
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 14,
                  borderWidth: 1,
                  borderColor: '#E0E0E0'
                }}
                value={formData.state}
                onChangeText={(text) => handleInputChange('state', text.toUpperCase())}
                placeholder="BA"
                maxLength={2}
              />
            </View>
          </View>

          {/* CEP */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 6 }}>
              CEP
            </Text>
            <TextInput
              style={{
                backgroundColor: '#F5F5F5',
                borderRadius: 8,
                padding: 12,
                fontSize: 14,
                borderWidth: 1,
                borderColor: '#E0E0E0'
              }}
              value={formData.cep}
              onChangeText={(text) => handleInputChange('cep', formatCEP(text))}
              placeholder="00000-000"
              keyboardType="numeric"
              maxLength={9}
            />
          </View>
        </View>

        {/* Botões de ação */}
        <View style={{ gap: 12, marginBottom: 30 }}>
          <TouchableOpacity
            onPress={handleSave}
            disabled={isLoading}
            style={{
              backgroundColor: isLoading ? '#999' : '#8B2E0F',
              paddingVertical: 14,
              borderRadius: 50,
              alignItems: 'center',
              shadowColor: '#8B2E0F',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isLoading ? 0 : 0.3,
              shadowRadius: 8,
              elevation: isLoading ? 0 : 5
            }}
          >
            {isLoading ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="refresh-outline" size={20} color="white" />
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', marginLeft: 8 }}>
                  Salvando...
                </Text>
              </View>
            ) : (
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                Salvar Alterações
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onVoltar}
            style={{
              backgroundColor: '#F5F5F5',
              paddingVertical: 14,
              borderRadius: 50,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#DDD'
            }}
          >
            <Text style={{ color: '#666', fontSize: 16, fontWeight: '600' }}>
              Cancelar
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};