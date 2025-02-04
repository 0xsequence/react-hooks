import { useMemo } from 'react'

import { useConfig } from './useConfig'

import { SequenceMetadata } from '@0xsequence/metadata'

export const useMetadataClient = () => {
  const { projectAccessKey } = useConfig()

  const metadataClient = useMemo(() => {
    const clientUrl = 'https://metadata.sequence.app'

    return new SequenceMetadata(clientUrl, projectAccessKey)
  }, [projectAccessKey])

  return metadataClient
}
