import { Platform } from 'react-native';
import * as Location from 'expo-location';

export async function solicitarLocalizacaoAtual() {
  if (Platform.OS === 'web') return null;

  const permission = await Location.requestForegroundPermissionsAsync();
  if (permission.status !== 'granted') {
    throw new Error('Autorize a localização para salvar sua posição aproximada.');
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced
  });

  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude
  };
}
