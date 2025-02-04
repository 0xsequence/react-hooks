import { useQuery } from '@tanstack/react-query'

import { time } from '../constants/hooks'
import { useIndexerGatewayClient } from './useIndexerGatewayClient'

import { GetTokenBalancesDetailsArgs } from '@0xsequence/indexer/dist/declarations/src/indexergw.gen'

export const useGetTokenBalancesDetails = (
  getTokenBalancesDetailsArgs: GetTokenBalancesDetailsArgs,
  options?: { disabled?: boolean; retry?: boolean }
) => {
  const indexerGatewayClient = useIndexerGatewayClient()

  return useQuery({
    queryKey: ['tokenBalancesDetails', getTokenBalancesDetailsArgs],
    queryFn: async () => {
      const res = await indexerGatewayClient.getTokenBalancesDetails(getTokenBalancesDetailsArgs)
      return res
    },
    retry: options?.retry ?? true,
    staleTime: time.oneSecond * 30,
    enabled: !!getTokenBalancesDetailsArgs.filter.accountAddresses[0] && !options?.disabled
  })
}
