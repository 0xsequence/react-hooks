import { useQuery } from '@tanstack/react-query'
import { zeroAddress } from 'viem'

import { time } from '../constants/hooks'
import { NATIVE_TOKEN_ADDRESS_0X } from '../constants/swaps'
import { compareAddress } from '../utils/helpers'
import { useAPIClient } from './useAPIClient'

import { GetSwapQuoteArgs } from '@0xsequence/api'

export const useGetSwapQuote = (
  getSwapQuoteArgs: GetSwapQuoteArgs,
  options?: { disabled?: boolean; retry?: boolean }
) => {
  const apiClient = useAPIClient()

  return useQuery({
    queryKey: ['swapQuotes', getSwapQuoteArgs],
    queryFn: async () => {
      const res = await apiClient.getSwapQuote({
        ...getSwapQuoteArgs,
        buyCurrencyAddress: compareAddress(getSwapQuoteArgs.buyCurrencyAddress, zeroAddress)
          ? NATIVE_TOKEN_ADDRESS_0X
          : getSwapQuoteArgs.buyCurrencyAddress,
        sellCurrencyAddress: compareAddress(getSwapQuoteArgs.sellCurrencyAddress, zeroAddress)
          ? NATIVE_TOKEN_ADDRESS_0X
          : getSwapQuoteArgs.sellCurrencyAddress
      })

      return {
        ...res.swapQuote,
        currencyAddress: compareAddress(res.swapQuote.currencyAddress, NATIVE_TOKEN_ADDRESS_0X)
          ? zeroAddress
          : res.swapQuote.currencyAddress
      }
    },
    retry: options?.retry ?? true,
    staleTime: time.oneMinute * 1,
    enabled:
      !options?.disabled ||
      !getSwapQuoteArgs.userAddress ||
      !getSwapQuoteArgs.chainId ||
      !getSwapQuoteArgs.buyCurrencyAddress
  })
}
