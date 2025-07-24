import { useCallback, useEffect, useMemo, useState } from 'react'

import { transactionService } from 'utilApi/api'

export interface TransactionGroup {
  month: string
  transactions: Transaction[]
}

interface Transaction {
  id: string
  account_id: string
  amount: string
  description: string
  transaction_date: string
  category_id: string
  category_name: string
}

export const useTransactions = (
  accountId: string | null,
  sortOrder: 'ASC' | 'DESC' = 'DESC'
) => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = useCallback(async () => {
    if (!accountId) {
      setTransactions([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const fetchedTransactions =
        await transactionService.getTransactionsByAccountId(
          accountId,
          sortOrder as 'ASC' | 'DESC'
        )

      setTransactions(fetchedTransactions)
    } catch (err) {
      setError('Não foi possível carregar o extrato.')
      console.error('Falha ao buscar transações:', err)
    } finally {
      setIsLoading(false)
    }
  }, [accountId, sortOrder])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const handleDeleteTransaction = async (transactionId: string) => {
    try {
      await transactionService.deleteTransaction(transactionId)

      await fetchTransactions()
    } catch (err) {
      console.error(`Falha ao deletar transação ${transactionId}:`, err)
      alert('Não foi possível deletar a transação.')
    }
  }

  const groupedTransactions = useMemo(() => {
    const grouped = transactions.reduce(
      (acc, transaction) => {
        const monthYear = new Date(transaction.transaction_date).toLocaleString(
          'pt-BR',
          {
            month: 'long',
            year: 'numeric'
          }
        )
        const capitalizedKey =
          monthYear.charAt(0).toUpperCase() + monthYear.slice(1)

        if (!acc[capitalizedKey]) {
          acc[capitalizedKey] = []
        }

        acc[capitalizedKey].push(transaction)

        return acc
      },
      {} as Record<string, Transaction[]>
    )

    return Object.entries(grouped).map(([month, transactions]) => ({
      month,
      transactions
    }))
  }, [transactions])

  return { groupedTransactions, isLoading, error, handleDeleteTransaction }
}
