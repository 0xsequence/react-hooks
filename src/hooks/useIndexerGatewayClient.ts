import { useMemo } from 'react'

import { useConfig } from './useConfig'

import { SequenceIndexerGateway } from '@0xsequence/indexer'

export const useIndexerGatewayClient = () => {
  const { projectAccessKey } = useConfig()

  const indexerGatewayClient = useMemo(() => {
    const clientUrl = 'https://indexer.sequence.app'

    return new SequenceIndexerGateway(clientUrl, projectAccessKey)
  }, [projectAccessKey])

  return indexerGatewayClient
}
