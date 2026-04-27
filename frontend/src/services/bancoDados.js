import { petImages } from '../utils/constantes';

export let DATABASE = {
  pets: [
    {
      id: 'pet1',
      name: 'Max',
      category: 'dogs',
      location: 'Centro, Vitória da Conquista - BA',
      neighborhood: 'Centro',
      city: 'Vitória da Conquista',
      state: 'BA',
      image: petImages.Max,
      tags: ['Macho', '2 anos', '15kg', 'Médio'],
      description: 'Max é um cachorro dócil e brincalhão que adora companhia. Resgatado no bairro Brasil, já está vacinado e castrado. Perfeito para famílias!',
      shelterId: 'shelter1',
      shelter: 'Abrigo Amigos Peludos',
      shelterLocation: 'Bairro Brasil, Vitória da Conquista - BA',
      shelterPhone: '(77) 99999-1234',
      gallery: [petImages.Max, petImages.Luna, petImages.Thor],
      status: 'Disponível'
    },
    {
      id: 'pet2',
      name: 'Luna',
      category: 'dogs',
      location: 'Bairro Brasil, Vitória da Conquista - BA',
      neighborhood: 'Brasil',
      city: 'Vitória da Conquista',
      state: 'BA',
      image: petImages.Luna,
      tags: ['Fêmea', '1 ano', '8kg', 'Pequeno'],
      description: 'Luna é uma cadela muito carinhosa e energética. Foi encontrada no bairro Recreio e está pronta para encontrar uma família amorosa.',
      shelterId: 'shelter2',
      shelter: 'Abrigo Amor Animal',
      shelterLocation: 'Centro, Vitória da Conquista - BA',
      shelterPhone: '(77) 99999-5678',
      gallery: [petImages.Luna, petImages.Max, petImages.Thor],
      status: 'Disponível'
    },
    {
      id: 'pet3',
      name: 'Whiskers',
      category: 'cats',
      location: 'Bairro Recreio, Vitória da Conquista - BA',
      neighborhood: 'Recreio',
      city: 'Vitória da Conquista',
      state: 'BA',
      image: petImages.Whiskers,
      tags: ['Macho', '3 anos', '4kg', 'Pequeno'],
      description: 'Whiskers é um gato independente mas muito amoroso. Resgatado no bairro Candeias, adora sestas ao sol e é calmo. Ideal para apartamento.',
      shelterId: 'shelter3',
      shelter: 'Abrigo Gatos Felizes',
      shelterLocation: 'Bairro Candeias, Vitória da Conquista - BA',
      shelterPhone: '(77) 99999-9012',
      gallery: [petImages.Whiskers, petImages.Mimi, petImages.Whiskers],
      status: 'Disponível'
    },
    {
      id: 'pet4',
      name: 'Thor',
      category: 'dogs',
      location: 'Distrito de José Gonçalves, Vitória da Conquista - BA',
      neighborhood: 'José Gonçalves',
      city: 'Vitória da Conquista',
      state: 'BA',
      image: petImages.Thor,
      tags: ['Macho', '4 anos', '25kg', 'Grande'],
      description: 'Thor é um cachorro grande e protetor, mas muito dócil com crianças. Veio da zona rural e precisa de um lar com espaço.',
      shelterId: 'shelter1',
      shelter: 'Abrigo Amigos Peludos',
      shelterLocation: 'Distrito de Santo Amaro, Vitória da Conquista - BA',
      shelterPhone: '(77) 99999-3456',
      gallery: [petImages.Thor, petImages.Max, petImages.Luna],
      status: 'Disponível'
    },
    {
      id: 'pet5',
      name: 'Mimi',
      category: 'cats',
      location: 'Loteamento Cidade Modelo, Vitória da Conquista - BA',
      neighborhood: 'Cidade Modelo',
      city: 'Vitória da Conquista',
      state: 'BA',
      image: petImages.Mimi,
      tags: ['Fêmea', '2 anos', '3kg', 'Pequeno'],
      description: 'Mimi é uma gatinha muito dengosa e adora um colo. Foi resgatada no bairro Patagônia e é super carinhosa.',
      shelterId: 'shelter2',
      shelter: 'Abrigo Amor Animal',
      shelterLocation: 'Bairro Patagônia, Vitória da Conquista - BA',
      shelterPhone: '(77) 99999-7890',
      gallery: [petImages.Mimi, petImages.Whiskers, petImages.Mimi],
      status: 'Disponível'
    },
    {
      id: 'pet6',
      name: 'Bob',
      category: 'others',
      location: 'Bairro Jurema, Vitória da Conquista - BA',
      neighborhood: 'Jurema',
      city: 'Vitória da Conquista',
      state: 'BA',
      image: petImages.Bob,
      tags: ['Macho', '1 ano', '2kg', 'Pequeno'],
      description: 'Bob é um coelho muito fofo e carinhoso. Foi abandonado no bairro Alto Maron e precisa de um lar amoroso. Adora cenouras!',
      shelterId: 'shelter3',
      shelter: 'Abrigo Gatos Felizes',
      shelterLocation: 'Bairro Alto Maron, Vitória da Conquista - BA',
      shelterPhone: '(77) 99999-2345',
      gallery: [petImages.Bob, petImages.Bob, petImages.Bob],
      status: 'Disponível'
    }
  ],

  shelters: [
    {
      id: 'shelter1',
      name: 'Abrigo Amigos Peludos',
      email: 'contato@amigospeludos.com',
      phone: '(77) 99999-1234',
      address: 'Rua das Flores, 123 - Centro, Vitória da Conquista - BA',
      responsible: 'Maria Oliveira',
      cnpj: '12.345.678/0001-90',
      stats: { totalPets: 0, totalAdoptions: 0, successRate: 0 }
    },
    {
      id: 'shelter2',
      name: 'Abrigo Amor Animal',
      email: 'contato@amoranimal.com',
      phone: '(77) 99999-5678',
      address: 'Av. Brasil, 456 - Brasil, Vitória da Conquista - BA',
      responsible: 'Carlos Santos',
      cnpj: '23.456.789/0001-01',
      stats: { totalPets: 0, totalAdoptions: 0, successRate: 0 }
    },
    {
      id: 'shelter3',
      name: 'Abrigo Gatos Felizes',
      email: 'contato@gatosfelizes.com',
      phone: '(77) 99999-9012',
      address: 'Rua do Recreio, 789 - Recreio, Vitória da Conquista - BA',
      responsible: 'Ana Pereira',
      cnpj: '34.567.890/0001-12',
      stats: { totalPets: 0, totalAdoptions: 0, successRate: 0 }
    }
  ],

  applications: [
    {
      id: 'app1',
      petId: 'pet1',
      petName: 'Max',
      shelterId: 'shelter1',
      adopterId: 'adopter1',
      adopterName: 'João Silva',
      adopterEmail: 'joao@email.com',
      adopterPhone: '(77) 98765-4321',
      status: 'Pendente',
      date: new Date().toISOString()
    },
    {
      id: 'app2',
      petId: 'pet2',
      petName: 'Luna',
      shelterId: 'shelter2',
      adopterId: 'adopter2',
      adopterName: 'Maria Santos',
      adopterEmail: 'maria@email.com',
      adopterPhone: '(77) 99876-5432',
      status: 'Pendente',
      date: new Date().toISOString()
    }
  ],

  adoptions: [
    {
      id: 'ad1',
      petId: 'pet1',
      petName: 'Max',
      shelterId: 'shelter1',
      adopterId: 'adopter1',
      adopterName: 'João Silva',
      date: new Date().toISOString(),
      daysSinceAdoption: '5 dias'
    }
  ],

  chats: {},

  adopters: [
    {
      id: 'adopter1',
      name: 'João Silva',
      email: 'joao@email.com',
      phone: '(77) 98765-4321',
      cpf: '123.456.789-00',
      birthDate: '10/05/1990',
      address: 'Rua A, 123 - Centro, Vitória da Conquista - BA'
    },
    {
      id: 'adopter2',
      name: 'Maria Santos',
      email: 'maria@email.com',
      phone: '(77) 99876-5432',
      cpf: '987.654.321-00',
      birthDate: '15/08/1985',
      address: 'Rua B, 456 - Brasil, Vitória da Conquista - BA'
    }
  ],

  currentUser: null
};