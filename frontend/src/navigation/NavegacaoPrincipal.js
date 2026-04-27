import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Alert,
  Dimensions
} from 'react-native';
import { DATABASE } from '../services/bancoDados';
import { cores } from '../utils/constantes';

import { TelaSplash } from '../screens/TelaSplash';
import { TelaBoasVindas } from '../screens/TelaBoasVindas';
import { TelaEscolhaPerfil } from '../screens/TelaEscolhaPerfil';
import { TelaLogin } from '../screens/TelaLogin';
import { TelaCadastro } from '../screens/TelaCadastro';
import { TelaHomeAdotante } from '../screens/TelaHomeAdotante';
import { TelaFavoritos } from '../screens/TelaFavoritos';
import { TelaSolicitacoesAdotante } from '../screens/TelaSolicitacoesAdotante';
import { TelaPerfilAdotante } from '../screens/TelaPerfilAdotante';
import { TelaEditarPerfilAdotante } from '../screens/TelaEditarPerfilAdotante';
import { TelaDetalhesPet } from '../screens/TelaDetalhesPet';
import { TelaHomeAbrigo } from '../screens/TelaHomeAbrigo';
import { TelaGerenciarPets } from '../screens/TelaGerenciarPets';
import { TelaAdicionarPet } from '../screens/TelaAdicionarPet';
import { TelaSolicitacoesAbrigo } from '../screens/TelaSolicitacoesAbrigo';
import { TelaDetalheSolicitacao } from '../screens/TelaDetalheSolicitacao';
import { TelaAdocoesAbrigo } from '../screens/TelaAdocoesAbrigo';
import { TelaDetalheAdocao } from '../screens/TelaDetalheAdocao';
import { TelaPerfilAbrigo } from '../screens/TelaPerfilAbrigo';
import { TelaChat } from '../screens/TelaChat';

import { MenuInferior } from '../components/MenuInferior';
import { ModalFiltros } from '../components/ModalFiltros';

export const NavegacaoPrincipal = () => {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [userType, setUserType] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const [activeNavTab, setActiveNavTab] = useState('home');
  const [activeRequestTab, setActiveRequestTab] = useState('analyzing');
  const [filtersModalVisible, setFiltersModalVisible] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [favorites, setFavorites] = useState({});
  const [selectedPet, setSelectedPet] = useState(null);
  const [filteredPets, setFilteredPets] = useState([]);
  const [activeCategory, setActiveCategory] = useState('dogs');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [shelterPets, setShelterPets] = useState([]);
  const [shelterApplications, setShelterApplications] = useState([]);
  const [shelterAdoptions, setShelterAdoptions] = useState([]);
  const [selectedShelterPet, setSelectedShelterPet] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [petForm, setPetForm] = useState({ nome: '', idade: '', sexo: '', porte: '', descricao: '' });
  const [petPhoto, setPetPhoto] = useState(null);
  const [isEditingPet, setIsEditingPet] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatPartner, setChatPartner] = useState({ name: '', petName: '' });

  const [filters, setFilters] = useState({ porte: [], idade: [], sexo: [], tipo: [] });

  useEffect(() => {
    setFilteredPets(DATABASE.pets.filter(p => p.status === 'Disponível'));
  }, []);

  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => {
        setCurrentScreen('welcome');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  useEffect(() => {
    if (userType === 'shelter' && currentUser) {
      const myPets = DATABASE.pets.filter(pet => pet.shelterId === currentUser.id);
      setShelterPets(myPets);
      
      const myApplications = DATABASE.applications.filter(app => 
        myPets.some(pet => pet.id === app.petId)
      );
      setShelterApplications(myApplications);
      
      const myAdoptions = DATABASE.adoptions.filter(ad => 
        myPets.some(pet => pet.id === ad.petId)
      );
      setShelterAdoptions(myAdoptions);
      
      const shelterIndex = DATABASE.shelters.findIndex(s => s.id === currentUser.id);
      if (shelterIndex !== -1) {
        DATABASE.shelters[shelterIndex].stats = {
          totalPets: myPets.length,
          totalAdoptions: myAdoptions.length,
          successRate: myApplications.length > 0 
            ? Math.round((myApplications.filter(a => a.status === 'Aprovada').length / myApplications.length) * 100) 
            : 0
        };
      }
    }
  }, [userType, currentUser]);

  const navigateTo = (screen) => setCurrentScreen(screen);
  
  const handleLogin = () => {
    if (userType === 'adopter') setCurrentUser(DATABASE.adopters[0]);
    else if (userType === 'shelter') setCurrentUser(DATABASE.shelters[0]);
    navigateTo('home');
  };

  const switchNavTab = (tab) => {
    setActiveNavTab(tab);
    setShowSuccessMessage(false);
  };

  const toggleFavorite = (petId) => {
    setFavorites(prev => ({
      ...prev,
      [petId]: !prev[petId]
    }));
  };

  const showPetDetails = (pet) => {
    setSelectedPet(pet);
    setCurrentGalleryIndex(0);
    setCurrentScreen('pet-details');
  };

  const submitAdoptionRequest = () => {
    const newApp = {
      id: 'app' + Date.now(),
      petId: selectedPet.id,
      petName: selectedPet.name,
      shelterId: selectedPet.shelterId,
      shelter: selectedPet.shelter,
      adopterId: currentUser?.id || 'adopter1',
      adopterName: currentUser?.name || 'João Silva',
      adopterEmail: currentUser?.email || 'joao@email.com',
      adopterPhone: currentUser?.phone || '(77) 98765-4321',
      status: 'Pendente',
      date: new Date().toISOString()
    };
    DATABASE.applications.push(newApp);
    setCurrentScreen('home');
    setShowSuccessMessage(true);
    setActiveNavTab('home');
  };

  const goToRequests = () => {
    setShowSuccessMessage(false);
    setActiveNavTab('requests');
  };

  const nextGallerySlide = () => {
    if (selectedPet) {
      setCurrentGalleryIndex((prev) => (prev + 1) % selectedPet.gallery.length);
    }
  };

  const prevGallerySlide = () => {
    if (selectedPet) {
      setCurrentGalleryIndex((prev) => 
        prev === 0 ? selectedPet.gallery.length - 1 : prev - 1
      );
    }
  };

  const selectUserType = (type) => {
    setUserType(type);
    navigateTo('login');
  };

  const goToRegister = () => navigateTo('register');
  
  const logout = () => {
    setUserType(null);
    setCurrentUser(null);
    setCurrentScreen('welcome');
    setActiveNavTab('home');
    setFavorites({});
    setIsEditingProfile(false);
  };

  const goBack = () => {
    if (userType === 'adopter') {
      if (currentScreen === 'pet-details') {
        setCurrentScreen('home');
      } else if (currentScreen === 'chat') {
        setCurrentScreen('home');
        setActiveNavTab('requests');
      } else if (currentScreen === 'TelaEditarPerfilAdotante' || isEditingProfile) {
        setIsEditingProfile(false);
        setCurrentScreen('home');
      } else {
        setCurrentScreen('home');
      }
    } else {
      if (currentScreen === 'shelter-manage-pets' || 
          currentScreen === 'shelter-add-pet' || 
          currentScreen === 'shelter-applications' ||
          currentScreen === 'shelter-application-detail' ||
          currentScreen === 'shelter-adoptions' ||
          currentScreen === 'shelter-adoption-detail' ||
          currentScreen === 'shelter-profile' ||
          currentScreen === 'shelter-chat') {
        setCurrentScreen('home');
      }
    }
  };

  const filterByCategory = (category) => {
    setActiveCategory(category);
    let filtered = DATABASE.pets.filter(p => p.status === 'Disponível');
    if (category === 'dogs') filtered = filtered.filter(pet => pet.category === 'dogs');
    else if (category === 'cats') filtered = filtered.filter(pet => pet.category === 'cats');
    else if (category === 'others') filtered = filtered.filter(pet => pet.category === 'others');
    
    if (filters.porte.length > 0 || filters.idade.length > 0 || filters.sexo.length > 0) {
      filtered = filtered.filter(pet => {
        if (filters.porte.length > 0) {
          const porteMatch = filters.porte.some(p => {
            if (p === 'Pequeno' && pet.tags.includes('Pequeno')) return true;
            if (p === 'Médio' && pet.tags.includes('Médio')) return true;
            if (p === 'Grande' && pet.tags.includes('Grande')) return true;
            return false;
          });
          if (!porteMatch) return false;
        }
        if (filters.sexo.length > 0) {
          const sexoMatch = filters.sexo.some(s => {
            if (s === 'Macho' && pet.tags.includes('Macho')) return true;
            if (s === 'Fêmea' && pet.tags.includes('Fêmea')) return true;
            return false;
          });
          if (!sexoMatch) return false;
        }
        return true;
      });
    }
    setFilteredPets(filtered);
  };

  const applyFilters = () => {
    filterByCategory(activeCategory);
    setFiltersModalVisible(false);
  };

  const clearFilters = () => {
    setFilters({ porte: [], idade: [], sexo: [], tipo: [] });
    setFilteredPets(DATABASE.pets.filter(p => 
      p.status === 'Disponível' && (
        activeCategory === 'dogs' ? p.category === 'dogs' :
        activeCategory === 'cats' ? p.category === 'cats' :
        activeCategory === 'others' ? p.category === 'others' : true
      )
    ));
    setFiltersModalVisible(false);
  };

  const toggleFilter = (category, value) => {
    setFilters(prev => {
      const current = [...prev[category]];
      if (current.includes(value)) {
        return { ...prev, [category]: current.filter(v => v !== value) };
      } else {
        return { ...prev, [category]: [...current, value] };
      }
    });
  };

  const getUserApplications = () => DATABASE.applications.filter(app => app.adopterId === currentUser?.id);

  const handleSaveProfile = (updatedData) => {
    const updatedUser = { ...currentUser, ...updatedData };
    setCurrentUser(updatedUser);
    if (userType === 'adopter') {
      const userIndex = DATABASE.adopters.findIndex(u => u.id === currentUser.id);
      if (userIndex !== -1) {
        DATABASE.adopters[userIndex] = { ...DATABASE.adopters[userIndex], ...updatedData };
      }
    }
    
    setIsEditingProfile(false);
  };

  const getShelterStats = () => ({
    pets: shelterPets.length,
    applications: shelterApplications.filter(a => a.status === 'Pendente').length,
    adoptions: shelterAdoptions.length
  });

  const goToManagePets = () => setCurrentScreen('shelter-manage-pets');
  
  const goToAddPet = () => {
    setPetForm({ nome: '', idade: '', sexo: '', porte: '', descricao: '' });
    setPetPhoto(null);
    setIsEditingPet(false);
    setCurrentScreen('shelter-add-pet');
  };

  const editShelterPet = (petId) => {
    const pet = shelterPets.find(p => p.id === petId);
    if (pet) {
      setPetForm({
        nome: pet.name,
        idade: pet.tags.find(t => t.includes('anos'))?.split(' ')[0] || '',
        sexo: pet.tags.includes('Macho') ? 'Macho' : 'Fêmea',
        porte: pet.tags.includes('Pequeno') ? 'Pequeno' : pet.tags.includes('Médio') ? 'Médio' : 'Grande',
        descricao: pet.description
      });
      setPetPhoto(pet.image);
      setIsEditingPet(true);
      setSelectedShelterPet(pet);
      setCurrentScreen('shelter-add-pet');
    }
  };

  const deleteShelterPet = (petId) => {
    if (typeof window !== 'undefined' && window.confirm) {
      const confirm = window.confirm('Tem certeza que deseja deletar este pet?');
      if (confirm) {
        DATABASE.pets = DATABASE.pets.filter(p => p.id !== petId);
        setShelterPets(shelterPets.filter(p => p.id !== petId));
      }
    } else {
      Alert.alert('Confirmar exclusão', 'Tem certeza que deseja deletar este pet?', [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: () => {
            DATABASE.pets = DATABASE.pets.filter(p => p.id !== petId);
            setShelterPets(shelterPets.filter(p => p.id !== petId));
          }
        }
      ]);
    }
  };

  const saveShelterPet = () => {
    const { nome, idade, sexo, porte, descricao } = petForm;
    if (!nome || !idade || !sexo || !porte || !descricao) {
      if (typeof window !== 'undefined') window.alert('Preencha todos os campos!');
      else Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    const tags = [sexo, `${idade} anos`, porte];

    if (isEditingPet && selectedShelterPet) {
      const updatedPets = DATABASE.pets.map(pet => {
        if (pet.id === selectedShelterPet.id) {
          return { ...pet, name: nome, tags, description: descricao, image: petPhoto || pet.image };
        }
        return pet;
      });
      DATABASE.pets = updatedPets;
      setShelterPets(shelterPets.map(pet => 
        pet.id === selectedShelterPet.id ? { ...pet, name: nome, tags, description: descricao, image: petPhoto || pet.image } : pet
      ));
    } else {
      const newPet = {
        id: 'pet' + Date.now(),
        name: nome,
        category: porte === 'Pequeno' ? 'dogs' : porte === 'Médio' ? 'dogs' : 'dogs',
        location: currentUser?.address || 'Centro, Vitória da Conquista - BA',
        neighborhood: 'Centro',
        city: 'Vitória da Conquista',
        state: 'BA',
        image: petPhoto || require('../assets/default-pet.png'),
        tags,
        description: descricao,
        shelterId: currentUser.id,
        shelter: currentUser.name,
        shelterLocation: currentUser.address,
        shelterPhone: currentUser.phone,
        gallery: [petPhoto || require('../assets/default-pet.png')],
        status: 'Disponível'
      };
      DATABASE.pets.push(newPet);
      setShelterPets([...shelterPets, newPet]);
    }

    if (typeof window !== 'undefined') window.alert('Pet salvo com sucesso!');
    else Alert.alert('Sucesso', 'Pet salvo com sucesso!');
    setCurrentScreen('shelter-manage-pets');
  };

  const goToShelterApplications = () => setCurrentScreen('shelter-applications');

  const viewApplicationDetail = (appId) => {
    const app = shelterApplications.find(a => a.id === appId);
    if (app) {
      setSelectedApplication(app);
      setCurrentScreen('shelter-application-detail');
    }
  };

  const approveApplication = () => {
    if (!selectedApplication) return;

    const appIndex = DATABASE.applications.findIndex(a => a.id === selectedApplication.id);
    if (appIndex !== -1) DATABASE.applications[appIndex].status = 'Aprovada';

    const petIndex = DATABASE.pets.findIndex(p => p.id === selectedApplication.petId);
    if (petIndex !== -1) DATABASE.pets[petIndex].status = 'Adotado';

    const newAdoption = {
      id: 'ad' + Date.now(),
      petId: selectedApplication.petId,
      petName: selectedApplication.petName,
      shelterId: currentUser.id,
      adopterId: selectedApplication.adopterId,
      adopterName: selectedApplication.adopterName,
      date: new Date().toISOString(),
      daysSinceAdoption: '0 dias'
    };
    DATABASE.adoptions.push(newAdoption);

    setShelterApplications(shelterApplications.map(a => 
      a.id === selectedApplication.id ? { ...a, status: 'Aprovada' } : a
    ));
    setShelterPets(shelterPets.map(p => 
      p.id === selectedApplication.petId ? { ...p, status: 'Adotado' } : p
    ));
    setShelterAdoptions([...shelterAdoptions, newAdoption]);

    if (typeof window !== 'undefined') window.alert('Solicitação aprovada!');
    else Alert.alert('Sucesso', 'Solicitação aprovada!');
    setCurrentScreen('shelter-applications');
  };

  const rejectApplication = () => {
    if (!selectedApplication) return;

    const appIndex = DATABASE.applications.findIndex(a => a.id === selectedApplication.id);
    if (appIndex !== -1) DATABASE.applications[appIndex].status = 'Recusada';

    setShelterApplications(shelterApplications.map(a => 
      a.id === selectedApplication.id ? { ...a, status: 'Recusada' } : a
    ));
    setShowRejectConfirm(false);
    if (typeof window !== 'undefined') window.alert('Solicitação recusada');
    else Alert.alert('Sucesso', 'Solicitação recusada');
    setCurrentScreen('shelter-applications');
  };

  const goToShelterAdoptions = () => setCurrentScreen('shelter-adoptions');

  const viewAdoptionDetail = (adoptionId) => {
    const adoption = shelterAdoptions.find(a => a.id === adoptionId);
    if (adoption) {
      setSelectedApplication(adoption);
      setCurrentScreen('shelter-adoption-detail');
    }
  };

  const endAdoption = () => {
    if (typeof window !== 'undefined') window.alert('O período de acompanhamento foi finalizado.');
    else Alert.alert('Acompanhamento encerrado', 'O período de acompanhamento foi finalizado.');
    setCurrentScreen('shelter-adoptions');
  };

  const goToShelterProfile = () => setCurrentScreen('shelter-profile');

  const openChat = (partnerId, partnerName, petName) => {
    const chatId = partnerId;
    
    if (!DATABASE.chats[chatId]) {
      DATABASE.chats[chatId] = [];
    }
    
    setCurrentChatId(chatId);
    setChatMessages(DATABASE.chats[chatId]);
    setChatPartner({ name: partnerName, petName });
    
    if (userType === 'adopter') {
      setCurrentScreen('chat');
    } else {
      setCurrentScreen('shelter-chat');
    }
  };

  const sendChatMessage = () => {
    if (!chatMessage.trim() || !currentChatId) return;
    
    const newMessage = {
      id: Date.now().toString(),
      sender: userType === 'adopter' ? 'adopter' : 'shelter',
      text: chatMessage,
      timestamp: new Date().toISOString(),
      senderName: currentUser?.name || (userType === 'adopter' ? 'Adotante' : 'Abrigo')
    };
    
    if (!DATABASE.chats[currentChatId]) {
      DATABASE.chats[currentChatId] = [];
    }
    DATABASE.chats[currentChatId].push(newMessage);
    
    setChatMessages([...DATABASE.chats[currentChatId]]);
    setChatMessage('');
  };

  const handleBottomNav = (tab) => {
    if (userType === 'adopter') {
      setActiveNavTab(tab);
      setIsEditingProfile(false);
    } else {
      if (tab === 'home') setCurrentScreen('home');
      else if (tab === 'pets') goToManagePets();
      else if (tab === 'applications') goToShelterApplications();
      else if (tab === 'profile') goToShelterProfile();
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <TelaSplash />;
      
      case 'welcome':
        return <TelaBoasVindas onComecar={() => navigateTo('profile')} />;
      
      case 'profile':
        return <TelaEscolhaPerfil onSelectPerfil={selectUserType} />;
      
      case 'login':
        return <TelaLogin onLogin={handleLogin} onRegistrar={goToRegister} />;
      
      case 'register':
        return <TelaCadastro userType={userType} onCadastrar={() => {
          if (typeof window !== 'undefined') window.alert(`Cadastro de ${userType === 'adopter' ? 'adotante' : 'abrigo'} realizado com sucesso!`);
          else Alert.alert('Sucesso', `Cadastro de ${userType === 'adopter' ? 'adotante' : 'abrigo'} realizado com sucesso!`);
          navigateTo('home');
        }} onVoltarLogin={() => navigateTo('login')} />;
      
      case 'home':
        if (userType === 'adopter') {
          if (activeNavTab === 'home') {
            return (
              <TelaHomeAdotante
                showSuccessMessage={showSuccessMessage}
                activeCategory={activeCategory}
                filteredPets={filteredPets}
                favorites={favorites}
                onFilterByCategory={filterByCategory}
                onOpenFilters={() => setFiltersModalVisible(true)}
                onShowPetDetails={showPetDetails}
                onToggleFavorite={toggleFavorite}
                onGoToRequests={goToRequests}
                onSearch={(text) => console.log('Buscar:', text)}
              />
            );
          } else if (activeNavTab === 'favorites') {
            const favoritePets = DATABASE.pets.filter(pet => favorites[pet.id]);
            return (
              <TelaFavoritos
                favoritePets={favoritePets}
                onShowPetDetails={showPetDetails}
                onToggleFavorite={toggleFavorite}
              />
            );
          } else if (activeNavTab === 'requests') {
            return (
              <TelaSolicitacoesAdotante
                activeTab={activeRequestTab}
                onTabChange={setActiveRequestTab}
                applications={getUserApplications()}
                onOpenChat={openChat}
              />
            );
          } else if (activeNavTab === 'profile') {
            if (isEditingProfile) {
              return (
                <TelaEditarPerfilAdotante
                  currentUser={currentUser}
                  onSave={handleSaveProfile}
                  onVoltar={() => setIsEditingProfile(false)}
                />
              );
            }
            return (
              <TelaPerfilAdotante
                currentUser={currentUser}
                applications={getUserApplications()}
                onLogout={logout}
                onEditProfile={() => setIsEditingProfile(true)}
              />
            );
          }
        } else {
          return (
            <TelaHomeAbrigo
              currentUser={currentUser}
              stats={getShelterStats()}
              onManagePets={goToManagePets}
              onApplications={goToShelterApplications}
              onAdoptions={goToShelterAdoptions}
              onAddPet={goToAddPet}
            />
          );
        }
        break;
      
      case 'pet-details':
        return (
          <TelaDetalhesPet
            pet={selectedPet}
            favorites={favorites}
            currentGalleryIndex={currentGalleryIndex}
            onVoltar={() => setCurrentScreen('home')}
            onToggleFavorite={toggleFavorite}
            onPrevGallery={prevGallerySlide}
            onNextGallery={nextGallerySlide}
            onAdotar={submitAdoptionRequest}
            onOpenChat={() => openChat(selectedPet.shelterId, selectedPet.shelter, selectedPet.name)}
          />
        );
      
      case 'shelter-manage-pets':
        return (
          <TelaGerenciarPets
            shelterPets={shelterPets}
            onAddPet={goToAddPet}
            onEditPet={editShelterPet}
            onDeletePet={deleteShelterPet}
            onVoltar={goBack}
          />
        );
      
      case 'shelter-add-pet':
        return (
          <TelaAdicionarPet
            isEditing={isEditingPet}
            petForm={petForm}
            petPhoto={petPhoto}
            onFormChange={(field, value) => setPetForm({...petForm, [field]: value})}
            onPhotoChange={() => {
              if (typeof window !== 'undefined') window.alert('Função: Selecionar foto da galeria');
              else Alert.alert('Função', 'Selecionar foto da galeria');
            }}
            onSave={saveShelterPet}
            onCancel={() => setCurrentScreen('shelter-manage-pets')}
            onVoltar={goBack}
          />
        );
      
      case 'shelter-applications':
        return (
          <TelaSolicitacoesAbrigo
            applications={shelterApplications}
            onViewDetail={viewApplicationDetail}
            onOpenChat={openChat}
            onVoltar={goBack}
          />
        );
      
      case 'shelter-application-detail':
        return (
          <TelaDetalheSolicitacao
            application={selectedApplication}
            showRejectConfirm={showRejectConfirm}
            onApprove={approveApplication}
            onReject={() => setShowRejectConfirm(true)}
            onConfirmReject={rejectApplication}
            onCancelReject={() => setShowRejectConfirm(false)}
            onOpenChat={() => openChat(selectedApplication.adopterId, selectedApplication.adopterName, selectedApplication.petName)}
            onVoltar={goBack}
          />
        );
      
      case 'shelter-adoptions':
        return (
          <TelaAdocoesAbrigo
            adoptions={shelterAdoptions}
            onViewDetail={viewAdoptionDetail}
            onOpenChat={openChat}
            onVoltar={goBack}
          />
        );
      
      case 'shelter-adoption-detail':
        return (
          <TelaDetalheAdocao
            adoption={selectedApplication}
            onEndAdoption={endAdoption}
            onVoltar={goBack}
          />
        );
      
      case 'shelter-profile':
        return (
          <TelaPerfilAbrigo
            currentUser={currentUser}
            stats={getShelterStats()}
            successRate={shelterApplications.length > 0 
              ? Math.round((shelterApplications.filter(a => a.status === 'Aprovada').length / shelterApplications.length) * 100) 
              : 0}
            onLogout={logout}
            onVoltar={goBack}
          />
        );
      
      case 'chat':
      case 'shelter-chat':
        return (
          <TelaChat
            userType={userType}
            chatPartner={chatPartner}
            messages={chatMessages}
            chatMessage={chatMessage}
            onSendMessage={sendChatMessage}
            onChangeMessage={setChatMessage}
            onVoltar={goBack}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: cores.cinza }}>
      <StatusBar barStyle="dark-content" backgroundColor={cores.amarelo} />
      {renderScreen()}
      
      {currentScreen === 'home' && (
        <MenuInferior
          userType={userType}
          activeNavTab={activeNavTab}
          currentScreen={currentScreen}
          onNavigate={handleBottomNav}
        />
      )}
      
      {(currentScreen === 'shelter-manage-pets' || 
        currentScreen === 'shelter-applications' || 
        currentScreen === 'shelter-profile') && (
        <MenuInferior
          userType={userType}
          activeNavTab={
            currentScreen === 'shelter-manage-pets' ? 'pets' :
            currentScreen === 'shelter-applications' ? 'applications' :
            currentScreen === 'shelter-profile' ? 'profile' : 'home'
          }
          currentScreen={currentScreen}
          onNavigate={handleBottomNav}
        />
      )}
      
      {userType === 'adopter' && (
        <ModalFiltros
          visible={filtersModalVisible}
          onClose={() => setFiltersModalVisible(false)}
          filters={filters}
          onToggleFilter={toggleFilter}
          onApply={applyFilters}
          onClear={clearFilters}
        />
      )}
    </SafeAreaView>
  );
};