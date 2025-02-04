import { renderHook, waitFor } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'

import { ACCOUNT_ADDRESS } from '../constants/tests'
import { useGetTokenBalancesSummary } from '../hooks/useGetTokenBalancesSummary'
import { createWrapper } from './createWrapper'
import { server } from './setup'

import { ContractVerificationStatus } from '@0xsequence/indexer'
import { GetTokenBalancesSummaryArgs } from '@0xsequence/indexer/dist/declarations/src/indexergw.gen'

const getTokenBalancesSummaryArgs: GetTokenBalancesSummaryArgs = {
  filter: {
    accountAddresses: [ACCOUNT_ADDRESS],
    contractStatus: ContractVerificationStatus.ALL,
    omitNativeBalances: false
  }
}

describe('useGetTokenBalancesSummary', () => {
  it('should return a balance', async () => {
    const { result } = renderHook(() => useGetTokenBalancesSummary(getTokenBalancesSummaryArgs), {
      wrapper: createWrapper()
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeDefined()

    const value = BigInt(result.current.data!.balances[0].results[0].balance || 0)

    expect(value).toBeGreaterThan(0)
  })

  it('should return error when fetching balance fails', async () => {
    server.use(
      http.post('*', () => {
        return HttpResponse.error()
      })
    )

    const { result } = renderHook(
      () => useGetTokenBalancesSummary(getTokenBalancesSummaryArgs, { retry: false }),
      {
        wrapper: createWrapper()
      }
    )

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
