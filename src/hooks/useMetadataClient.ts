import { useMemo } from 'react'

import { env } from '../config/networks'
import { useConfig } from './useConfig'

import { SequenceMetadata } from '@0xsequence/metadata'

export const useMetadataClient = () => {
  const { projectAccessKey } = useConfig()

  const metadataClient = useMemo(() => {
    const clientUrl = env.SERVICES.metadata

    return new SequenceMetadata(clientUrl, projectAccessKey)
  }, [projectAccessKey])

  return metadataClient
}
