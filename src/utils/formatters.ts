export const formatTransactionAmount = (
  type: 'income' | 'expense',
  amount: string
): string => {
  const number = parseFloat(amount)
  const signal = type === 'income' ? '+' : '-'
  const formattedValue = number.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
  return `${signal} ${formattedValue}`
}

export const formatTransactionDate = (date: string): string => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit'
  })
}
