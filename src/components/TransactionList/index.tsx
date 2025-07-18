import React from 'react'

import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { TransactionItem, UserInfo } from 'utilUi/components'
import { Container } from './styles'

interface TransactionData {
  id: number
  type: 'expense' | 'income'
  title: string
  date: string
  amount: number
}

const mockUser = {
  name: 'Alice Silva',
  avatarUrl: undefined
}

const mockTransactions: TransactionData[] = [
  {
    id: 1,
    type: 'expense',
    title: 'Restaurante',
    date: '2025-07-15',
    amount: 80.0
  },
  {
    id: 2,
    type: 'income',
    title: 'Freelance',
    date: '2025-07-05',
    amount: 400.0
  },
  {
    id: 3,
    type: 'income',
    title: 'Salário',
    date: '2025-07-05',
    amount: 500.0
  },
  {
    id: 4,
    type: 'expense',
    title: 'Restaurante',
    date: '2025-06-15',
    amount: 80.0
  },
  {
    id: 5,
    type: 'income',
    title: 'Freelance',
    date: '2025-06-05',
    amount: 400.0
  },
  {
    id: 6,
    type: 'income',
    title: 'Salário',
    date: '2025-06-05',
    amount: 500.0
  }
]

const TransactionList: React.FC = () => {
  const groupedTransactions = mockTransactions.reduce(
    (acc, transaction) => {
      const month = new Date(transaction.date).toLocaleString('pt-BR', {
        month: 'long'
      })
      const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1)

      if (!acc[capitalizedMonth]) {
        acc[capitalizedMonth] = []
      }
      acc[capitalizedMonth].push(transaction)
      return acc
    },
    {} as Record<string, TransactionData[]>
  )

  const handleEdit = (id: number) => alert(`Editando transação #${id}`)
  const handleDelete = (id: number) => alert(`Deletando transação #${id}`)

  const formatAmount = (type: 'expense' | 'income', amount: number) =>
    `${type === 'expense' ? '-' : '+'} R$ ${amount.toFixed(2).replace('.', ',')}`

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    })

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
          <UserInfo name={mockUser.name} avatarUrl={mockUser.avatarUrl} />
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

        <Stack spacing={2}>
          {Object.entries(groupedTransactions).map(([month, transactions]) => (
            <Box key={month}>
              <Typography
                variant="subtitle1"
                color="text.primary"
                sx={{ mb: 1.5 }}
              >
                {month}
              </Typography>

              <Stack spacing={1}>
                {transactions.map((transaction) => (
                  <TransactionItem
                    key={transaction.id}
                    transactionType={transaction.type}
                    title={transaction.title}
                    date={formatDate(transaction.date)}
                    amount={formatAmount(transaction.type, transaction.amount)}
                    onEdit={() => handleEdit(transaction.id)}
                    onDelete={() => handleDelete(transaction.id)}
                  />
                ))}
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Container>
  )
}

export default TransactionList
