import { Baloo_2 } from 'next/font/google'
export const baloo = Baloo_2({ weight: '400', subsets: ['latin'] })

export function formatPhone(phone: string) {
  // Remove tudo que não é dígito e limita o tamanho a 11 dígitos, que é o máximo para telefones brasileiros
  const cleaned = phone.replace(/\D/g, '').slice(0, 11)
  // Inicializa as partes do telefone
  let part1, part2, part3

  if (cleaned.length <= 2) {
    // Apenas DDD
    part1 = cleaned
  } else if (cleaned.length <= 6) {
    // Início de um telefone fixo
    part1 = cleaned.slice(0, 2)
    part2 = cleaned.slice(2)
  } else if (cleaned.length <= 10) {
    // Telefone fixo completo ou celular incompleto
    part1 = cleaned.slice(0, 2)
    part2 = cleaned.slice(2, 6) // Fixo ou início do celular, dependendo do comprimento
    part3 = cleaned.slice(6)
  } else {
    // Celular completo
    part1 = cleaned.slice(0, 2)
    part2 = cleaned.slice(2, 7) // Celular com 9 dígitos após o DDD
    part3 = cleaned.slice(7)
  }

  // Junta as partes formatadas, adicionando os parênteses, espaço e o traço somente quando necessário
  return (part1 ? '(' + part1 : '') + (part1 && part2 ? ') ' : '') + (part2 || '') + (part3 ? '-' + part3 : '')
}

//Função usando replace para validar CPFs
export function validateCPF(cpf: string) {
  cpf = cpf.replace(/[^\d]+/g, '')
  if (cpf === '') return false
  // Elimina CPFs invalidos conhecidos
  if (
    cpf.length !== 11 ||
    cpf === '00000000000' ||
    cpf === '11111111111' ||
    cpf === '22222222222' ||
    cpf === '33333333333' ||
    cpf === '44444444444' ||
    cpf === '55555555555' ||
    cpf === '66666666666' ||
    cpf === '77777777777' ||
    cpf === '88888888888' ||
    cpf === '99999999999'
  )
    return false
  // Valida 1o digito
  let add = 0
  for (let i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i)
  let rev = 11 - (add % 11)
  if (rev === 10 || rev === 11) rev = 0
  if (rev !== parseInt(cpf.charAt(9))) return false
  // Valida 2o digito
  add = 0
  for (let i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i)
  rev = 11 - (add % 11)
  if (rev === 10 || rev === 11) rev = 0
  if (rev !== parseInt(cpf.charAt(10))) return false
  return true
}

export function formatCPF(cpf: string) {
  // Remove tudo que não é dígito
  const cleaned = cpf.replace(/\D/g, '')
  // Formata os grupos de dígitos
  let part1, part2, part3, part4
  if (cleaned.length <= 3) {
    part1 = cleaned
  } else if (cleaned.length <= 6) {
    part1 = cleaned.slice(0, 3)
    part2 = cleaned.slice(3)
  } else if (cleaned.length <= 9) {
    part1 = cleaned.slice(0, 3)
    part2 = cleaned.slice(3, 6)
    part3 = cleaned.slice(6)
  } else {
    part1 = cleaned.slice(0, 3)
    part2 = cleaned.slice(3, 6)
    part3 = cleaned.slice(6, 9)
    part4 = cleaned.slice(9, 11)
  }
  // Junta as partes formatadas, adicionando os pontos e o traço
  return [part1, part2, part3].filter(Boolean).join('.') + (part4 ? '-' + part4 : '')
}

export function formatCEP(cep: string) {
  // Remove tudo que não é dígito e limita a string a no máximo 8 dígitos
  const cleaned = cep.replace(/\D/g, '').slice(0, 8)

  // Verifica se a string contém dígitos suficientes para formar um CEP

  // Extrai as partes do CEP: prefixo (5 dígitos) e sufixo (3 dígitos)
  const part1 = cleaned.slice(0, 5)
  const part2 = cleaned.slice(5)

  // Junta as partes formatadas com um traço
  return part2 ? `${part1}-${part2}` : part1
}
