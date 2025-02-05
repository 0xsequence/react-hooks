import { useMemo } from 'react'

import { useConfig } from './useConfig'

import { SequenceAPIClient } from '@0xsequence/api'

export const useAPIClient = () => {
  const { projectAccessKey } = useConfig()

  const apiClient = useMemo(() => {
    const clientUrl = 'https://api.sequence.app'

    return new SequenceAPIClient(clientUrl, projectAccessKey)
  }, [projectAccessKey])

  return apiClient
}
