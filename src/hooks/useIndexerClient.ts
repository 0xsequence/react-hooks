import { useMemo } from 'react'

import { env } from '../config/networks'
import { useConfig } from './useConfig'

import { SequenceIndexer } from '@0xsequence/indexer'
import { ChainId, networks } from '@0xsequence/network'

export const useIndexerClient = (chainId: number) => {
  const { projectAccessKey } = useConfig()

  const network = networks[chainId as ChainId]

  const indexerClient = useMemo(() => {
    const clientUrl = env.SERVICES.indexer

    return new SequenceIndexer(clientUrl, projectAccessKey)
  }, [projectAccessKey, network])

  return indexerClient
}
