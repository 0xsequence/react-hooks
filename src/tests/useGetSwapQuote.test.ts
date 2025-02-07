import { renderHook, waitFor } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'

import { NATIVE_TOKEN_ADDRESS_0X } from '../constants/swaps'
import { ACCOUNT_ADDRESS } from '../constants/tests'
import { useGetSwapQuote } from '../hooks/useGetSwapQuote'
import { createWrapper } from './createWrapper'
import { server } from './setup'

const getSwapQuoteArgs = {
  userAddress: ACCOUNT_ADDRESS,
  buyCurrencyAddress: NATIVE_TOKEN_ADDRESS_0X,
  sellCurrencyAddress: NATIVE_TOKEN_ADDRESS_0X,
  buyAmount: '20000',
  chainId: 1,
  includeApprove: true
}

describe('useGetSwapQuote', () => {
  it('should return data with a balance', async () => {
    const { result } = renderHook(() => useGetSwapQuote(getSwapQuoteArgs), {
      wrapper: createWrapper()
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()

    const value = BigInt(result.current.data!.currencyBalance || 0)

    expect(value).toBeGreaterThan(0)
  })

  it('should return error when fetching data fails', async () => {
    server.use(
      http.post('*', () => {
        return HttpResponse.error()
      })
    )

    const { result } = renderHook(() => useGetSwapQuote(getSwapQuoteArgs, { retry: false }), {
      wrapper: createWrapper()
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
