import { useQuery } from "@tanstack/react-query";
import { useIndexerClient } from "./useIndexerClient";
import { GetTokenBalancesSummaryArgs } from "@0xsequence/indexer";

export const useGetTokenBalancesSummary = (
  getTokenBalancesSummaryArgs: GetTokenBalancesSummaryArgs,
  chainId: number
) => {
  const indexerClient = useIndexerClient(chainId);

  return useQuery({
    queryKey: ["tokenBalancesSummary", getTokenBalancesSummaryArgs, chainId],
    queryFn: async () => {
      const res = await indexerClient.getTokenBalancesSummary(
        getTokenBalancesSummaryArgs
      );

      return res;
    },
  });
};
