import { useQuery } from '@tanstack/react-query'

import { time } from '../constants/hooks'
import { useIndexerGatewayClient } from './useIndexerGatewayClient'

import { IndexerGateway } from '@0xsequence/indexer'

export const useGetTokenBalancesSummary = (
  getTokenBalancesSummaryArgs: IndexerGateway.GetTokenBalancesSummaryArgs,
  options?: { hideCollectibles?: boolean; disabled?: boolean; retry?: boolean }
) => {
  const indexerGatewayClient = useIndexerGatewayClient()

  return useQuery({
    queryKey: ['tokenBalancesSummary', getTokenBalancesSummaryArgs],
    queryFn: async () => {
      const res = await indexerGatewayClient.getTokenBalancesSummary(getTokenBalancesSummaryArgs)
      return res
    },
    retry: options?.retry ?? true,
    staleTime: time.oneSecond * 30,
    enabled: !!getTokenBalancesSummaryArgs.filter.accountAddresses[0] && !options?.disabled
  })
}
