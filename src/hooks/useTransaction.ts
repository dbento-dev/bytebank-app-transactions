import { useCallback, useEffect, useMemo, useState } from 'react'

import { transactionService } from 'utilApi/api'
import { useTransactionStore } from 'utilStore/stores/transactions'

import { toast } from 'react-toastify'

export type Transaction = {
  id: string
  account_id: string
  amount: string
  description: string
  transaction_date: string
  category_id: string
  category_name: string
  receipt_url?: string
}

type useTransactionsParams = {
  accountId: string | null
  orderBy: 'ASC' | 'DESC'
  search?: string
  page?: number
  perPage?: number
}

export const useTransactions = ({
  accountId,
  orderBy,
  search = '',
  page,
  perPage
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
  const [meta, setMeta] = useState<{
    total: number
    page: number
    perPage: number
    totalPages: number
  }>({
    total: 0,
    page: 1,
    perPage: 10,
    totalPages: 0
  })

  const fetchTransactions = useCallback(
    async ({
      accountId,
      orderBy,
      search,
      page = 1,
      perPage = 10
    }: useTransactionsParams) => {
      if (!accountId) {
        setTransactions([])
        return
      }

      setIsLoading(true)
      setError(null)
      setLoadingTransaction(true)

      try {
        const response = await transactionService.searchTransactionsByAccount({
          accountId,
          search,
          orderBy,
          page,
          perPage
        })

        const { data, meta } = response
        setMeta(meta)
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

      toast.success('Transação deletada com sucesso!')
      setDeleteStatusTransaction({
        loading: false,
        success: true,
        error: null
      })
    } catch (err) {
      console.error(`Falha ao deletar transação ${transactionId}:`, err)
      toast.error('Falha ao deletar a transação. Tente novamente.')

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
      orderBy,
      search,
      page,
      perPage
    })
  }, [
    accountId,
    orderBy,
    search,
    page,
    perPage,
    fetchTransactions,
    createStatusTransaction,
    updateStatusTransaction
  ])

  useEffect(() => {
    if (deleteStatusTransaction.success && accountId) {
      // Atualiza as transações após a exclusão com sucesso
      resetAllStatusTransaction()
      fetchTransactions({ accountId, orderBy, search, page, perPage })
    }
  }, [
    deleteStatusTransaction.success,
    accountId,
    orderBy,
    search,
    page,
    perPage,
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

  return {
    groupedTransactions,
    isLoading,
    error,
    handleDeleteTransaction,
    meta
  }
}
