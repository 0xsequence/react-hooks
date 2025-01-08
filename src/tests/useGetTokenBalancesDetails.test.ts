import { waitFor, renderHook } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, it, expect } from "vitest";

import { createWrapper } from "./createWrapper";

import { useGetTokenBalancesDetails } from "../hooks/useGetTokenBalancesDetails";
import { server } from "./setup";
import {
  ContractVerificationStatus,
  GetTokenBalancesDetailsArgs,
} from "@0xsequence/indexer";

const ACCOUNT_ADDRESS = "0x345458cfD2F0c808455342CD0A6e07a09f893292";

const getTokenBalancesDetailsArgs: GetTokenBalancesDetailsArgs = {
  filter: {
    accountAddresses: [ACCOUNT_ADDRESS],
    contractStatus: ContractVerificationStatus.ALL,
    contractWhitelist: [],
    contractBlacklist: [],
  },
};

describe("useGetTokenBalancesDetails", () => {
  it("should return a balance", async () => {
    const { result } = renderHook(
      () => useGetTokenBalancesDetails(getTokenBalancesDetailsArgs, 1),
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();

    const value = BigInt(result.current.data!.balances[0].balance || 0);

    expect(value).toBeGreaterThan(0);
  });

  it("should return error when fetching balance fails", async () => {
    server.use(
      http.post("*", () => {
        return HttpResponse.error();
      })
    );

    const { result } = renderHook(
      () => useGetTokenBalancesDetails(getTokenBalancesDetailsArgs, 1),
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
