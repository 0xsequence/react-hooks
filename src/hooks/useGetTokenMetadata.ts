import { useQuery } from '@tanstack/react-query'

import { time } from '../constants/hooks'
import { useMetadataClient } from './useMetadataClient'

import { GetTokenMetadataArgs } from '@0xsequence/metadata'

export const useGetTokenMetadata = (
  getTokenMetadataArgs: GetTokenMetadataArgs,
  options?: { disabled?: boolean; retry?: boolean }
) => {
  const metadataClient = useMetadataClient()

  return useQuery({
    queryKey: ['tokenMetadata', getTokenMetadataArgs],
    queryFn: async () => {
      const res = await metadataClient.getTokenMetadata(getTokenMetadataArgs)
      return res
    },
    retry: options?.retry ?? true,
    staleTime: time.oneMinute * 10,
    enabled: !!getTokenMetadataArgs.chainID && !!getTokenMetadataArgs.contractAddress && !options?.disabled
  })
}
