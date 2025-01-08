import { useQuery } from "@tanstack/react-query";
import { useIndexerClient } from "./useIndexerClient";
import { GetTokenBalancesDetailsArgs } from "@0xsequence/indexer";

export const useGetTokenBalancesDetails = (
  getTokenBalancesDetailsArgs: GetTokenBalancesDetailsArgs,
  chainId: number
) => {
  const indexerClient = useIndexerClient(chainId);

  return useQuery({
    queryKey: ["tokenBalancesDetails", getTokenBalancesDetailsArgs, chainId],
    queryFn: async () => {
      const res = await indexerClient.getTokenBalancesDetails(
        getTokenBalancesDetailsArgs
      );

      return res;
    },
  });
};
