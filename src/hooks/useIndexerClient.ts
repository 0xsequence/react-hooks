import { useMemo } from 'react'

import { useConfig } from './useConfig'

import { SequenceIndexer } from '@0xsequence/indexer'
import { ChainId, networks } from '@0xsequence/network'

export const useIndexerClient = (chainId: number) => {
  const { projectAccessKey } = useConfig()

  const network = networks[chainId as ChainId]

  const indexerClient = useMemo(() => {
    const clientUrl = `https://${network.name}-indexer.sequence.app`

    return new SequenceIndexer(clientUrl, projectAccessKey)
  }, [projectAccessKey, network])

  return indexerClient
}
