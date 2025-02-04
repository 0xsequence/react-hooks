import { useQuery } from '@tanstack/react-query'

import { time } from '../constants/hooks'
import { useIndexerGatewayClient } from './useIndexerGatewayClient'

import { GetTokenBalancesSummaryArgs } from '@0xsequence/indexer/dist/declarations/src/indexergw.gen'

export const useGetTokenBalancesSummary = (
  getTokenBalancesSummaryArgs: GetTokenBalancesSummaryArgs,
  options?: { disabled?: boolean; retry?: boolean }
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
