import React from 'react'

import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import { Alert, Box, CircularProgress, Stack, Typography } from '@mui/material'

import { TransactionItem, UserInfo } from 'utilUi/components'

import { Container } from './styles'

import {
  formatTransactionAmount,
  formatTransactionDate
} from '../../utils/formatters'

import { useTransactions } from '../../hooks/useTransaction'

import { useUserStore } from 'utilStore/stores/user'

const TransactionList: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = useUserStore((state: { user: any }) => state.user)

  const { transactions, isLoading, error } = useTransactions(
    'ce004358-f27b-4d51-9f9d-646352fb4448'
  )

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
          {Object.entries(transactions).map(([month, monthTransactions]) => (
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
                      date={formatTransactionDate(transaction.transaction_date)}
                      amount={formatTransactionAmount(type, transaction.amount)}
                      onEdit={() => alert(`Editando: ${transaction.id}`)}
                      onDelete={() => alert(`Deletando: ${transaction.id}`)}
                    />
                  )
                })}
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Container>
  )
}

export default TransactionList
