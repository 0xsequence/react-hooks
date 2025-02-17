import { renderHook, waitFor } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'

import { ACCOUNT_ADDRESS } from '../constants/tests'
import { useGetTransactionHistorySummary } from '../hooks/useGetTransactionHistorySummary'
import { createWrapper } from './createWrapper'
import { server } from './setup'

import { GetTransactionHistoryArgs } from '@0xsequence/indexer'

const getTransactionHistorySummaryArgs: GetTransactionHistoryArgs = {
  filter: {
    accountAddress: ACCOUNT_ADDRESS
  }
}

describe('useGetTransactionHistorySummary', () => {
  it('should return data with a transaction', async () => {
    const { result } = renderHook(
      () => useGetTransactionHistorySummary(getTransactionHistorySummaryArgs, [1]),
      {
        wrapper: createWrapper()
      }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()

    const value = BigInt(result.current.data![0].txnHash || '')

    expect(value).toBeDefined()
  })

  it('should return error when fetching data fails', async () => {
    server.use(
      http.post('*', () => {
        return HttpResponse.error()
      })
    )

    const { result } = renderHook(
      () => useGetTransactionHistorySummary(getTransactionHistorySummaryArgs, [1], { retry: false }),
      {
        wrapper: createWrapper()
      }
    )

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
