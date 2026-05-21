export const onlyDigits = (value) => String(value || '').replace(/\D/g, '');

export const formatCPF = (value) => {
  const digits = onlyDigits(value).slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

export const formatCNPJ = (value) => {
  const digits = onlyDigits(value).slice(0, 14);
  return digits
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
};

export const formatCEP = (value) => {
  const digits = onlyDigits(value).slice(0, 8);
  return digits.replace(/(\d{5})(\d{1,3})$/, '$1-$2');
};

export const formatPhone = (value) => {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d{1,4})$/, '$1-$2');
  }

  return digits
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
};

export const formatDate = (value) => {
  const digits = onlyDigits(value).slice(0, 8);
  return digits
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d{1,4})$/, '$1/$2');
};

export const isValidCPF = (value) => {
  const cpf = onlyDigits(value);
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0;
  for (let index = 0; index < 9; index += 1) {
    sum += Number(cpf[index]) * (10 - index);
  }

  let firstCheck = (sum * 10) % 11;
  if (firstCheck === 10) firstCheck = 0;
  if (firstCheck !== Number(cpf[9])) return false;

  sum = 0;
  for (let index = 0; index < 10; index += 1) {
    sum += Number(cpf[index]) * (11 - index);
  }

  let secondCheck = (sum * 10) % 11;
  if (secondCheck === 10) secondCheck = 0;
  return secondCheck === Number(cpf[10]);
};

export const isValidCNPJ = (value) => {
  const cnpj = onlyDigits(value);
  if (!/^\d{14}$/.test(cnpj) || /^(\d)\1{13}$/.test(cnpj)) return false;

  const calculateDigit = (length) => {
    let sum = 0;
    let position = length - 7;

    for (let index = 0; index < length; index += 1) {
      sum += Number(cnpj[index]) * position;
      position -= 1;
      if (position < 2) position = 9;
    }

    const check = sum % 11;
    return check < 2 ? 0 : 11 - check;
  };

  return calculateDigit(12) === Number(cnpj[12]) && calculateDigit(13) === Number(cnpj[13]);
};

export const buildAddressLine = ({ street, addressNumber, neighborhood, city, state }) => {
  const firstPart = [street, addressNumber].filter(Boolean).join(', ');
  const secondPart = [neighborhood, city].filter(Boolean).join(' - ');
  const parts = [firstPart, secondPart, state].filter(Boolean);
  return parts.join(', ');
};
