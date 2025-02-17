import { useMemo } from 'react'

import { env } from '../config/networks'
import { useConfig } from './useConfig'

import { SequenceIndexerGateway } from '@0xsequence/indexer'

export const useIndexerGatewayClient = () => {
  const { projectAccessKey } = useConfig()

  const indexerGatewayClient = useMemo(() => {
    const clientUrl = env.SERVICES.indexerGateway

    return new SequenceIndexerGateway(clientUrl, projectAccessKey)
  }, [projectAccessKey])

  return indexerGatewayClient
}
