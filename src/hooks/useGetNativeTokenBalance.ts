import { useQuery } from '@tanstack/react-query'

import { time } from '../constants/hooks'
import { useIndexerGatewayClient } from './useIndexerGatewayClient'

import { IndexerGateway } from '@0xsequence/indexer'

export const useGetNativeTokenBalance = (
  getNativeTokenBalanceArgs: IndexerGateway.GetNativeTokenBalanceArgs,
  options?: { disabled?: boolean; retry?: boolean }
) => {
  const indexerGatewayClient = useIndexerGatewayClient()

  return useQuery({
    queryKey: ['nativeTokenBalance', getNativeTokenBalanceArgs],
    queryFn: async () => await indexerGatewayClient.getNativeTokenBalance(getNativeTokenBalanceArgs),
    retry: options?.retry ?? true,
    staleTime: time.oneSecond * 30,
    enabled: !!getNativeTokenBalanceArgs.accountAddress && !options?.disabled
  })
}
