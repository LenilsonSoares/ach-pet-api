import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cores } from '../utils/constantes';

const emptyForm = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
};

export const ModalAlterarSenha = ({ visible, onClose, onSubmit, isLoading }) => {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!visible) {
      setForm(emptyForm);
      setError('');
    }
  }, [visible]);

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleSubmit = async () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setError('Preencha todos os campos.');
      return;
    }

    if (form.newPassword.length < 6) {
      setError('A nova senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError('A confirmacao precisa ser igual a nova senha.');
      return;
    }

    if (form.currentPassword === form.newPassword) {
      setError('A nova senha precisa ser diferente da atual.');
      return;
    }

    try {
      await onSubmit(form);
    } catch (submitError) {
      setError(submitError.message || 'Nao foi possivel alterar a senha.');
    }
  };

  const inputStyle = {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: cores.preto,
    backgroundColor: cores.branco
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{
          flex: 1,
          justifyContent: 'center',
          padding: 20,
          backgroundColor: 'rgba(0,0,0,0.35)'
        }}
      >
        <View
          style={{
            backgroundColor: cores.branco,
            borderRadius: 12,
            padding: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.18,
            shadowRadius: 12,
            elevation: 8
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18 }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: '#FFF3E0',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12
              }}
            >
              <Ionicons name="lock-closed-outline" size={22} color={cores.marrom} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: cores.preto }}>
                Alterar senha
              </Text>
              <Text style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
                Informe a senha atual e defina uma nova.
              </Text>
            </View>
            <TouchableOpacity
              disabled={isLoading}
              onPress={onClose}
              style={{
                width: 34,
                height: 34,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Ionicons name="close" size={22} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#666', marginBottom: 6 }}>
              Senha atual
            </Text>
            <TextInput
              value={form.currentPassword}
              onChangeText={(value) => updateField('currentPassword', value)}
              secureTextEntry
              autoCapitalize="none"
              placeholder="Digite sua senha atual"
              style={inputStyle}
            />
          </View>

          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#666', marginBottom: 6 }}>
              Nova senha
            </Text>
            <TextInput
              value={form.newPassword}
              onChangeText={(value) => updateField('newPassword', value)}
              secureTextEntry
              autoCapitalize="none"
              placeholder="Minimo de 6 caracteres"
              style={inputStyle}
            />
          </View>

          <View style={{ marginBottom: error ? 12 : 18 }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#666', marginBottom: 6 }}>
              Confirmar nova senha
            </Text>
            <TextInput
              value={form.confirmPassword}
              onChangeText={(value) => updateField('confirmPassword', value)}
              secureTextEntry
              autoCapitalize="none"
              placeholder="Repita a nova senha"
              style={inputStyle}
            />
          </View>

          {error ? (
            <Text style={{ color: '#D32F2F', fontSize: 12, marginBottom: 18 }}>{error}</Text>
          ) : null}

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity
              disabled={isLoading}
              onPress={onClose}
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: '#DDD',
                borderRadius: 50,
                paddingVertical: 13,
                alignItems: 'center',
                opacity: isLoading ? 0.6 : 1
              }}
            >
              <Text style={{ color: '#666', fontWeight: '700' }}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={isLoading}
              onPress={handleSubmit}
              style={{
                flex: 1,
                backgroundColor: cores.amarelo,
                borderRadius: 50,
                paddingVertical: 13,
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 46,
                opacity: isLoading ? 0.75 : 1
              }}
            >
              {isLoading ? (
                <ActivityIndicator color={cores.branco} />
              ) : (
                <Text style={{ color: cores.branco, fontWeight: '700' }}>Salvar senha</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
