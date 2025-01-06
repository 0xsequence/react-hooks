import { useQuery } from "@tanstack/react-query";
import { useIndexerClient } from "./useIndexerClient";

export const useGetNativeTokenBalance = (
  accountAddress: string,
  chainId: number
) => {
  const indexerClient = useIndexerClient(chainId);

  return useQuery({
    queryKey: ["nativeTokenBalance", accountAddress, chainId],
    queryFn: async () => {
      const res = await indexerClient.getNativeTokenBalance({
        accountAddress,
      });

      return res;
    },
  });
};
