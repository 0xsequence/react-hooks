import { useQuery } from '@tanstack/react-query'
import { zeroAddress } from 'viem'

import { time } from '../constants/hooks'
import { NATIVE_TOKEN_ADDRESS_0X } from '../constants/swaps'
import { compareAddress } from '../utils/helpers'
import { useAPIClient } from './useAPIClient'
import { useIndexerGatewayClient } from './useIndexerGatewayClient'
import { useMetadataClient } from './useMetadataClient'

import { SequenceAPIClient, SwapPrice } from '@0xsequence/api'
import { IndexerGateway, SequenceIndexerGateway } from '@0xsequence/indexer'
import { ContractInfo, SequenceMetadata } from '@0xsequence/metadata'
import { findSupportedNetwork } from '@0xsequence/network'

interface Balance {
  balance: string
}

export type SwapPricesWithCurrencyInfo = {
  price: SwapPrice
  info: ContractInfo | undefined
  balance: Balance
}

interface UseGetSwapPricesArgs {
  userAddress: string
  buyCurrencyAddress: string
  buyAmount: string
  chainId: number
  withContractInfo?: boolean
}

const getSwapPrices = async (
  apiClient: SequenceAPIClient,
  metadataClient: SequenceMetadata,
  indexerGatewayClient: SequenceIndexerGateway,
  args: UseGetSwapPricesArgs
): Promise<SwapPricesWithCurrencyInfo[]> => {
  if (
    !args.chainId ||
    !args.userAddress ||
    !args.buyCurrencyAddress ||
    !args.buyAmount ||
    args.buyAmount === '0'
  ) {
    return []
  }

  try {
    const network = findSupportedNetwork(args.chainId)

    const { withContractInfo, ...swapPricesArgs } = args

    const res = await apiClient.getSwapPrices(swapPricesArgs)

    if (res.swapPrices === null) {
      return []
    }

    const currencyInfoMap = new Map<string, Promise<ContractInfo | undefined>>()
    if (withContractInfo) {
      res?.swapPrices.forEach(price => {
        const { currencyAddress: rawCurrencyAddress } = price
        const currencyAddress = compareAddress(rawCurrencyAddress, NATIVE_TOKEN_ADDRESS_0X)
          ? zeroAddress
          : rawCurrencyAddress
        const isNativeToken = compareAddress(currencyAddress, zeroAddress)
        if (currencyAddress && !currencyInfoMap.has(currencyAddress)) {
          const getNativeTokenInfo = () =>
            new Promise<ContractInfo>(resolve => {
              resolve({
                ...network?.nativeToken,
                logoURI: network?.logoURI || '',
                address: zeroAddress
              } as ContractInfo)
            })

          currencyInfoMap.set(
            currencyAddress,
            isNativeToken
              ? getNativeTokenInfo().then(data => {
                  return data
                })
              : metadataClient
                  .getContractInfo({
                    chainID: String(args.chainId),
                    contractAddress: currencyAddress
                  })
                  .then(data => {
                    return {
                      ...data.contractInfo
                    }
                  })
          )
        }
      })
    }

    const currencyBalanceInfoMap = new Map<string, Promise<Balance>>()
    res?.swapPrices.forEach(price => {
      const { currencyAddress: rawCurrencyAddress } = price
      const currencyAddress = compareAddress(rawCurrencyAddress, NATIVE_TOKEN_ADDRESS_0X)
        ? zeroAddress
        : rawCurrencyAddress
      const isNativeToken = compareAddress(currencyAddress, zeroAddress)

      if (currencyAddress && !currencyBalanceInfoMap.has(currencyAddress)) {
        currencyBalanceInfoMap.set(
          currencyAddress,
          isNativeToken
            ? indexerGatewayClient
                .getNativeTokenBalance({
                  accountAddress: args.userAddress,
                  chainIds: [args.chainId]
                })
                .then(res => ({
                  balance: res.balances[0].result.balance
                }))
            : indexerGatewayClient
                .getTokenBalancesSummary({
                  chainIds: [args.chainId],
                  filter: {
                    accountAddresses: [args.userAddress],
                    contractStatus: IndexerGateway.ContractVerificationStatus.VERIFIED,
                    contractWhitelist: [currencyAddress],
                    omitNativeBalances: true
                  }
                })
                .then(res => ({
                  balance: res.balances?.[0].results[0].balance || '0'
                }))
        )
      }
    })

    return Promise.all(
      res?.swapPrices.map(async price => {
        const { currencyAddress: rawCurrencyAddress } = price
        const currencyAddress = compareAddress(rawCurrencyAddress, NATIVE_TOKEN_ADDRESS_0X)
          ? zeroAddress
          : rawCurrencyAddress

        return {
          price: {
            ...price,
            currencyAddress
          },
          info: (await currencyInfoMap.get(currencyAddress)) || undefined,
          balance: (await currencyBalanceInfoMap.get(currencyAddress)) || { balance: '0' }
        }
      }) || []
    )
  } catch (e) {
    console.error(e)
    throw e
  }
}

export const useGetSwapPrices = (
  args: UseGetSwapPricesArgs,
  options?: { retry?: boolean; disabled?: boolean }
) => {
  const apiClient = useAPIClient()
  const metadataClient = useMetadataClient()
  const indexerGatewayClient = useIndexerGatewayClient()

  const enabled =
    !!args.chainId &&
    !!args.userAddress &&
    !!args.buyCurrencyAddress &&
    !!args.buyAmount &&
    args.buyAmount !== '0' &&
    !options?.disabled

  return useQuery({
    queryKey: ['swapPrices', args],
    queryFn: () => getSwapPrices(apiClient, metadataClient, indexerGatewayClient, args),
    retry: options?.retry ?? true,
    // We must keep a long staletime to avoid the list of quotes being refreshed while the user is doing the transactions
    // Instead, we will invalidate the query manually
    staleTime: time.oneHour,
    enabled
  })
}
