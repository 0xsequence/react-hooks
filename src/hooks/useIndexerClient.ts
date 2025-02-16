import { useMemo } from 'react'

import { env } from '../config/networks'
import { useConfig } from './useConfig'

import { SequenceIndexer } from '@0xsequence/indexer'
import { ChainId, networks } from '@0xsequence/network'

export const useIndexerClient = (chainId: ChainId) => {
  const { projectAccessKey } = useConfig()

  const indexerClients = useMemo(() => {
    return new Map<ChainId, SequenceIndexer>()
  }, [projectAccessKey])

  const network = networks[chainId]
  const clientUrl = env.SERVICES.getIndexerUrl(network.name)

  if (!indexerClients.has(chainId)) {
    indexerClients.set(chainId, new SequenceIndexer(clientUrl, projectAccessKey))
  }

  const indexerClient = indexerClients.get(chainId)

  if (!indexerClient) {
    throw new Error(`Indexer client not found for chainId: ${chainId}, did you forget to add this Chain?`)
  }

  return indexerClient
}

export const useIndexerClients = (chainIds: number[]) => {
  const { projectAccessKey } = useConfig()

  const indexerClients = useMemo(() => {
    return new Map<ChainId, SequenceIndexer>()
  }, [projectAccessKey])

  const result = new Map<ChainId, SequenceIndexer>()

  for (const chainId of chainIds) {
    const network = networks[chainId as ChainId]
    const clientUrl = env.SERVICES.getIndexerUrl(network.name)

    if (!indexerClients.has(chainId)) {
      indexerClients.set(chainId, new SequenceIndexer(clientUrl, projectAccessKey))
    }

    const indexerClient = indexerClients.get(chainId)

    if (!indexerClient) {
      throw new Error(`Indexer client not found for chainId: ${chainId}, did you forget to add this Chain?`)
    }

    result.set(chainId, indexerClient)
  }

  return result
}
