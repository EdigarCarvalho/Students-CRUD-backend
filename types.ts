export interface Aluno {
  id?: number;
  nome: string;
  email: string;
  matricula: string;
  cpf: string;
  data_nascimento: Date;
  created_at?: Date;
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validateAluno(data: unknown): Omit<Aluno, 'id' | 'created_at'> {
  if (!data || typeof data !== 'object') {
    throw new ValidationError('Dados inválidos');
  }

  const { nome, email, matricula, cpf, data_nascimento } = data as Partial<Aluno>;

  // Validação do nome
  if (!nome) {
    throw new ValidationError('Nome é obrigatório');
  }
  if (typeof nome !== 'string') {
    throw new ValidationError('Nome deve ser uma string');
  }
  if (nome.length < 2 || nome.length > 100) {
    throw new ValidationError('Nome deve ter entre 2 e 100 caracteres');
  }

  // Validação do email
  if (!email) {
    throw new ValidationError('Email é obrigatório');
  }
  if (typeof email !== 'string') {
    throw new ValidationError('Email deve ser uma string');
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('Email inválido');
  }

  // Validação da matrícula
  if (!matricula) {
    throw new ValidationError('Matrícula é obrigatória');
  }
  if (typeof matricula !== 'string') {
    throw new ValidationError('Matrícula deve ser uma string');
  }
  if (matricula.length < 5 || matricula.length > 20) {
    throw new ValidationError('Matrícula deve ter entre 5 e 20 caracteres');
  }

  // Validação do CPF
  if (!cpf) {
    throw new ValidationError('CPF é obrigatório');
  }
  if (typeof cpf !== 'string') {
    throw new ValidationError('CPF deve ser uma string');
  }
  // Remove caracteres não numéricos
  const cpfLimpo = cpf.replace(/\D/g, '');
  if (cpfLimpo.length !== 11) {
    throw new ValidationError('CPF deve conter 11 dígitos');
  }
  // Validação básica de CPF
  if (/^(\d)\1{10}$/.test(cpfLimpo)) {
    throw new ValidationError('CPF inválido');
  }

  // Validação da data de nascimento
  if (!data_nascimento) {
    throw new ValidationError('Data de nascimento é obrigatória');
  }
  const dataNasc = new Date(data_nascimento);
  if (isNaN(dataNasc.getTime())) {
    throw new ValidationError('Data de nascimento inválida');
  }
  // Verifica se a data não é futura
  if (dataNasc > new Date()) {
    throw new ValidationError('Data de nascimento não pode ser futura');
  }
  // Verifica se a pessoa tem menos de 120 anos
  const idadeMaxima = new Date();
  idadeMaxima.setFullYear(idadeMaxima.getFullYear() - 120);
  if (dataNasc < idadeMaxima) {
    throw new ValidationError('Data de nascimento inválida - idade máxima é 120 anos');
  }

  return { 
    nome, 
    email, 
    matricula, 
    cpf: cpfLimpo, 
    data_nascimento: dataNasc 
  };
}
