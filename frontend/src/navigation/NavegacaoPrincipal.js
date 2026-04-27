import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Alert
} from 'react-native';
import { DATABASE } from '../services/bancoDados';
import { api } from '../services/api';
import {
  categoryToSpecies,
  mapApiMessageToViewModel,
  mapApiPetToViewModel,
  mapApiRequestToAdopterApplication,
  mapApiRequestToShelterApplication,
  mapApiUserToViewModel,
  mapApplicationToShelterAdoption
} from '../services/mappers';
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
  const [authToken, setAuthToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [activeNavTab, setActiveNavTab] = useState('home');
  const [activeRequestTab, setActiveRequestTab] = useState('analyzing');
  const [filtersModalVisible, setFiltersModalVisible] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [favorites, setFavorites] = useState({});
  const [selectedPet, setSelectedPet] = useState(null);
  const [allPets, setAllPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [adopterApplications, setAdopterApplications] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [activeCategory, setActiveCategory] = useState('dogs');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [shelterPets, setShelterPets] = useState([]);
  const [shelterApplications, setShelterApplications] = useState([]);
  const [shelterAdoptions, setShelterAdoptions] = useState([]);
  const [selectedShelterPet, setSelectedShelterPet] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [petForm, setPetForm] = useState({ nome: '', tipo: 'dogs', idade: '', sexo: '', porte: '', descricao: '' });
  const [petPhoto, setPetPhoto] = useState(null);
  const [isEditingPet, setIsEditingPet] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatPartner, setChatPartner] = useState({ name: '', petName: '' });

  const [filters, setFilters] = useState({ porte: [], idade: [], sexo: [], tipo: [] });

  const notify = (title, message) => {
    if (typeof window !== 'undefined' && window.alert) window.alert(`${title}: ${message}`);
    else Alert.alert(title, message);
  };

  const getPetAgeYears = (pet) => {
    const ageTag = pet.tags?.find(tag => tag.includes('ano') || tag.includes('mes'));
    if (!ageTag) return null;
    const value = Number(ageTag.match(/\d+/)?.[0]);
    if (Number.isNaN(value)) return null;
    return ageTag.includes('mes') ? value / 12 : value;
  };

  const applyPetFiltersToList = (
    pets,
    category = activeCategory,
    currentFilters = filters,
    currentSearchText = searchText
  ) => {
    const normalizedSearch = currentSearchText.trim().toLowerCase();

    return pets.filter((pet) => {
      if (pet.status !== 'Disponível') return false;
      if (category && pet.category !== category) return false;

      if (normalizedSearch) {
        const searchable = `${pet.name} ${pet.description} ${pet.shelter} ${pet.tags?.join(' ')}`.toLowerCase();
        if (!searchable.includes(normalizedSearch)) return false;
      }

      if (currentFilters.porte.length > 0) {
        const porteMatch = currentFilters.porte.some((porte) => pet.tags?.includes(porte));
        if (!porteMatch) return false;
      }

      if (currentFilters.sexo.length > 0) {
        const sexoMatch = currentFilters.sexo.some((sexo) => pet.tags?.includes(sexo));
        if (!sexoMatch) return false;
      }

      if (currentFilters.idade.length > 0) {
        const ageYears = getPetAgeYears(pet);
        if (ageYears === null) return false;

        const idadeMatch = currentFilters.idade.some((idade) => {
          if (idade.includes('Filhote')) return ageYears <= 1;
          if (idade.includes('Adulto')) return ageYears > 1 && ageYears < 7;
          if (idade.includes('Sênior')) return ageYears >= 7;
          return true;
        });

        if (!idadeMatch) return false;
      }

      return true;
    });
  };

  const loadAvailablePets = async ({ silent = false } = {}) => {
    try {
      const result = await api.listPets({ status: 'AVAILABLE', pageSize: 100, order: 'desc' });
      const pets = result.pets.map(mapApiPetToViewModel);
      setAllPets(pets);
      setFilteredPets(applyPetFiltersToList(pets));
    } catch (error) {
      const fallbackPets = DATABASE.pets.filter(p => p.status === 'Disponível');
      setAllPets(fallbackPets);
      setFilteredPets(applyPetFiltersToList(fallbackPets));
      if (!silent) notify('API indisponível', error.message);
    }
  };

  const loadMyApplications = async (token = authToken) => {
    if (!token) return;
    const result = await api.listMyRequests(token);
    setAdopterApplications(result.requests.map(mapApiRequestToAdopterApplication));
  };

  const loadShelterData = async (token = authToken) => {
    if (!token) return;

    const [petsResult, inboxResult] = await Promise.all([
      api.listMyPets(token),
      api.listInboxRequests(token)
    ]);

    const pets = petsResult.pets.map(mapApiPetToViewModel);
    const applications = inboxResult.requests.map(mapApiRequestToShelterApplication);
    const adoptions = applications
      .filter(app => app.status === 'Aprovada' && app.adoptionId)
      .map(mapApplicationToShelterAdoption);

    setShelterPets(pets);
    setShelterApplications(applications);
    setShelterAdoptions(adoptions);
  };

  useEffect(() => {
    loadAvailablePets({ silent: true });
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
    if (!currentUser || !authToken) return;

    if (userType === 'shelter') {
      loadShelterData().catch(error => notify('Erro', error.message));
    } else if (userType === 'adopter') {
      loadAvailablePets().catch(error => notify('Erro', error.message));
      loadMyApplications().catch(error => notify('Erro', error.message));
    }
  }, [userType, currentUser, authToken]);

  const navigateTo = (screen) => setCurrentScreen(screen);
  
  const handleLogin = async ({ email, password }) => {
    if (!email || !password) {
      notify('Erro', 'Informe e-mail e senha.');
      return;
    }

    try {
      setIsLoading(true);
      const result = await api.login({ email, password });
      const mappedUser = mapApiUserToViewModel(result.user);
      const mappedType = result.user.role === 'SHELTER' ? 'shelter' : 'adopter';

      setAuthToken(result.token);
      setUserType(mappedType);
      setCurrentUser(mappedUser);
      setActiveNavTab('home');
      navigateTo('home');
    } catch (error) {
      notify('Erro no login', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (formData) => {
    if (!userType) {
      notify('Erro', 'Escolha um perfil antes de cadastrar.');
      return;
    }

    try {
      setIsLoading(true);
      const role = userType === 'shelter' ? 'SHELTER' : 'ADOPTER';
      const name = role === 'SHELTER' ? formData.orgName || formData.name : formData.name;
      const phone = formData.phone ? formData.phone.replace(/\D/g, '') : undefined;

      const result = await api.register({
        role,
        name,
        email: formData.email,
        password: formData.password,
        phone,
        orgName: role === 'SHELTER' ? formData.orgName || name : undefined
      });

      setAuthToken(result.token);
      setCurrentUser(mapApiUserToViewModel(result.user));
      setUserType(result.user.role === 'SHELTER' ? 'shelter' : 'adopter');
      setActiveNavTab('home');
      notify('Sucesso', 'Cadastro realizado com sucesso!');
      navigateTo('home');
    } catch (error) {
      notify('Erro no cadastro', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const switchNavTab = (tab) => {
    setActiveNavTab(tab);
    setShowSuccessMessage(false);
  };

  const toggleFavorite = async (petId) => {
    const wasFavorite = !!favorites[petId];
    setFavorites(prev => ({ ...prev, [petId]: !wasFavorite }));

    if (!authToken || userType !== 'adopter') return;

    try {
      if (wasFavorite) await api.unfavoritePet(authToken, petId);
      else await api.favoritePet(authToken, petId);
    } catch (error) {
      setFavorites(prev => ({ ...prev, [petId]: wasFavorite }));
      notify('Erro', error.message);
    }
  };

  const showPetDetails = (pet) => {
    setSelectedPet(pet);
    setCurrentGalleryIndex(0);
    setCurrentScreen('pet-details');
  };

  const submitAdoptionRequest = async () => {
    if (!authToken || !selectedPet) {
      notify('Erro', 'Faça login como adotante para solicitar adoção.');
      return;
    }

    try {
      await api.createAdoptionRequest(authToken, {
        petId: selectedPet.id,
        message: `Tenho interesse em adotar ${selectedPet.name}.`
      });
      await loadMyApplications();
      setCurrentScreen('home');
      setShowSuccessMessage(true);
      setActiveNavTab('home');
    } catch (error) {
      notify('Erro ao solicitar adoção', error.message);
    }
  };

  const goToRequests = () => {
    setShowSuccessMessage(false);
    setActiveNavTab('requests');
  };

  const nextGallerySlide = (index) => {
    if (selectedPet) {
      if (typeof index === 'number') setCurrentGalleryIndex(index);
      else setCurrentGalleryIndex((prev) => (prev + 1) % selectedPet.gallery.length);
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
    setAuthToken(null);
    setCurrentScreen('welcome');
    setActiveNavTab('home');
    setFavorites({});
    setAdopterApplications([]);
    setShelterApplications([]);
    setShelterAdoptions([]);
    setShelterPets([]);
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
    setFilteredPets(applyPetFiltersToList(allPets, category));
  };

  const handleSearchPets = (text) => {
    setSearchText(text);
    setFilteredPets(applyPetFiltersToList(allPets, activeCategory, filters, text));
  };

  const applyFilters = () => {
    setFilteredPets(applyPetFiltersToList(allPets));
    setFiltersModalVisible(false);
  };

  const clearFilters = () => {
    const cleanFilters = { porte: [], idade: [], sexo: [], tipo: [] };
    setFilters(cleanFilters);
    setFilteredPets(applyPetFiltersToList(allPets, activeCategory, cleanFilters));
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

  const getUserApplications = () => adopterApplications;

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
    setPetForm({ nome: '', tipo: 'dogs', idade: '', sexo: '', porte: '', descricao: '' });
    setPetPhoto(null);
    setIsEditingPet(false);
    setCurrentScreen('shelter-add-pet');
  };

  const editShelterPet = (petId) => {
    const pet = shelterPets.find(p => p.id === petId);
    if (pet) {
      setPetForm({
        nome: pet.name,
        tipo: pet.category || 'dogs',
        idade: pet.ageMonths !== null && pet.ageMonths !== undefined
          ? String(Math.max(0, Math.round(pet.ageMonths / 12)))
          : pet.tags.find(t => t.includes('anos'))?.split(' ')[0] || '',
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

  const pauseShelterPet = async (petId) => {
    if (!authToken) return;

    try {
      await api.updatePet(authToken, petId, { status: 'PAUSED' });
      await loadShelterData();
      await loadAvailablePets({ silent: true });
      notify('Sucesso', 'Pet removido da listagem pública.');
    } catch (error) {
      notify('Erro', error.message);
    }
  };

  const deleteShelterPet = (petId) => {
    if (typeof window !== 'undefined' && window.confirm) {
      const confirm = window.confirm('Tem certeza que deseja remover este pet da listagem?');
      if (confirm) {
        pauseShelterPet(petId);
      }
    } else {
      Alert.alert('Confirmar remoção', 'Tem certeza que deseja remover este pet da listagem?', [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => pauseShelterPet(petId)
        }
      ]);
    }
  };

  const saveShelterPet = async () => {
    const { nome, tipo, idade, sexo, porte, descricao } = petForm;
    if (!nome || !tipo || !idade || !sexo || !porte || !descricao) {
      notify('Erro', 'Preencha todos os campos!');
      return;
    }

    if (!authToken) {
      notify('Erro', 'Faça login como abrigo para salvar pets.');
      return;
    }

    const payload = {
        name: nome,
        species: categoryToSpecies(tipo),
        sex: sexo,
        ageMonths: Number(idade) * 12,
        size: porte,
        description: descricao
    };

    try {
      if (isEditingPet && selectedShelterPet) {
        await api.updatePet(authToken, selectedShelterPet.id, payload);
      } else {
        await api.createPet(authToken, payload);
      }

      await loadShelterData();
      await loadAvailablePets({ silent: true });
      notify('Sucesso', 'Pet salvo com sucesso!');
      setCurrentScreen('shelter-manage-pets');
    } catch (error) {
      notify('Erro ao salvar pet', error.message);
    }
  };

  const goToShelterApplications = () => setCurrentScreen('shelter-applications');

  const viewApplicationDetail = (appId) => {
    const app = shelterApplications.find(a => a.id === appId);
    if (app) {
      setSelectedApplication(app);
      setCurrentScreen('shelter-application-detail');
    }
  };

  const approveApplication = async () => {
    if (!selectedApplication || !authToken) return;

    try {
      await api.approveRequest(authToken, selectedApplication.id, { followUpDays: 30 });
      await loadShelterData();
      await loadAvailablePets({ silent: true });
      notify('Sucesso', 'Solicitação aprovada!');
      setCurrentScreen('shelter-applications');
    } catch (error) {
      notify('Erro ao aprovar solicitação', error.message);
    }
  };

  const rejectApplication = async () => {
    if (!selectedApplication || !authToken) return;

    try {
      await api.rejectRequest(authToken, selectedApplication.id);
      await loadShelterData();
      setShowRejectConfirm(false);
      notify('Sucesso', 'Solicitação recusada');
      setCurrentScreen('shelter-applications');
    } catch (error) {
      notify('Erro ao recusar solicitação', error.message);
    }
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

  const openChat = async (threadId, partnerName, petName) => {
    if (!threadId || !authToken) {
      notify('Chat indisponível', 'O chat fica disponível após a solicitação ser aprovada.');
      return;
    }

    try {
      const result = await api.listMessages(authToken, threadId);

      setCurrentChatId(threadId);
      setChatMessages(result.messages.map(mapApiMessageToViewModel));
      setChatPartner({ name: partnerName, petName });

      if (userType === 'adopter') {
        setCurrentScreen('chat');
      } else {
        setCurrentScreen('shelter-chat');
      }
    } catch (error) {
      notify('Erro ao abrir chat', error.message);
    }
  };

  const sendChatMessage = async () => {
    if (!chatMessage.trim() || !currentChatId) return;

    const message = chatMessage.trim();
    setChatMessage('');

    try {
      const result = await api.sendMessage(authToken, currentChatId, message);
      setChatMessages(prev => [...prev, mapApiMessageToViewModel(result.message)]);
    } catch (error) {
      setChatMessage(message);
      notify('Erro ao enviar mensagem', error.message);
    }
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
        return <TelaLogin onLogin={handleLogin} onRegistrar={goToRegister} isLoading={isLoading} />;
      
      case 'register':
        return (
          <TelaCadastro
            userType={userType}
            onCadastrar={handleRegister}
            onVoltarLogin={() => navigateTo('login')}
            isLoading={isLoading}
          />
        );
      
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
                onSearch={handleSearchPets}
              />
            );
          } else if (activeNavTab === 'favorites') {
            const favoritePets = allPets.filter(pet => favorites[pet.id]);
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
            onOpenChat={() => openChat(selectedApplication.threadId, selectedApplication.adopterName, selectedApplication.petName)}
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
