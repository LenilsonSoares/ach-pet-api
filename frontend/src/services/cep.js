import { onlyDigits } from '../utils/documentos';

export async function buscarEnderecoPorCep(cep) {
  const digits = onlyDigits(cep);
  if (!/^\d{8}$/.test(digits)) {
    throw new Error('Informe um CEP com 8 dígitos.');
  }

  const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
  if (!response.ok) {
    throw new Error('Não foi possível consultar o CEP agora.');
  }

  const data = await response.json();
  if (data?.erro) {
    throw new Error('CEP não encontrado.');
  }

  return {
    cep: data.cep || cep,
    street: data.logradouro || '',
    neighborhood: data.bairro || '',
    city: data.localidade || '',
    state: data.uf || ''
  };
}
