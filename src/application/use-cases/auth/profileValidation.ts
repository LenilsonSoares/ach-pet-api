import { CNPJ, CPF } from "../../../domain/entities/DocumentVO.js";
import { AppError } from "../../../domain/errors/AppError.js";
import { Phone } from "../../../domain/entities/Phone.js";
import type { UpdateUserInput, UserRole } from "../../ports/AuthRepository.js";

type ProfileInput = {
  role?: UserRole;
  name?: string;
  email?: string;
  phone?: string;
  orgName?: string;
  cpf?: string;
  birthDate?: string;
  address?: string;
  cep?: string;
  street?: string;
  addressNumber?: string;
  addressComplement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
  cnpj?: string;
  responsible?: string;
  site?: string;
};

type NormalizedProfileInput = {
  name?: string;
  email?: string;
  phone?: string;
  orgName?: string;
  cpf?: string;
  birthDate?: string;
  address?: string;
  cep?: string;
  street?: string;
  addressNumber?: string;
  addressComplement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
  cnpj?: string;
  responsible?: string;
  site?: string;
};

const MIN_ADDRESS_LENGTH = 8;

function optionalTrim(value?: string) {
  if (typeof value !== "string") return undefined;

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function optionalDigits(value?: string, message = "Valor invalido", code = "INVALID_VALUE") {
  const trimmed = optionalTrim(value);
  if (!trimmed) return undefined;

  const digits = onlyDigits(trimmed);
  if (!digits) {
    throw new AppError(400, message, code);
  }

  return digits;
}

function normalizePhone(value?: string) {
  const phone = optionalDigits(value, "Telefone invalido", "INVALID_PHONE");
  if (!phone) return undefined;

  try {
    new Phone(phone);
  } catch {
    throw new AppError(400, "Telefone invalido", "INVALID_PHONE");
  }

  return phone;
}

function normalizeCpf(value?: string) {
  const cpf = optionalDigits(value, "CPF invalido", "INVALID_CPF");
  if (!cpf) return undefined;

  try {
    new CPF(cpf);
  } catch {
    throw new AppError(400, "CPF invalido", "INVALID_CPF");
  }

  return cpf;
}

function normalizeCnpj(value?: string) {
  const cnpj = optionalDigits(value, "CNPJ invalido", "INVALID_CNPJ");
  if (!cnpj) return undefined;

  try {
    new CNPJ(cnpj);
  } catch {
    throw new AppError(400, "CNPJ invalido", "INVALID_CNPJ");
  }

  return cnpj;
}

function normalizeAddress(value?: string) {
  const address = optionalTrim(value);
  if (!address) return undefined;

  if (address.length < MIN_ADDRESS_LENGTH) {
    throw new AppError(400, "Endereco deve ter pelo menos 8 caracteres", "INVALID_ADDRESS");
  }

  return address;
}

function normalizeCep(value?: string) {
  const cep = optionalDigits(value, "CEP invalido", "INVALID_CEP");
  if (!cep) return undefined;

  if (!/^\d{8}$/.test(cep)) {
    throw new AppError(400, "CEP deve conter 8 digitos", "INVALID_CEP");
  }

  return cep;
}

function normalizeState(value?: string) {
  const state = optionalTrim(value)?.toUpperCase();
  if (!state) return undefined;

  if (!/^[A-Z]{2}$/.test(state)) {
    throw new AppError(400, "UF deve conter 2 letras", "INVALID_STATE");
  }

  return state;
}

function normalizeShortText(value: string | undefined, min: number, message: string, code: string) {
  const text = optionalTrim(value);
  if (!text) return undefined;

  if (text.length < min) {
    throw new AppError(400, message, code);
  }

  return text;
}

function normalizeCoordinate(value: unknown, min: number, max: number, message: string, code: string) {
  if (value === undefined || value === null || value === "") return undefined;

  const numberValue = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numberValue) || numberValue < min || numberValue > max) {
    throw new AppError(400, message, code);
  }

  return numberValue;
}

function calculateAge(date: Date, today = new Date()) {
  let age = today.getFullYear() - date.getUTCFullYear();
  const monthDiff = today.getMonth() - date.getUTCMonth();
  const dayDiff = today.getDate() - date.getUTCDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1;
  }

  return age;
}

function normalizeBirthDate(value?: string) {
  const birthDate = optionalTrim(value);
  if (!birthDate) return undefined;

  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(birthDate);
  if (!match) {
    throw new AppError(400, "Data de nascimento deve estar no formato DD/MM/AAAA", "INVALID_BIRTH_DATE");
  }

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  const validCalendarDate =
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;

  if (!validCalendarDate) {
    throw new AppError(400, "Data de nascimento invalida", "INVALID_BIRTH_DATE");
  }

  const today = new Date();
  const todayUtc = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  if (date > todayUtc) {
    throw new AppError(400, "Data de nascimento nao pode ser futura", "INVALID_BIRTH_DATE");
  }

  if (calculateAge(date, today) < 18) {
    throw new AppError(400, "Adotante deve ter pelo menos 18 anos", "ADOPTER_UNDERAGE");
  }

  return birthDate;
}

function baseProfile(input: ProfileInput): NormalizedProfileInput {
  return {
    name: optionalTrim(input.name),
    email: optionalTrim(input.email),
    phone: normalizePhone(input.phone),
    orgName: optionalTrim(input.orgName),
    cpf: normalizeCpf(input.cpf),
    birthDate: normalizeBirthDate(input.birthDate),
    address: normalizeAddress(input.address),
    cep: normalizeCep(input.cep),
    street: normalizeShortText(input.street, 2, "Rua invalida", "INVALID_STREET"),
    addressNumber: optionalTrim(input.addressNumber),
    addressComplement: optionalTrim(input.addressComplement),
    neighborhood: normalizeShortText(input.neighborhood, 2, "Bairro invalido", "INVALID_NEIGHBORHOOD"),
    city: normalizeShortText(input.city, 2, "Cidade invalida", "INVALID_CITY"),
    state: normalizeState(input.state),
    latitude: normalizeCoordinate(input.latitude, -90, 90, "Latitude invalida", "INVALID_LATITUDE"),
    longitude: normalizeCoordinate(input.longitude, -180, 180, "Longitude invalida", "INVALID_LONGITUDE"),
    cnpj: normalizeCnpj(input.cnpj),
    responsible: optionalTrim(input.responsible),
    site: optionalTrim(input.site),
  };
}

function requireProfileField(value: string | undefined, message: string, code: string) {
  if (!value) {
    throw new AppError(400, message, code);
  }
}

export function normalizeRegisterProfile(input: ProfileInput & { role: UserRole }) {
  const normalized = baseProfile(input);

  if (input.role === "ADOPTER") {
    requireProfileField(normalized.cpf, "CPF obrigatorio", "CPF_REQUIRED");
    requireProfileField(normalized.birthDate, "Data de nascimento obrigatoria", "BIRTH_DATE_REQUIRED");
    requireProfileField(normalized.address, "Endereco obrigatorio", "ADDRESS_REQUIRED");

    return {
      ...normalized,
      cnpj: undefined,
      orgName: undefined,
      responsible: undefined,
      site: undefined,
    };
  }

  requireProfileField(normalized.cnpj, "CNPJ obrigatorio", "CNPJ_REQUIRED");
  requireProfileField(normalized.address, "Endereco obrigatorio", "ADDRESS_REQUIRED");

  return {
    ...normalized,
    cpf: undefined,
    birthDate: undefined,
  };
}

export function normalizeUpdateProfileInput(role: UserRole, input: UpdateUserInput): UpdateUserInput {
  const normalized = baseProfile(input);

  if (role === "ADOPTER") {
    return {
      name: normalized.name,
      email: normalized.email,
      phone: normalized.phone,
      cpf: normalized.cpf,
      birthDate: normalized.birthDate,
      address: normalized.address,
      cep: normalized.cep,
      street: normalized.street,
      addressNumber: normalized.addressNumber,
      addressComplement: normalized.addressComplement,
      neighborhood: normalized.neighborhood,
      city: normalized.city,
      state: normalized.state,
      latitude: normalized.latitude,
      longitude: normalized.longitude,
    };
  }

  return {
    name: normalized.name,
    email: normalized.email,
    phone: normalized.phone,
    orgName: normalized.orgName,
    cnpj: normalized.cnpj,
    responsible: normalized.responsible,
    address: normalized.address,
    cep: normalized.cep,
    street: normalized.street,
    addressNumber: normalized.addressNumber,
    addressComplement: normalized.addressComplement,
    neighborhood: normalized.neighborhood,
    city: normalized.city,
    state: normalized.state,
    latitude: normalized.latitude,
    longitude: normalized.longitude,
    site: normalized.site,
  };
}
