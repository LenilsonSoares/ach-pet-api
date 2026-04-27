import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const ModalFiltros = ({ 
  visible, 
  onClose, 
  filters, 
  onToggleFilter, 
  onApply, 
  onClear 
}) => {
  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableOpacity 
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={{ backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '80%' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#1E1E1E' }}>Filtros</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#1E1E1E" />
            </TouchableOpacity>
          </View>

          <ScrollView>
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#1E1E1E', marginBottom: 10 }}>Porte</Text>
              <View style={{ gap: 8 }}>
                {['Pequeno', 'Médio', 'Grande'].map((item) => (
                  <TouchableOpacity key={item} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }} onPress={() => onToggleFilter('porte', item)}>
                    <View style={{ width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: '#8B2E0F', backgroundColor: filters.porte.includes(item) ? '#8B2E0F' : 'transparent', justifyContent: 'center', alignItems: 'center' }}>
                      {filters.porte.includes(item) && <Ionicons name="checkmark" size={16} color="white" />}
                    </View>
                    <Text style={{ fontSize: 13, color: '#1E1E1E' }}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#1E1E1E', marginBottom: 10 }}>Idade</Text>
              <View style={{ gap: 8 }}>
                {['Filhote (0-1 ano)', 'Adulto (1-7 anos)', 'Sênior (7+ anos)'].map((item) => (
                  <TouchableOpacity key={item} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }} onPress={() => onToggleFilter('idade', item)}>
                    <View style={{ width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: '#8B2E0F', backgroundColor: filters.idade.includes(item) ? '#8B2E0F' : 'transparent', justifyContent: 'center', alignItems: 'center' }}>
                      {filters.idade.includes(item) && <Ionicons name="checkmark" size={16} color="white" />}
                    </View>
                    <Text style={{ fontSize: 13, color: '#1E1E1E' }}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#1E1E1E', marginBottom: 10 }}>Sexo</Text>
              <View style={{ gap: 8 }}>
                {['Macho', 'Fêmea'].map((item) => (
                  <TouchableOpacity key={item} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }} onPress={() => onToggleFilter('sexo', item)}>
                    <View style={{ width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: '#8B2E0F', backgroundColor: filters.sexo.includes(item) ? '#8B2E0F' : 'transparent', justifyContent: 'center', alignItems: 'center' }}>
                      {filters.sexo.includes(item) && <Ionicons name="checkmark" size={16} color="white" />}
                    </View>
                    <Text style={{ fontSize: 13, color: '#1E1E1E' }}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={{ flexDirection: 'row', gap: 12, marginTop: 20 }}>
            <TouchableOpacity style={{ flex: 1, backgroundColor: '#F5F5F5', padding: 12, borderRadius: 50 }} onPress={onClear}>
              <Text style={{ textAlign: 'center', fontSize: 14, fontWeight: '600', color: '#555' }}>Limpar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={{ flex: 1, backgroundColor: '#8B2E0F', padding: 12, borderRadius: 50 }} onPress={onApply}>
              <Text style={{ textAlign: 'center', fontSize: 14, fontWeight: '600', color: 'white' }}>Aplicar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};