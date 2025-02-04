import { useQuery } from '@tanstack/react-query'

import { time } from '../constants/hooks'
import { useIndexerGatewayClient } from './useIndexerGatewayClient'

import { GetTokenBalancesByContractArgs } from '@0xsequence/indexer/dist/declarations/src/indexergw.gen'

export const useGetTokenBalancesByContract = (
  getTokenBalancesByContractArgs: GetTokenBalancesByContractArgs,
  options?: { disabled?: boolean; retry?: boolean }
) => {
  const indexerGatewayClient = useIndexerGatewayClient()

  return useQuery({
    queryKey: ['tokenBalancesByContract', getTokenBalancesByContractArgs],
    queryFn: async () => {
      const res = await indexerGatewayClient.getTokenBalancesByContract(getTokenBalancesByContractArgs)
      return res
    },
    retry: options?.retry ?? true,
    staleTime: time.oneSecond * 30,
    enabled: !!getTokenBalancesByContractArgs.filter.accountAddresses?.[0] && !options?.disabled
  })
}
