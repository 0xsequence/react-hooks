import { renderHook, waitFor } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'

import { useGetTokenMetadata } from '../hooks/useGetTokenMetadata'
import { createWrapper } from './createWrapper'
import { server } from './setup'

import { GetTokenMetadataArgs } from '@0xsequence/metadata'

const getTokenMetadataArgs: GetTokenMetadataArgs = {
  chainID: '1',
  contractAddress: '0x0000000000000000000000000000000000000000',
  tokenIDs: ['1']
}

describe('useGetTokenMetadata', () => {
  it('should return a balance', async () => {
    const { result } = renderHook(() => useGetTokenMetadata(getTokenMetadataArgs), {
      wrapper: createWrapper()
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()

    const value = (result.current.data!.tokenMetadata[0].name || '')

    expect(value).toBe('Test')
  })

  it('should return error when fetching balance fails', async () => {
    server.use(
      http.post('*', () => {
        return HttpResponse.error()
      })
    )

    const { result } = renderHook(() => useGetTokenMetadata(getTokenMetadataArgs, { retry: false }), {
      wrapper: createWrapper()
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
