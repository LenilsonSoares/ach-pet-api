import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CabecalhoArredondado } from '../components/CabecalhoArredondado';
import { logo, cores } from '../utils/constantes';

export const TelaLogin = ({ onLogin, onRegistrar, isLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={{ flex: 1, backgroundColor: cores.cinza }}>
      <CabecalhoArredondado height="20%">
        <Image source={logo} style={{ width: 100, height: 100 }} resizeMode="contain" />
      </CabecalhoArredondado>

      <ScrollView style={{ flex: 1, padding: 20 }} showsVerticalScrollIndicator={false}>
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: cores.preto, marginBottom: 8 }}>E-mail</Text>
          <TextInput
            style={{ backgroundColor: '#F5F5F5', borderRadius: 12, padding: 12, fontSize: 14 }}
            placeholder="seu@email.com"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: cores.preto, marginBottom: 8 }}>Senha</Text>
          <TextInput
            style={{ backgroundColor: '#F5F5F5', borderRadius: 12, padding: 12, fontSize: 14 }}
            placeholder="••••••••"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity
          style={{ backgroundColor: isLoading ? '#A97863' : cores.marrom, paddingVertical: 14, borderRadius: 50, shadowColor: cores.marrom, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 5, marginTop: 10 }}
          onPress={() => onLogin({ email: email.trim(), password })}
          disabled={isLoading}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', textAlign: 'center' }}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: '#DDD' }} />
          <Text style={{ paddingHorizontal: 10, fontSize: 12, color: '#999' }}>ou</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: '#DDD' }} />
        </View>

        <TouchableOpacity style={{ backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#DDD', marginBottom: 10 }}>
          <Ionicons name="logo-facebook" size={20} color="#1877F2" />
          <Text style={{ marginLeft: 8, fontSize: 14, fontWeight: '600', color: cores.preto }}>Continuar com Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#DDD' }}>
          <Ionicons name="logo-google" size={20} color="#DB4437" />
          <Text style={{ marginLeft: 8, fontSize: 14, fontWeight: '600', color: cores.preto }}>Continuar com Google</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16 }}>
          <Text style={{ fontSize: 13, color: '#555' }}>Não tem conta? </Text>
          <TouchableOpacity onPress={onRegistrar}>
            <Text style={{ fontSize: 13, color: cores.marrom, fontWeight: '600' }}>Cadastre-se</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
