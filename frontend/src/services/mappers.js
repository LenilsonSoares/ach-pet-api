import { petImages } from '../utils/constantes';
import { API_BASE_URL } from './api';

export const requestStatusToLabel = {
  PENDING: 'Pendente',
  APPROVED: 'Aprovada',
  REJECTED: 'Recusada',
  CANCELED: 'Cancelada'
};

export const petStatusToLabel = {
  AVAILABLE: 'Disponível',
  ADOPTED: 'Adotado',
  PAUSED: 'Pausado'
};

const normalize = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export const speciesToCategory = (species) => {
  const value = normalize(species);
  if (value.includes('cachorro') || value.includes('cao') || value.includes('dog')) return 'dogs';
  if (value.includes('gato') || value.includes('cat')) return 'cats';
  return 'others';
};

export const categoryToSpecies = (category) => {
  if (category === 'cats') return 'Gato';
  if (category === 'others') return 'Outro';
  return 'Cachorro';
};

const formatSex = (sex) => {
  const value = normalize(sex);
  if (value === 'm' || value === 'macho') return 'Macho';
  if (value === 'f' || value === 'femea') return 'Fêmea';
  return sex || null;
};

const formatSize = (size) => {
  const value = normalize(size);
  if (value === 'p' || value === 'pequeno') return 'Pequeno';
  if (value === 'm' || value === 'medio') return 'Médio';
  if (value === 'g' || value === 'grande') return 'Grande';
  return size || null;
};

const formatAge = (ageMonths) => {
  if (ageMonths === null || ageMonths === undefined) return null;
  if (ageMonths < 12) return `${ageMonths} meses`;

  const years = Math.floor(ageMonths / 12);
  return years === 1 ? '1 ano' : `${years} anos`;
};

const buildPhotoSource = (url) => {
  if (!url) return petImages.default;
  if (typeof url !== 'string') return url;
  if (url.startsWith('/')) return { uri: `${API_BASE_URL}${url}` };
  return { uri: url };
};

export const mapApiUserToViewModel = (user) => ({
  id: user.id,
  name: user.name || user.orgName || 'Usuário',
  email: user.email,
  phone: user.phone || '',
  role: user.role,
  address: '',
  responsible: user.name || '',
  cnpj: '',
  stats: { totalPets: 0, totalAdoptions: 0, successRate: 0 }
});

export const mapApiPetToViewModel = (pet) => {
  const photos = Array.isArray(pet.photos) ? pet.photos : [];
  const gallery = photos.length > 0
    ? photos.map((photo) => buildPhotoSource(photo.url || photo))
    : [petImages.default];

  const sex = formatSex(pet.sex);
  const age = formatAge(pet.ageMonths);
  const size = formatSize(pet.size);
  const tags = [sex, age, pet.breed, size].filter(Boolean);

  return {
    id: pet.id,
    name: pet.name,
    category: speciesToCategory(pet.species),
    species: pet.species,
    breed: pet.breed,
    ageMonths: pet.ageMonths,
    location: pet.shelter?.name || 'Abrigo cadastrado',
    neighborhood: pet.shelter?.name || 'Abrigo',
    city: 'Vitória da Conquista',
    state: 'BA',
    image: gallery[0],
    tags,
    description: pet.description || 'Sem descrição informada.',
    shelterId: pet.shelterId,
    shelter: pet.shelter?.name || 'Abrigo',
    shelterLocation: pet.shelter?.name || 'Abrigo cadastrado',
    shelterPhone: '',
    gallery,
    status: petStatusToLabel[pet.status] || pet.status || 'Disponível',
    apiStatus: pet.status,
    createdAt: pet.createdAt
  };
};

export const mapApiRequestToAdopterApplication = (request) => {
  const pet = request.pet || {};
  return {
    id: request.id,
    petId: request.petId || pet.id,
    petName: pet.name || 'Pet',
    shelterId: request.shelterId || pet.shelterId,
    shelter: pet.shelter?.name || 'Abrigo',
    adopterId: request.adopterId,
    adopterName: request.adopter?.name,
    adopterEmail: request.adopter?.email,
    adopterPhone: '',
    status: requestStatusToLabel[request.status] || request.status,
    date: request.createdAt,
    adoptionId: request.adoption?.id,
    threadId: request.adoption?.thread?.id
  };
};

export const mapApiRequestToShelterApplication = (request) => {
  const pet = request.pet || {};
  const adopter = request.adopter || {};

  return {
    id: request.id,
    petId: request.petId || pet.id,
    petName: pet.name || 'Pet',
    shelterId: request.shelterId || pet.shelterId,
    adopterId: request.adopterId || adopter.id,
    adopterName: adopter.name || 'Adotante',
    adopterEmail: adopter.email || '',
    adopterPhone: '',
    message: request.message,
    status: requestStatusToLabel[request.status] || request.status,
    date: request.createdAt,
    adoptionId: request.adoption?.id,
    threadId: request.adoption?.thread?.id
  };
};

export const mapApplicationToShelterAdoption = (application) => {
  const createdAt = application.date ? new Date(application.date) : new Date();
  const diffMs = Date.now() - createdAt.getTime();
  const days = Math.max(0, Math.floor(diffMs / 86_400_000));

  return {
    id: application.adoptionId || application.id,
    requestId: application.id,
    petId: application.petId,
    petName: application.petName,
    shelterId: application.shelterId,
    adopterId: application.adopterId,
    adopterName: application.adopterName,
    date: application.date,
    daysSinceAdoption: days === 1 ? '1 dia' : `${days} dias`,
    threadId: application.threadId
  };
};

export const mapApiMessageToViewModel = (message) => ({
  id: message.id,
  sender: message.sender?.role === 'SHELTER' ? 'shelter' : 'adopter',
  text: message.content,
  timestamp: message.createdAt,
  senderName: message.sender?.name || 'Usuário'
});
