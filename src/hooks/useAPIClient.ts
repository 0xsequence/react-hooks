import { useMemo } from 'react'

import { env } from '../config/networks'
import { useConfig } from './useConfig'

import { SequenceAPIClient } from '@0xsequence/api'

export const useAPIClient = () => {
  const { projectAccessKey } = useConfig()

  const apiClient = useMemo(() => {
    const clientUrl = env.SERVICES.sequenceApi

    return new SequenceAPIClient(clientUrl, projectAccessKey)
  }, [projectAccessKey])

  return apiClient
}
