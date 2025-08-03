import React, { useState } from 'react'

import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import {
  Alert,
  Box,
  CircularProgress,
  Pagination,
  Stack,
  Typography
} from '@mui/material'

import {
  ConfirmationModal,
  TransactionItem,
  TransactionSearch,
  UserInfo
} from 'utilUi/components'

import { Container } from './styles'

import {
  formatTransactionAmount,
  formatTransactionDate
} from '../../utils/formatters'

import { useTransactions, type Transaction } from '../../hooks/useTransaction'

import { useAccountStore } from 'utilStore/stores/account'
import { useTransactionStore } from 'utilStore/stores/transactions'
import { useUserStore } from 'utilStore/stores/user'

const TransactionList: React.FC = () => {
  const [page, setPage] = useState(1)
  const perPage = 15

  const { user: currentUser, loading: isLoadingUser } = useUserStore()

  const {
    account,
    isLoading: isLoadingAccounts,
    error: accountsError
  } = useAccountStore()

  const { setEditingTransaction: setEditingTransactionId } =
    useTransactionStore()

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransactionId(transaction)
  }

  const [searchTerm, setSearchTerm] = useState('')

  const {
    groupedTransactions,
    isLoading: isLoadingTransactions,
    error: transactionError,
    handleDeleteTransaction,
    meta
  } = useTransactions({
    accountId: account ? account?.id : null,
    orderBy: 'DESC',
    search: searchTerm,
    page,
    perPage
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(
    null
  )

  const handleSearchTransaction = async (term: string) => {
    setSearchTerm(term)
    setPage(1)
  }

  const openDeleteModal = (id: string) => {
    setTransactionToDelete(id)
    setModalOpen(true)
  }

  const closeDeleteModal = () => {
    setTransactionToDelete(null)
    setModalOpen(false)
  }

  const confirmDelete = () => {
    if (transactionToDelete) {
      handleDeleteTransaction(transactionToDelete)
    }
    closeDeleteModal()
  }

  if (isLoadingAccounts || isLoadingUser) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (transactionError || accountsError) {
    return <Alert severity="error">{transactionError}</Alert>
  }

  return (
    <Container>
      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 4
          }}
        >
          <UserInfo
            name={currentUser?.name}
            avatarUrl={currentUser?.avatarUrl}
          />
        </Box>

        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
          <AccountBalanceWalletIcon
            fontSize="large"
            sx={{ color: 'common.black' }}
          />
          <Typography variant="h5" fontWeight="bold">
            Extrato
          </Typography>
        </Stack>

        <Stack sx={{ mb: 2 }}>
          <Box>
            <TransactionSearch onSearch={handleSearchTransaction} />
          </Box>
        </Stack>

        {isLoadingTransactions && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        )}

        <Stack spacing={2}>
          {groupedTransactions.length > 0 &&
            groupedTransactions.map(
              ({ month, transactions: monthTransactions }) => (
                <Box key={month}>
                  <Typography
                    variant="subtitle1"
                    color="text.primary"
                    sx={{ mb: 1.5 }}
                  >
                    {month}
                  </Typography>
                  <Stack spacing={1}>
                    {monthTransactions.map((transaction) => {
                      const type =
                        transaction.category_name === 'Entrada'
                          ? 'income'
                          : 'expense'
                      return (
                        <TransactionItem
                          key={transaction.id}
                          transactionType={type}
                          title={transaction.description}
                          date={formatTransactionDate(
                            transaction.transaction_date
                          )}
                          amount={formatTransactionAmount(
                            type,
                            transaction.amount
                          )}
                          onEdit={() => handleEditTransaction(transaction)}
                          onDelete={() => openDeleteModal(transaction.id)}
                        />
                      )
                    })}
                  </Stack>
                </Box>
              )
            )}
        </Stack>
      </Box>

      {groupedTransactions.length === 0 && !isLoadingTransactions && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="subtitle1" color="text.secondary">
            Nenhuma transação encontrada.
          </Typography>
        </Box>
      )}

      <Pagination
        count={meta.totalPages}
        page={page}
        onChange={(_, value) => setPage(value)}
        color="primary"
        sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}
      />

      <ConfirmationModal
        open={modalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Confirmar Exclusão"
        description="Você tem certeza que deseja deletar esta transação? Esta ação não poderá ser desfeita."
      />
    </Container>
  )
}

export default TransactionList
