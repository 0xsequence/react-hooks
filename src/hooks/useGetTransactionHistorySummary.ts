import { useQuery } from '@tanstack/react-query'

import { time } from '../constants/hooks'
import { useIndexerClients } from './useIndexerClient'

import { GetTransactionHistoryArgs, SequenceIndexer, Transaction } from '@0xsequence/indexer'

const getTransactionHistorySummary = async (
  indexerClients: Map<number, SequenceIndexer>,
  getTransactionHistoryArgs: GetTransactionHistoryArgs
): Promise<Transaction[]> => {
  const histories = await Promise.all(
    Array.from(indexerClients.values()).map(indexerClient =>
      indexerClient.getTransactionHistory(getTransactionHistoryArgs)
    )
  )

  const unorderedTransactions = histories.map(history => history.transactions).flat()
  const orderedTransactions = unorderedTransactions.sort((a, b) => {
    const firstDate = new Date(a.timestamp).getTime()
    const secondDate = new Date(b.timestamp).getTime()
    return secondDate - firstDate
  })

  return orderedTransactions
}

export const useGetTransactionHistorySummary = (
  getTransactionHistoryArgs: GetTransactionHistoryArgs,
  chainIds: number[],
  options?: { disabled?: boolean; retry?: boolean }
) => {
  const indexerClients = useIndexerClients(chainIds)

  return useQuery({
    queryKey: ['transactionHistory', getTransactionHistoryArgs, options],
    queryFn: async () => {
      return await getTransactionHistorySummary(indexerClients, getTransactionHistoryArgs)
    },
    retry: options?.retry ?? true,
    staleTime: time.oneSecond,
    refetchOnMount: true,
    enabled: chainIds.length > 0 && !!getTransactionHistoryArgs.filter.accountAddress && !options?.disabled
  })
}
