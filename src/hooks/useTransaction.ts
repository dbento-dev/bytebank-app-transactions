import { useCallback, useEffect, useMemo, useState } from 'react'
import { transactionService } from 'utilApi/api'
import { useTransactionStore } from 'utilStore/stores/transactions'

export type Transaction = {
  id: string
  account_id: string
  amount: string
  description: string
  transaction_date: string
  category_id: string
  category_name: string
}

type FetchTransactionsParams = {
  accountId: string
  orderBy: 'ASC' | 'DESC'
}

type useTransactionsParams = {
  accountId: string | null
  orderBy: 'ASC' | 'DESC'
}

export const useTransactions = ({
  accountId,
  orderBy
}: useTransactionsParams) => {
  const {
    setLoading: setLoadingTransaction,
    setError: setErrorTransaction,
    setSuccess: setSuccessTransaction,
    setTransaction: setTransactionStore,
    setDeleteStatus: setDeleteStatusTransaction,
    deleteStatus: deleteStatusTransaction,
    createStatus: createStatusTransaction,
    updateStatus: updateStatusTransaction,
    resetAllStatus: resetAllStatusTransaction
  } = useTransactionStore()

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = useCallback(
    async ({ accountId, orderBy }: FetchTransactionsParams) => {
      if (!accountId) {
        setTransactions([])
        return
      }

      setIsLoading(true)
      setError(null)
      setLoadingTransaction(true)

      try {
        const fetchedTransactions =
          await transactionService.getTransactionsByAccountId({
            orderBy,
            accountId
          })

        const { data } = fetchedTransactions
        setTransactions(data)
        setTransactionStore(data)
        setSuccessTransaction(true)
      } catch (err) {
        setError('Não foi possível carregar o extrato.')
        console.error('Falha ao buscar transações:', err)
        setErrorTransaction(err || 'Falha ao buscar transações')
      } finally {
        setIsLoading(false)
      }
    },
    [
      setErrorTransaction,
      setLoadingTransaction,
      setSuccessTransaction,
      setTransactionStore
    ]
  )

  const handleDeleteTransaction = async (transactionId: string) => {
    setDeleteStatusTransaction({
      loading: true,
      success: false,
      error: null
    })
    try {
      await transactionService.deleteTransaction(transactionId)

      setDeleteStatusTransaction({
        loading: false,
        success: true,
        error: null
      })
    } catch (err) {
      // TODO: alterar para toast
      console.error(`Falha ao deletar transação ${transactionId}:`, err)
      alert('Não foi possível deletar a transação.')

      setDeleteStatusTransaction({
        loading: false,
        success: false,
        error: err || 'Falha ao deletar transação'
      })
    }
  }

  useEffect(() => {
    if (!accountId) return

    fetchTransactions({
      accountId,
      orderBy
    })
  }, [
    accountId,
    orderBy,
    fetchTransactions,
    createStatusTransaction,
    updateStatusTransaction
  ])

  useEffect(() => {
    if (deleteStatusTransaction.success && accountId) {
      // Atualiza as transações após a exclusão com sucesso
      resetAllStatusTransaction()
      fetchTransactions({ accountId, orderBy })
    }
  }, [
    deleteStatusTransaction.success,
    accountId,
    orderBy,
    fetchTransactions,
    resetAllStatusTransaction
  ])

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
