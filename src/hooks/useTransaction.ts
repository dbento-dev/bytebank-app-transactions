import { useEffect, useState } from 'react'

import { transactionService } from 'utilApi/api'

interface Transaction {
  id: string
  account_id: string
  amount: string
  description: string
  transaction_date: string
  category_id: string
  category_name: string
}

interface GroupedTransactions {
  [month: string]: Transaction[]
}

export const useTransactions = (accountId: string | null) => {
  const [transactions, setTransactions] = useState<GroupedTransactions>({})

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (accountId) {
      const fetchTransactions = async () => {
        setIsLoading(true)

        try {
          const fetchedTransactions =
            await transactionService.getTransactionsByAccountId(accountId)

          const grouped: GroupedTransactions = {}

          for (const transaction of fetchedTransactions) {
            // Pega a data e extrai o nome do mês
            const month = new Date(transaction.transaction_date).toLocaleString(
              'pt-BR',
              { month: 'long' }
            )

            // Capitaliza a primeira letra do mês (ex: "julho" -> "Julho")
            const capitalizedMonth =
              month.charAt(0).toUpperCase() + month.slice(1)

            // Se a chave para este mês ainda não existe...
            if (!grouped[capitalizedMonth]) {
              // ...criamos com um array vazio.
              grouped[capitalizedMonth] = []
            }

            // Adiciona a transação atual ao array do seu respectivo mês
            grouped[capitalizedMonth].push(transaction)
          }

          setTransactions(grouped)
        } catch (err) {
          setError('Não foi possível carregar o extrato.')
          console.error('Falha ao buscar transações:', err)
        } finally {
          setIsLoading(false)
        }
      }

      fetchTransactions()
    }
  }, [accountId])

  return { transactions, isLoading, error }
}
