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
