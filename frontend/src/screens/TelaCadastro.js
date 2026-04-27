import React from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { CabecalhoArredondado } from '../components/CabecalhoArredondado';
import { logo, cores } from '../utils/constantes';

export const TelaCadastro = ({ userType, onCadastrar, onVoltarLogin }) => (
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
          style={{ backgroundColor: '#F5F5F5', borderRadius: 12, padding: 12, fontSize: 14 }}
          placeholder={userType === 'adopter' ? 'Seu nome completo' : 'Nome do abrigo/ONG'}
          placeholderTextColor="#999"
        />
      </View>
      
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 13, fontWeight: '600', color: cores.preto, marginBottom: 8 }}>E-mail</Text>
        <TextInput 
          style={{ backgroundColor: '#F5F5F5', borderRadius: 12, padding: 12, fontSize: 14 }}
          placeholder="seu@email.com"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      
      {userType === 'adopter' && (
        <>
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: cores.preto, marginBottom: 8 }}>CPF</Text>
            <TextInput style={{ backgroundColor: '#F5F5F5', borderRadius: 12, padding: 12, fontSize: 14 }} placeholder="000.000.000-00" placeholderTextColor="#999" />
          </View>
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: cores.preto, marginBottom: 8 }}>Data de Nascimento</Text>
            <TextInput style={{ backgroundColor: '#F5F5F5', borderRadius: 12, padding: 12, fontSize: 14 }} placeholder="DD/MM/AAAA" placeholderTextColor="#999" />
          </View>
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: cores.preto, marginBottom: 8 }}>Telefone</Text>
            <TextInput style={{ backgroundColor: '#F5F5F5', borderRadius: 12, padding: 12, fontSize: 14 }} placeholder="(77) 99999-9999" placeholderTextColor="#999" />
          </View>
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: cores.preto, marginBottom: 8 }}>Endereço</Text>
            <TextInput style={{ backgroundColor: '#F5F5F5', borderRadius: 12, padding: 12, fontSize: 14 }} placeholder="Rua, número, bairro" placeholderTextColor="#999" />
          </View>
        </>
      )}
      
      {userType === 'shelter' && (
        <>
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: cores.preto, marginBottom: 8 }}>CNPJ</Text>
            <TextInput style={{ backgroundColor: '#F5F5F5', borderRadius: 12, padding: 12, fontSize: 14 }} placeholder="00.000.000/0001-00" placeholderTextColor="#999" />
          </View>
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: cores.preto, marginBottom: 8 }}>Responsável</Text>
            <TextInput style={{ backgroundColor: '#F5F5F5', borderRadius: 12, padding: 12, fontSize: 14 }} placeholder="Nome do responsável" placeholderTextColor="#999" />
          </View>
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: cores.preto, marginBottom: 8 }}>Telefone para Contato</Text>
            <TextInput style={{ backgroundColor: '#F5F5F5', borderRadius: 12, padding: 12, fontSize: 14 }} placeholder="(77) 99999-9999" placeholderTextColor="#999" />
          </View>
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: cores.preto, marginBottom: 8 }}>Endereço da Instituição</Text>
            <TextInput style={{ backgroundColor: '#F5F5F5', borderRadius: 12, padding: 12, fontSize: 14 }} placeholder="Rua, número, bairro" placeholderTextColor="#999" />
          </View>
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: cores.preto, marginBottom: 8 }}>Site/Redes Sociais</Text>
            <TextInput style={{ backgroundColor: '#F5F5F5', borderRadius: 12, padding: 12, fontSize: 14 }} placeholder="www.instagram.com/abrigo" placeholderTextColor="#999" />
          </View>
        </>
      )}
      
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 13, fontWeight: '600', color: cores.preto, marginBottom: 8 }}>Senha</Text>
        <TextInput style={{ backgroundColor: '#F5F5F5', borderRadius: 12, padding: 12, fontSize: 14 }} placeholder="••••••••" placeholderTextColor="#999" secureTextEntry />
      </View>
      
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 13, fontWeight: '600', color: cores.preto, marginBottom: 8 }}>Confirmar Senha</Text>
        <TextInput style={{ backgroundColor: '#F5F5F5', borderRadius: 12, padding: 12, fontSize: 14 }} placeholder="••••••••" placeholderTextColor="#999" secureTextEntry />
      </View>
      
      <TouchableOpacity 
        style={{ backgroundColor: cores.marrom, paddingVertical: 14, borderRadius: 50, shadowColor: cores.marrom, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 5, marginTop: 10 }}
        onPress={onCadastrar}
      >
        <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', textAlign: 'center' }}>Cadastrar</Text>
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