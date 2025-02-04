import { useQuery } from '@tanstack/react-query'

import { time } from '../constants/hooks'
import { useIndexerGatewayClient } from './useIndexerGatewayClient'

import { GetNativeTokenBalanceArgs } from '@0xsequence/indexer/dist/declarations/src/indexergw.gen'

export const useGetNativeTokenBalance = (
  getNativeTokenBalanceArgs: GetNativeTokenBalanceArgs,
  options?: { disabled?: boolean; retry?: boolean }
) => {
  const indexerGatewayClient = useIndexerGatewayClient()

  return useQuery({
    queryKey: ['nativeTokenBalance', getNativeTokenBalanceArgs],
    queryFn: async () => {
      const res = await indexerGatewayClient.getNativeTokenBalance(getNativeTokenBalanceArgs)
      return res
    },
    retry: options?.retry ?? true,
    staleTime: time.oneSecond * 30,
    enabled: !!getNativeTokenBalanceArgs.accountAddress && !options?.disabled
  })
}
