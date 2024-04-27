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
