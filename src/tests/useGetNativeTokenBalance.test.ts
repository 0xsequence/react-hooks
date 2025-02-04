import { renderHook, waitFor } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'

import { ACCOUNT_ADDRESS } from '../constants/tests'
import { useGetNativeTokenBalance } from '../hooks/useGetNativeTokenBalance'
import { createWrapper } from './createWrapper'
import { server } from './setup'

describe('useGetNativeTokenBalance', () => {
  it('should return a balance', async () => {
    const { result } = renderHook(
      () =>
        useGetNativeTokenBalance({
          accountAddress: ACCOUNT_ADDRESS
        }),
      {
        wrapper: createWrapper()
      }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()

    const value = BigInt(result.current.data!.balances[0].result.balance || 0)

    expect(value).toBeGreaterThan(0)
  })

  it('should return error when fetching balance fails', async () => {
    server.use(
      http.post('*', () => {
        return HttpResponse.error()
      })
    )

    const { result } = renderHook(
      () =>
        useGetNativeTokenBalance({
          accountAddress: ACCOUNT_ADDRESS
        }, { retry: false }),
      {
        wrapper: createWrapper()
      }
    )

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
