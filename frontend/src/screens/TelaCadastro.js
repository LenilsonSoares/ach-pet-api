import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { CabecalhoArredondado } from '../components/CabecalhoArredondado';
import { logo, cores } from '../utils/constantes';

const inputStyle = {
  backgroundColor: '#F5F5F5',
  borderRadius: 12,
  padding: 12,
  fontSize: 14
};

export const TelaCadastro = ({ userType, onCadastrar, onVoltarLogin, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    birthDate: '',
    phone: '',
    address: '',
    orgName: '',
    cnpj: '',
    responsible: '',
    site: '',
    password: '',
    confirmPassword: ''
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const submit = () => {
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Erro', 'As senhas não conferem.');
      return;
    }

    onCadastrar({
      ...formData,
      name: userType === 'adopter' ? formData.name.trim() : (formData.orgName || formData.name).trim(),
      orgName: formData.orgName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      password: formData.password
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: cores.cinza }}>
      <CabecalhoArredondado height="20%">
        <Image source={logo} style={{ width: 100, height: 100 }} resizeMode="contain" />
      </CabecalhoArredondado>

      <ScrollView style={{ flex: 1, padding: 20 }} showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: cores.preto, marginBottom: 20 }}>
          {userType === 'adopter' ? 'Cadastro de Adotante' : 'Cadastro de Abrigo/ONG'}
        </Text>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: cores.preto, marginBottom: 8 }}>
            {userType === 'adopter' ? 'Nome Completo' : 'Nome da Instituição'}
          </Text>
          <TextInput
            style={inputStyle}
            placeholder={userType === 'adopter' ? 'Seu nome completo' : 'Nome do abrigo/ONG'}
            placeholderTextColor="#999"
            value={userType === 'adopter' ? formData.name : formData.orgName}
            onChangeText={(text) => updateField(userType === 'adopter' ? 'name' : 'orgName', text)}
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: cores.preto, marginBottom: 8 }}>E-mail</Text>
          <TextInput
            style={inputStyle}
            placeholder="seu@email.com"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(text) => updateField('email', text)}
          />
        </View>

        {userType === 'adopter' && (
          <>
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: cores.preto, marginBottom: 8 }}>CPF</Text>
              <TextInput style={inputStyle} placeholder="000.000.000-00" placeholderTextColor="#999" value={formData.cpf} onChangeText={(text) => updateField('cpf', text)} />
            </View>
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: cores.preto, marginBottom: 8 }}>Data de Nascimento</Text>
              <TextInput style={inputStyle} placeholder="DD/MM/AAAA" placeholderTextColor="#999" value={formData.birthDate} onChangeText={(text) => updateField('birthDate', text)} />
            </View>
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: cores.preto, marginBottom: 8 }}>Telefone</Text>
              <TextInput style={inputStyle} placeholder="(77) 99999-9999" placeholderTextColor="#999" keyboardType="phone-pad" value={formData.phone} onChangeText={(text) => updateField('phone', text)} />
            </View>
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: cores.preto, marginBottom: 8 }}>Endereço</Text>
              <TextInput style={inputStyle} placeholder="Rua, número, bairro" placeholderTextColor="#999" value={formData.address} onChangeText={(text) => updateField('address', text)} />
            </View>
          </>
        )}

        {userType === 'shelter' && (
          <>
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: cores.preto, marginBottom: 8 }}>CNPJ</Text>
              <TextInput style={inputStyle} placeholder="00.000.000/0001-00" placeholderTextColor="#999" value={formData.cnpj} onChangeText={(text) => updateField('cnpj', text)} />
            </View>
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: cores.preto, marginBottom: 8 }}>Responsável</Text>
              <TextInput style={inputStyle} placeholder="Nome do responsável" placeholderTextColor="#999" value={formData.responsible} onChangeText={(text) => updateField('responsible', text)} />
            </View>
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: cores.preto, marginBottom: 8 }}>Telefone para Contato</Text>
              <TextInput style={inputStyle} placeholder="(77) 99999-9999" placeholderTextColor="#999" keyboardType="phone-pad" value={formData.phone} onChangeText={(text) => updateField('phone', text)} />
            </View>
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: cores.preto, marginBottom: 8 }}>Endereço da Instituição</Text>
              <TextInput style={inputStyle} placeholder="Rua, número, bairro" placeholderTextColor="#999" value={formData.address} onChangeText={(text) => updateField('address', text)} />
            </View>
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: cores.preto, marginBottom: 8 }}>Site/Redes Sociais</Text>
              <TextInput style={inputStyle} placeholder="www.instagram.com/abrigo" placeholderTextColor="#999" value={formData.site} onChangeText={(text) => updateField('site', text)} />
            </View>
          </>
        )}

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: cores.preto, marginBottom: 8 }}>Senha</Text>
          <TextInput style={inputStyle} placeholder="••••••••" placeholderTextColor="#999" secureTextEntry value={formData.password} onChangeText={(text) => updateField('password', text)} />
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: cores.preto, marginBottom: 8 }}>Confirmar Senha</Text>
          <TextInput style={inputStyle} placeholder="••••••••" placeholderTextColor="#999" secureTextEntry value={formData.confirmPassword} onChangeText={(text) => updateField('confirmPassword', text)} />
        </View>

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
    </View>
  );
};
