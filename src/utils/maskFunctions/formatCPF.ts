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
