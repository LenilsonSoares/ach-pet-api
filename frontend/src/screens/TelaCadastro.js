import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CabecalhoArredondado } from '../components/CabecalhoArredondado';
import { logo, cores } from '../utils/constantes';
import { buscarEnderecoPorCep } from '../services/cep';
import { solicitarLocalizacaoAtual } from '../services/localizacao';
import {
  buildAddressLine,
  formatCEP,
  formatCNPJ,
  formatCPF,
  formatDate,
  formatPhone,
  isValidCNPJ,
  isValidCPF,
  onlyDigits
} from '../utils/documentos';

const inputStyle = {
  backgroundColor: '#F5F5F5',
  borderRadius: 12,
  padding: 12,
  fontSize: 14,
  color: '#1E1E1E'
};

const labelStyle = {
  fontSize: 13,
  fontWeight: '600',
  color: '#1E1E1E',
  marginBottom: 8
};

const Field = ({ label, children }) => (
  <View style={{ marginBottom: 16 }}>
    <Text style={labelStyle}>{label}</Text>
    {children}
  </View>
);

export const TelaCadastro = ({ userType, onCadastrar, onVoltarLogin, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    birthDate: '',
    phone: '',
    address: '',
    cep: '',
    street: '',
    addressNumber: '',
    addressComplement: '',
    neighborhood: '',
    city: '',
    state: '',
    latitude: null,
    longitude: null,
    orgName: '',
    cnpj: '',
    responsible: '',
    site: '',
    password: '',
    confirmPassword: ''
  });
  const [cepState, setCepState] = useState({ loading: false, message: '', error: '' });
  const [isLocating, setIsLocating] = useState(false);

  const updateField = (field, value) => {
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
        setCepState({ loading: false, message: 'Endereço preenchido pelo CEP.', error: '' });
      })
      .catch((error) => {
        if (!isActive) return;
        setCepState({ loading: false, message: '', error: error.message });
      });

    return () => {
      isActive = false;
    };
  }, [formData.cep]);

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
      Alert.alert('Localização salva', 'A posição aproximada foi adicionada ao cadastro.');
    } catch (error) {
      Alert.alert('Localização', error.message);
    } finally {
      setIsLocating(false);
    }
  };

  const submit = () => {
    const isAdopter = userType === 'adopter';
    const address = buildAddressLine(formData);
    const hasFullAddress =
      formData.street.trim() &&
      formData.addressNumber.trim() &&
      formData.neighborhood.trim() &&
      formData.city.trim() &&
      formData.state.trim().length === 2;

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Erro', 'As senhas não conferem.');
      return;
    }

    if (isAdopter && !isValidCPF(formData.cpf)) {
      Alert.alert('CPF inválido', 'Confira o CPF digitado. A validação é feita localmente pelo dígito verificador.');
      return;
    }

    if (!isAdopter && !isValidCNPJ(formData.cnpj)) {
      Alert.alert('CNPJ inválido', 'Confira o CNPJ do abrigo antes de continuar.');
      return;
    }

    if (onlyDigits(formData.cep).length !== 8) {
      Alert.alert('CEP obrigatório', 'Informe um CEP válido para preencher o endereço.');
      return;
    }

    if (!hasFullAddress || address.length < 8) {
      Alert.alert('Endereço obrigatório', 'Informe rua, número, bairro, cidade e UF.');
      return;
    }

    onCadastrar({
      ...formData,
      name: isAdopter ? formData.name.trim() : (formData.orgName || formData.name).trim(),
      orgName: formData.orgName.trim(),
      email: formData.email.trim(),
      phone: onlyDigits(formData.phone),
      address
    });
  };

  const renderAddressFields = () => (
    <>
      <Field label="CEP">
        <View style={{ position: 'relative' }}>
          <TextInput
            style={[inputStyle, { paddingRight: 40 }]}
            placeholder="00000-000"
            placeholderTextColor="#999"
            keyboardType="numeric"
            maxLength={9}
            value={formData.cep}
            onChangeText={(text) => updateField('cep', formatCEP(text))}
          />
          {cepState.loading && (
            <ActivityIndicator
              size="small"
              color={cores.marrom}
              style={{ position: 'absolute', right: 12, top: 13 }}
            />
          )}
        </View>
        {!!cepState.message && <Text style={{ fontSize: 12, color: '#2E7D32', marginTop: 6 }}>{cepState.message}</Text>}
        {!!cepState.error && <Text style={{ fontSize: 12, color: '#C62828', marginTop: 6 }}>{cepState.error}</Text>}
      </Field>

      <Field label="Rua">
        <TextInput
          style={inputStyle}
          placeholder="Rua/Avenida"
          placeholderTextColor="#999"
          value={formData.street}
          onChangeText={(text) => updateField('street', text)}
        />
      </Field>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Field label="Número">
            <TextInput
              style={inputStyle}
              placeholder="123"
              placeholderTextColor="#999"
              value={formData.addressNumber}
              onChangeText={(text) => updateField('addressNumber', text)}
            />
          </Field>
        </View>
        <View style={{ flex: 2 }}>
          <Field label="Complemento">
            <TextInput
              style={inputStyle}
              placeholder="Apto, casa, referência"
              placeholderTextColor="#999"
              value={formData.addressComplement}
              onChangeText={(text) => updateField('addressComplement', text)}
            />
          </Field>
        </View>
      </View>

      <Field label="Bairro">
        <TextInput
          style={inputStyle}
          placeholder="Bairro"
          placeholderTextColor="#999"
          value={formData.neighborhood}
          onChangeText={(text) => updateField('neighborhood', text)}
        />
      </Field>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 2 }}>
          <Field label="Cidade">
            <TextInput
              style={inputStyle}
              placeholder="Cidade"
              placeholderTextColor="#999"
              value={formData.city}
              onChangeText={(text) => updateField('city', text)}
            />
          </Field>
        </View>
        <View style={{ flex: 1 }}>
          <Field label="UF">
            <TextInput
              style={inputStyle}
              placeholder="BA"
              placeholderTextColor="#999"
              maxLength={2}
              autoCapitalize="characters"
              value={formData.state}
              onChangeText={(text) => updateField('state', text.toUpperCase())}
            />
          </Field>
        </View>
      </View>

      <TouchableOpacity
        onPress={handleUseCurrentLocation}
        disabled={isLocating}
        style={{
          backgroundColor: 'white',
          borderWidth: 1,
          borderColor: '#DDD',
          paddingVertical: 12,
          borderRadius: 12,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 8,
          marginBottom: 16,
          opacity: isLocating ? 0.65 : 1
        }}
      >
        <Ionicons name="navigate-outline" size={18} color={cores.marrom} />
        <Text style={{ color: cores.marrom, fontSize: 13, fontWeight: '700' }}>
          {isLocating ? 'Obtendo localização...' : 'Usar localização atual'}
        </Text>
      </TouchableOpacity>
    </>
  );

  return (
    <View style={{ flex: 1, backgroundColor: cores.cinza }}>
      <CabecalhoArredondado height="20%">
        <Image source={logo} style={{ width: 100, height: 100 }} resizeMode="contain" />
      </CabecalhoArredondado>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          <Text style={{ fontSize: 18, fontWeight: '700', color: cores.preto, marginBottom: 20 }}>
            {userType === 'adopter' ? 'Cadastro de Adotante' : 'Cadastro de Abrigo/ONG'}
          </Text>

          <Field label={userType === 'adopter' ? 'Nome Completo' : 'Nome da Instituição'}>
            <TextInput
              style={inputStyle}
              placeholder={userType === 'adopter' ? 'Seu nome completo' : 'Nome do abrigo/ONG'}
              placeholderTextColor="#999"
              value={userType === 'adopter' ? formData.name : formData.orgName}
              onChangeText={(text) => updateField(userType === 'adopter' ? 'name' : 'orgName', text)}
            />
          </Field>

          <Field label="E-mail">
            <TextInput
              style={inputStyle}
              placeholder="seu@email.com"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => updateField('email', text)}
            />
          </Field>

          {userType === 'adopter' && (
            <>
              <Field label="CPF">
                <TextInput
                  style={inputStyle}
                  placeholder="000.000.000-00"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  maxLength={14}
                  value={formData.cpf}
                  onChangeText={(text) => updateField('cpf', formatCPF(text))}
                />
              </Field>
              <Field label="Data de Nascimento">
                <TextInput
                  style={inputStyle}
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  maxLength={10}
                  value={formData.birthDate}
                  onChangeText={(text) => updateField('birthDate', formatDate(text))}
                />
              </Field>
            </>
          )}

          {userType === 'shelter' && (
            <>
              <Field label="CNPJ">
                <TextInput
                  style={inputStyle}
                  placeholder="00.000.000/0001-00"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  maxLength={18}
                  value={formData.cnpj}
                  onChangeText={(text) => updateField('cnpj', formatCNPJ(text))}
                />
              </Field>
              <Field label="Responsável">
                <TextInput
                  style={inputStyle}
                  placeholder="Nome do responsável"
                  placeholderTextColor="#999"
                  value={formData.responsible}
                  onChangeText={(text) => updateField('responsible', text)}
                />
              </Field>
            </>
          )}

          <Field label={userType === 'shelter' ? 'Telefone para Contato' : 'Telefone'}>
            <TextInput
              style={inputStyle}
              placeholder="(77) 99999-9999"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              maxLength={15}
              value={formData.phone}
              onChangeText={(text) => updateField('phone', formatPhone(text))}
            />
          </Field>

          <Text style={{ fontSize: 15, fontWeight: '700', color: cores.preto, marginBottom: 14 }}>
            Endereço
          </Text>
          {renderAddressFields()}

          {userType === 'shelter' && (
            <Field label="Site/Redes Sociais">
              <TextInput
                style={inputStyle}
                placeholder="www.instagram.com/abrigo"
                placeholderTextColor="#999"
                autoCapitalize="none"
                value={formData.site}
                onChangeText={(text) => updateField('site', text)}
              />
            </Field>
          )}

          <Field label="Senha">
            <TextInput
              style={inputStyle}
              placeholder="••••••••"
              placeholderTextColor="#999"
              secureTextEntry
              value={formData.password}
              onChangeText={(text) => updateField('password', text)}
            />
          </Field>

          <Field label="Confirmar Senha">
            <TextInput
              style={inputStyle}
              placeholder="••••••••"
              placeholderTextColor="#999"
              secureTextEntry
              value={formData.confirmPassword}
              onChangeText={(text) => updateField('confirmPassword', text)}
            />
          </Field>

          <TouchableOpacity
            style={{ backgroundColor: isLoading ? '#A97863' : cores.marrom, paddingVertical: 14, borderRadius: 50, shadowColor: cores.marrom, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 5, marginTop: 10 }}
            onPress={submit}
            disabled={isLoading}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', textAlign: 'center' }}>
              {isLoading ? 'Cadastrando...' : 'Cadastrar'}
            </Text>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16, marginBottom: 30 }}>
            <Text style={{ fontSize: 13, color: '#555' }}>Já tem conta? </Text>
            <TouchableOpacity onPress={onVoltarLogin}>
              <Text style={{ fontSize: 13, color: cores.marrom, fontWeight: '600' }}>Faça login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};
