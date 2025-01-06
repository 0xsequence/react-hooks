import { waitFor, renderHook } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, it, expect } from "vitest";

import { createWrapper } from "./createWrapper";

import { useGetNativeTokenBalance } from "../hooks/useGetNativeTokenBalance";
import { server } from "./setup";

const ACCOUNT_ADDRESS = "0x345458cfD2F0c808455342CD0A6e07a09f893292";

describe("useGetNativeTokenBalance", () => {
  it("should return a balance", async () => {
    const { result } = renderHook(
      () => useGetNativeTokenBalance(ACCOUNT_ADDRESS, 1),
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();

    const value = BigInt(result.current.data!.balance.balance || 0);

    expect(value).toBeGreaterThan(0);
  });

  it("should return error when fetching balance fails", async () => {
    server.use(
      http.post("*", () => {
        return HttpResponse.error();
      })
    );

    const { result } = renderHook(
      () => useGetNativeTokenBalance(ACCOUNT_ADDRESS, 1),
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
