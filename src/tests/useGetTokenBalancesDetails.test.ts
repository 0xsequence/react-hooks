import { renderHook, waitFor } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'

import { ACCOUNT_ADDRESS } from '../constants/tests'
import { useGetTokenBalancesDetails } from '../hooks/useGetTokenBalancesDetails'
import { createWrapper } from './createWrapper'
import { server } from './setup'

import { ContractVerificationStatus } from '@0xsequence/indexer'
import { GetTokenBalancesDetailsArgs } from '@0xsequence/indexer/dist/declarations/src/indexergw.gen'

const getTokenBalancesDetailsArgs: GetTokenBalancesDetailsArgs = {
  filter: {
    accountAddresses: [ACCOUNT_ADDRESS],
    contractStatus: ContractVerificationStatus.ALL,
    omitNativeBalances: false
  }
}

describe('useGetTokenBalancesDetails', () => {
  it('should return a balance', async () => {
    const { result } = renderHook(() => useGetTokenBalancesDetails(getTokenBalancesDetailsArgs), {
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
      () => useGetTokenBalancesDetails(getTokenBalancesDetailsArgs, { retry: false }),
      {
        wrapper: createWrapper()
      }
    )

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
