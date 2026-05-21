import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CabecalhoAbrigo } from '../components/CabecalhoAbrigo';
import { buscarEnderecoPorCep } from '../services/cep';
import { solicitarLocalizacaoAtual } from '../services/localizacao';
import {
  buildAddressLine,
  formatCEP,
  formatCPF,
  formatDate,
  formatPhone,
  isValidCPF,
  onlyDigits
} from '../utils/documentos';

const inputStyle = {
  backgroundColor: '#F5F5F5',
  borderRadius: 8,
  padding: 12,
  fontSize: 14,
  color: '#1E1E1E',
  borderWidth: 1,
  borderColor: '#E0E0E0'
};

const Field = ({ label, children }) => (
  <View style={{ marginBottom: 16 }}>
    <Text style={{ fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 6 }}>{label}</Text>
    {children}
  </View>
);

export const TelaEditarPerfilAdotante = ({ currentUser, onSave, onVoltar }) => {
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: formatPhone(currentUser?.phone || ''),
    cpf: formatCPF(currentUser?.cpf || ''),
    birthDate: currentUser?.birthDate || '',
    address: currentUser?.address || '',
    cep: formatCEP(currentUser?.cep || ''),
    street: currentUser?.street || '',
    addressNumber: currentUser?.addressNumber || '',
    addressComplement: currentUser?.addressComplement || '',
    neighborhood: currentUser?.neighborhood || '',
    city: currentUser?.city || '',
    state: currentUser?.state || '',
    latitude: currentUser?.latitude ?? null,
    longitude: currentUser?.longitude ?? null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [cepState, setCepState] = useState({ loading: false, message: '', error: '' });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const cepDigits = onlyDigits(formData.cep);
    if (cepDigits.length !== 8) {
      setCepState({ loading: false, message: '', error: '' });
      return undefined;
    }

    let isActive = true;
    setCepState({ loading: true, message: 'Buscando CEP...', error: '' });

    buscarEnderecoPorCep(cepDigits)
      .then((address) => {
        if (!isActive) return;
        setFormData(prev => ({
          ...prev,
          cep: formatCEP(address.cep),
          street: address.street,
          neighborhood: address.neighborhood,
          city: address.city,
          state: address.state
        }));
        setCepState({ loading: false, message: 'Endereço atualizado pelo CEP.', error: '' });
      })
      .catch((error) => {
        if (!isActive) return;
        setCepState({ loading: false, message: '', error: error.message });
      });

    return () => {
      isActive = false;
    };
  }, [formData.cep]);

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
    if (!isValidCPF(formData.cpf)) {
      Alert.alert('CPF inválido', 'Confira o CPF digitado.');
      return false;
    }
    if (!formData.birthDate.trim()) {
      Alert.alert('Erro', 'Data de nascimento é obrigatória');
      return false;
    }
    if (onlyDigits(formData.cep).length !== 8) {
      Alert.alert('CEP inválido', 'Informe um CEP com 8 dígitos.');
      return false;
    }
    const hasFullAddress =
      formData.street.trim() &&
      formData.addressNumber.trim() &&
      formData.neighborhood.trim() &&
      formData.city.trim() &&
      formData.state.trim().length === 2;

    if (!hasFullAddress || buildAddressLine(formData).length < 8) {
      Alert.alert('Endereço obrigatório', 'Informe rua, número, bairro, cidade e UF.');
      return false;
    }
    return true;
  };

  const handleUseCurrentLocation = async () => {
    try {
      setIsLocating(true);
      const location = await solicitarLocalizacaoAtual();
      if (!location) {
        Alert.alert('Localização', 'Localização automática não está disponível no navegador.');
        return;
      }

      setFormData(prev => ({
        ...prev,
        latitude: location.latitude,
        longitude: location.longitude
      }));
      Alert.alert('Localização salva', 'A posição aproximada foi adicionada ao perfil.');
    } catch (error) {
      Alert.alert('Localização', error.message);
    } finally {
      setIsLocating(false);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      await onSave({
        ...formData,
        phone: onlyDigits(formData.phone),
        address: buildAddressLine(formData)
      });
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch {
      // A tela principal já mostra a mensagem detalhada da API.
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#EDEDED' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <CabecalhoAbrigo title="Editar Perfil" onBack={onVoltar} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }}>
          <View style={{ width: 110, height: 110, borderRadius: 55, backgroundColor: '#F4A51C', justifyContent: 'center', alignItems: 'center', marginBottom: 14, borderWidth: 3, borderColor: '#FFF' }}>
            <Ionicons name="person" size={64} color="white" />
          </View>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#1E1E1E' }}>{formData.name || 'Meu perfil'}</Text>
          <Text style={{ fontSize: 13, color: '#666', marginTop: 4 }}>
            {[formData.city, formData.state].filter(Boolean).join(', ') || 'Localização não informada'}
          </Text>
        </View>

        <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#1E1E1E', marginBottom: 20 }}>Informações Pessoais</Text>

          <Field label="Nome Completo *">
            <TextInput style={inputStyle} value={formData.name} onChangeText={(text) => handleInputChange('name', text)} placeholder="Digite seu nome completo" />
          </Field>

          <Field label="E-mail *">
            <TextInput style={inputStyle} value={formData.email} onChangeText={(text) => handleInputChange('email', text)} placeholder="seu@email.com" keyboardType="email-address" autoCapitalize="none" />
          </Field>

          <Field label="Telefone *">
            <TextInput style={inputStyle} value={formData.phone} onChangeText={(text) => handleInputChange('phone', formatPhone(text))} placeholder="(77) 99999-9999" keyboardType="phone-pad" maxLength={15} />
          </Field>

          <Field label="CPF *">
            <TextInput style={inputStyle} value={formData.cpf} onChangeText={(text) => handleInputChange('cpf', formatCPF(text))} placeholder="000.000.000-00" keyboardType="numeric" maxLength={14} />
          </Field>

          <Field label="Data de Nascimento *">
            <TextInput style={inputStyle} value={formData.birthDate} onChangeText={(text) => handleInputChange('birthDate', formatDate(text))} placeholder="DD/MM/AAAA" keyboardType="numeric" maxLength={10} />
          </Field>

          <Text style={{ fontSize: 16, fontWeight: '700', color: '#1E1E1E', marginTop: 10, marginBottom: 20 }}>Endereço</Text>

          <Field label="CEP *">
            <View style={{ position: 'relative' }}>
              <TextInput
                style={[inputStyle, { paddingRight: 40 }]}
                value={formData.cep}
                onChangeText={(text) => handleInputChange('cep', formatCEP(text))}
                placeholder="00000-000"
                keyboardType="numeric"
                maxLength={9}
              />
              {cepState.loading && <ActivityIndicator size="small" color="#8B2E0F" style={{ position: 'absolute', right: 12, top: 13 }} />}
            </View>
            {!!cepState.message && <Text style={{ fontSize: 12, color: '#2E7D32', marginTop: 6 }}>{cepState.message}</Text>}
            {!!cepState.error && <Text style={{ fontSize: 12, color: '#C62828', marginTop: 6 }}>{cepState.error}</Text>}
          </Field>

          <Field label="Rua *">
            <TextInput style={inputStyle} value={formData.street} onChangeText={(text) => handleInputChange('street', text)} placeholder="Rua/Avenida" />
          </Field>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Field label="Número *">
                <TextInput style={inputStyle} value={formData.addressNumber} onChangeText={(text) => handleInputChange('addressNumber', text)} placeholder="123" />
              </Field>
            </View>
            <View style={{ flex: 2 }}>
              <Field label="Complemento">
                <TextInput style={inputStyle} value={formData.addressComplement} onChangeText={(text) => handleInputChange('addressComplement', text)} placeholder="Apto, casa" />
              </Field>
            </View>
          </View>

          <Field label="Bairro *">
            <TextInput style={inputStyle} value={formData.neighborhood} onChangeText={(text) => handleInputChange('neighborhood', text)} placeholder="Bairro" />
          </Field>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 2 }}>
              <Field label="Cidade *">
                <TextInput style={inputStyle} value={formData.city} onChangeText={(text) => handleInputChange('city', text)} placeholder="Cidade" />
              </Field>
            </View>
            <View style={{ flex: 1 }}>
              <Field label="UF *">
                <TextInput style={inputStyle} value={formData.state} onChangeText={(text) => handleInputChange('state', text.toUpperCase())} placeholder="BA" maxLength={2} autoCapitalize="characters" />
              </Field>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleUseCurrentLocation}
            disabled={isLocating}
            style={{ backgroundColor: '#FFF8EC', paddingVertical: 12, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, opacity: isLocating ? 0.65 : 1 }}
          >
            <Ionicons name="navigate-outline" size={18} color="#8B2E0F" />
            <Text style={{ color: '#8B2E0F', fontSize: 13, fontWeight: '700' }}>
              {isLocating ? 'Obtendo localização...' : 'Atualizar localização aproximada'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ gap: 12, marginBottom: 30 }}>
          <TouchableOpacity
            onPress={handleSave}
            disabled={isLoading}
            style={{ backgroundColor: isLoading ? '#999' : '#8B2E0F', paddingVertical: 14, borderRadius: 50, alignItems: 'center', shadowColor: '#8B2E0F', shadowOffset: { width: 0, height: 4 }, shadowOpacity: isLoading ? 0 : 0.3, shadowRadius: 8, elevation: isLoading ? 0 : 5 }}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onVoltar} style={{ backgroundColor: '#F5F5F5', paddingVertical: 14, borderRadius: 50, alignItems: 'center', borderWidth: 1, borderColor: '#DDD' }}>
            <Text style={{ color: '#666', fontSize: 16, fontWeight: '600' }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
