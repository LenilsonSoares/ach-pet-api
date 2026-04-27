import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CabecalhoArredondado } from '../components/CabecalhoArredondado';
import { CabecalhoAbrigo } from '../components/CabecalhoAbrigo';

export const TelaChat = ({ 
  userType, 
  chatPartner, 
  messages, 
  chatMessage, 
  onSendMessage, 
  onChangeMessage, 
  onVoltar 
}) => {
  const ChatHeader = userType === 'adopter' ? CabecalhoArredondado : CabecalhoAbrigo;

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: '#EDEDED' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ChatHeader title={chatPartner.name} onBack={onVoltar} showBack={true} />

      <View style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <ScrollView 
          style={{ flex: 1, padding: 20 }} 
          contentContainerStyle={{ gap: 12 }}
          ref={ref => {
            if (ref) {
              setTimeout(() => ref.scrollToEnd({ animated: true }), 100);
            }
          }}
        >
          {messages.map((msg, index) => {
            const isMine = (userType === 'adopter' && msg.sender === 'adopter') || 
                          (userType === 'shelter' && msg.sender === 'shelter');
            
            return (
              <View key={msg.id || index} style={{ flexDirection: 'row', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                <View style={{ 
                  maxWidth: '70%', 
                  backgroundColor: isMine ? '#8B2E0F' : 'white', 
                  padding: 12, 
                  borderRadius: 18, 
                  borderBottomRightRadius: isMine ? 4 : 18, 
                  borderBottomLeftRadius: isMine ? 18 : 4,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.08,
                  shadowRadius: 2,
                  elevation: 2
                }}>
                  <Text style={{ fontSize: 13, color: isMine ? 'white' : '#1E1E1E' }}>{msg.text}</Text>
                  <Text style={{ fontSize: 10, color: isMine ? 'rgba(255,255,255,0.7)' : '#999', marginTop: 4, alignSelf: 'flex-end' }}>
                    {new Date(msg.timestamp || Date.now()).toLocaleTimeString().slice(0,5)}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <View style={{ flexDirection: 'row', padding: 12, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#DDD', gap: 8 }}>
          <TextInput 
            style={{ flex: 1, backgroundColor: '#F5F5F5', borderRadius: 20, padding: 10, fontSize: 13 }} 
            placeholder="Digite sua mensagem..." 
            placeholderTextColor="#999"
            value={chatMessage}
            onChangeText={onChangeMessage}
            multiline
          />
          <TouchableOpacity onPress={onSendMessage} style={{ width: 36, height: 36, backgroundColor: '#F4A51C', borderRadius: 18, justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="send" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};