export const env = {
  SERVICES: {
    sequenceApi: 'https://api.sequence.app',
    metadata: 'https://metadata.sequence.app',
    getIndexerUrl: (networkName: string) => `https://${networkName}-indexer.sequence.app`,
    indexerGateway: 'https://indexer.sequence.app',
    imageProxy: 'https://imgproxy.sequence.xyz/'
  }
}
