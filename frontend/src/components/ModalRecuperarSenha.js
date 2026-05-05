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

const initialState = {
  step: 'request',
  email: '',
  token: '',
  newPassword: '',
  confirmPassword: '',
  error: '',
  message: ''
};

export const ModalRecuperarSenha = ({
  visible,
  onClose,
  onRequestReset,
  onConfirmReset,
  isLoading
}) => {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    if (!visible) setState(initialState);
  }, [visible]);

  const setField = (field, value) => {
    setState(prev => ({ ...prev, [field]: value, error: field === 'error' ? value : '' }));
  };

  const requestReset = async () => {
    const email = state.email.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setField('error', 'Informe um e-mail valido.');
      return;
    }

    try {
      const result = await onRequestReset({ email });
      setState(prev => ({
        ...prev,
        step: 'reset',
        token: result?.resetToken || prev.token,
        message: result?.message || 'Solicitacao enviada.',
        error: ''
      }));
    } catch (error) {
      setField('error', error.message || 'Nao foi possivel solicitar a recuperacao.');
    }
  };

  const confirmReset = async () => {
    if (!state.token.trim()) {
      setField('error', 'Informe o token.');
      return;
    }

    if (state.newPassword.length < 6) {
      setField('error', 'A nova senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    if (state.newPassword !== state.confirmPassword) {
      setField('error', 'A confirmacao precisa ser igual a nova senha.');
      return;
    }

    try {
      await onConfirmReset({
        token: state.token.trim(),
        newPassword: state.newPassword,
        confirmPassword: state.confirmPassword
      });
    } catch (error) {
      setField('error', error.message || 'Nao foi possivel redefinir a senha.');
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
              <Ionicons name="key-outline" size={22} color={cores.marrom} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: cores.preto }}>
                Recuperar senha
              </Text>
              <Text style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
                {state.step === 'request' ? 'Informe seu e-mail cadastrado.' : 'Digite o token e a nova senha.'}
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

          {state.step === 'request' ? (
            <View style={{ marginBottom: 14 }}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: '#666', marginBottom: 6 }}>
                E-mail
              </Text>
              <TextInput
                value={state.email}
                onChangeText={(value) => setField('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="seu@email.com"
                style={inputStyle}
              />
            </View>
          ) : (
            <>
              {state.message ? (
                <Text style={{ color: '#2E7D32', fontSize: 12, marginBottom: 12 }}>
                  {state.message}
                </Text>
              ) : null}

              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#666', marginBottom: 6 }}>
                  Token
                </Text>
                <TextInput
                  value={state.token}
                  onChangeText={(value) => setField('token', value)}
                  autoCapitalize="none"
                  placeholder="Token de recuperacao"
                  style={inputStyle}
                />
              </View>

              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#666', marginBottom: 6 }}>
                  Nova senha
                </Text>
                <TextInput
                  value={state.newPassword}
                  onChangeText={(value) => setField('newPassword', value)}
                  secureTextEntry
                  autoCapitalize="none"
                  placeholder="Minimo de 6 caracteres"
                  style={inputStyle}
                />
              </View>

              <View style={{ marginBottom: 14 }}>
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#666', marginBottom: 6 }}>
                  Confirmar nova senha
                </Text>
                <TextInput
                  value={state.confirmPassword}
                  onChangeText={(value) => setField('confirmPassword', value)}
                  secureTextEntry
                  autoCapitalize="none"
                  placeholder="Repita a nova senha"
                  style={inputStyle}
                />
              </View>
            </>
          )}

          {state.error ? (
            <Text style={{ color: '#D32F2F', fontSize: 12, marginBottom: 18 }}>{state.error}</Text>
          ) : null}

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity
              disabled={isLoading}
              onPress={state.step === 'request' ? onClose : () => setField('step', 'request')}
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
              <Text style={{ color: '#666', fontWeight: '700' }}>
                {state.step === 'request' ? 'Cancelar' : 'Voltar'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={isLoading}
              onPress={state.step === 'request' ? requestReset : confirmReset}
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
                <Text style={{ color: cores.branco, fontWeight: '700' }}>
                  {state.step === 'request' ? 'Enviar' : 'Redefinir'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
