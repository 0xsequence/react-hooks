import { useQuery } from "@tanstack/react-query";
import { useIndexerClient } from "./useIndexerClient";
import { GetTokenBalancesByContractArgs } from "@0xsequence/indexer";

export const useGetTokenBalancesByContract = (
  getTokenBalancesByContractArgs: GetTokenBalancesByContractArgs,
  chainId: number
) => {
  const indexerClient = useIndexerClient(chainId);

  return useQuery({
    queryKey: [
      "tokenBalancesByContract",
      getTokenBalancesByContractArgs,
      chainId,
    ],
    queryFn: async () => {
      const res = await indexerClient.getTokenBalancesByContract(
        getTokenBalancesByContractArgs
      );

      return res;
    },
  });
};
