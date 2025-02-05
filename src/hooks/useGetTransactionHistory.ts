import { useQuery } from '@tanstack/react-query'

import { time } from '../constants/hooks'
import { useIndexerClient } from './useIndexerClient'

import { GetTransactionHistoryArgs } from '@0xsequence/indexer'

export const useGetTransactionHistory = (
  getTransactionHistoryArgs: GetTransactionHistoryArgs,
  chainId: number,
  options?: { disabled?: boolean; retry?: boolean }
) => {
  const indexerClient = useIndexerClient(chainId)

  return useQuery({
    queryKey: ['transactionHistory', getTransactionHistoryArgs],
    queryFn: async () => {
      const res = await indexerClient.getTransactionHistory(getTransactionHistoryArgs)
      return res
    },
    retry: options?.retry ?? true,
    staleTime: time.oneSecond * 30,
    enabled: !!getTransactionHistoryArgs.filter.accountAddress && !options?.disabled
  })
}
