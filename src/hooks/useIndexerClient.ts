import { SequenceIndexer } from "@0xsequence/indexer";
import { ChainId, networks } from "@0xsequence/network";
import { useConfig } from "./useConfig";

export const useIndexerClient = (chainId: number) => {
  const { projectAccessKey } = useConfig();
  const network = networks[chainId as ChainId];

  const clientUrl = `https://${network.name}-indexer.sequence.app`;

  return new SequenceIndexer(clientUrl, projectAccessKey);
};
