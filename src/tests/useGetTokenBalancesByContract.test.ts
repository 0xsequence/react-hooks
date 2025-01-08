import { waitFor, renderHook } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, it, expect } from "vitest";

import { createWrapper } from "./createWrapper";

import { useGetTokenBalancesByContract } from "../hooks/useGetTokenBalancesByContract";
import { server } from "./setup";
import {
  ContractVerificationStatus,
  GetTokenBalancesByContractArgs,
} from "@0xsequence/indexer";

const ACCOUNT_ADDRESS = "0x345458cfD2F0c808455342CD0A6e07a09f893292";

const getTokenBalancesByContractArgs: GetTokenBalancesByContractArgs = {
  filter: {
    accountAddresses: [ACCOUNT_ADDRESS],
    contractStatus: ContractVerificationStatus.ALL,
    contractAddresses: ["0x0000000000000000000000000000000000000000"],
  },
};

describe("useGetTokenBalancesByContract", () => {
  it("should return a balance", async () => {
    const { result } = renderHook(
      () => useGetTokenBalancesByContract(getTokenBalancesByContractArgs, 1),
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
      () => useGetTokenBalancesByContract(getTokenBalancesByContractArgs, 1),
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
