import { useQuery } from '@tanstack/react-query'

import { time } from '../constants/hooks'
import { useIndexerGatewayClient } from './useIndexerGatewayClient'

import { IndexerGateway } from '@0xsequence/indexer'

export const useGetTokenBalancesByContract = (
  getTokenBalancesByContractArgs: IndexerGateway.GetTokenBalancesByContractArgs,
  options?: { hideCollectibles?: boolean; disabled?: boolean; retry?: boolean }
) => {
  const indexerGatewayClient = useIndexerGatewayClient()

  return useQuery({
    queryKey: ['tokenBalancesByContract', getTokenBalancesByContractArgs, options],
    queryFn: async () => {
      const res = await indexerGatewayClient.getTokenBalancesByContract(getTokenBalancesByContractArgs)
      return res
    },
    retry: options?.retry ?? true,
    staleTime: time.oneSecond * 30,
    enabled: !!getTokenBalancesByContractArgs.filter.accountAddresses?.[0] && !options?.disabled
  })
}
