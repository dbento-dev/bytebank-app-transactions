import React, { useState } from 'react'

import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import { Alert, Box, CircularProgress, Stack, Typography } from '@mui/material'

import { ConfirmationModal, TransactionItem, UserInfo } from 'utilUi/components'

import { Container } from './styles'

import {
  formatTransactionAmount,
  formatTransactionDate
} from '../../utils/formatters'

import { useTransactions } from '../../hooks/useTransaction'

import { useAccountStore } from 'utilStore/stores/account'
import { useUserStore } from 'utilStore/stores/user'

const TransactionList: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = useUserStore((state: { user: any }) => state.user)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const accounts = useAccountStore((state: { account: any }) => state.account)
  const mainAccount = accounts && accounts.length > 0 ? accounts[0] : null

  const { groupedTransactions, handleDeleteTransaction, isLoading, error } =
    useTransactions(mainAccount ? mainAccount.id : null, 'DESC')

  const [modalOpen, setModalOpen] = useState(false)
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(
    null
  )

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

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>
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
          <UserInfo name={user?.name} avatarUrl={user?.avatarUrl} />
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

        <Stack
          spacing={2}
          sx={{
            maxHeight: '60vh',
            overflowY: 'auto'
          }}
        >
          {groupedTransactions.map(
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
                        onEdit={() => alert(`Editando: ${transaction.id}`)}
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
