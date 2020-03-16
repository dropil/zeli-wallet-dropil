export default {
  'mainnet': {
    'cosmoshub-3': {
      chainId: 'cosmoshub-3',
      chainName: 'Cosmos Hub',
      environment: 'Mainnet',
      environmentLower: 'mainnet',
      chainAndEnvironment: 'Cosmos Hub Mainnet',
      websiteUrl: 'https://cosmos.network',
      websiteUrlShort: 'cosmos.network',
      docsUrl: 'https://hub.cosmos.network',
      docsUrlShort: 'hub.cosmos.network',
      infoDocsUrl: 'https://hub.cosmos.network',
      infoDocsUrlShort: 'hub.cosmos.network',
      apiDocsUrl: 'https://cosmos.network/api',
      apiDocsUrlShort: 'cosmos.network/api',
      explorerUrl: 'https://mintscan.io',
      explorerUrlShort: 'mintscan.io',
      explorerTransactionEndpoint: '/txs/',
      explorerValidatorEndpoint: '/validators/',
      explorerAccountEndpoint: '/account/',
      apiUrl: 'https://api.cosmos.network',
      apiUrlShort: 'api.cosmos.network',
      coin: 'Cosmos',
      coinGeckoId: 'cosmos',
      denom: 'uatom',
      ticker: 'ATOM',
      tickerLower: 'atom',
      tickerPlural: 'Atoms',
      bech32Prefix: 'cosmos',
      hdPath: "m/44'/118'/0'/0/0",
      mnemonicLengths: '12/16/24',
      baseFee: 5000, //denom
      baseFeeCoin: 0.005, //coin
      baseGas: 200000, // denom
      powerReduction: 1000000,
      decimals: 6
    },
    'irishub': {

    }
  },
  'testnet': {

  },
  'development': {
    'dropilchain-testnet': {
      chainId: 'dropilchain-testnet',
      chainName: 'Dropil Chain',
      environment: 'Testnet',
      environmentLower: 'testnet',
      chainAndEnvironment: 'Dropil Chain Testnet',
      websiteUrl: 'https://dropilchain.com',
      websiteUrlShort: 'dropilchain.com',
      docsUrl: 'https://docs.dropilchain.com',
      docsUrlShort: 'docs.dropilchain.com',
      infoDocsUrl: 'https://docs.dropilchain.com/info',
      infoDocsUrlShort: 'docs.dropilchain.com/info',
      apiDocsUrl: 'https://docs.dropilchain.com/api',
      apiDocsUrlShort: 'docs.dropilchain.com/api',
      explorerUrl: 'https://testnet-explorer.dropilchain.com',	
      explorerUrlShort: 'testnet-explorer.dropilchain.com',	
      explorerTransactionEndpoint: '/transactions/',
      explorerValidatorEndpoint: '/validator/',
      explorerAccountEndpoint: '/account/',
      apiUrl: 'https://testnet-api.dropilchain.com',
      apiUrlShort: 'testnet-api.dropilchain.com',
      coin: 'Dropil',
      coinGeckoId: 'dropil',
      denom: 'udrop',
      ticker: 'DROP',
      tickerLower: 'drop',
      tickerPlural: 'Drops',
      bech32Prefix: 'drop',
      hdPath: "m/44'/118'/0'/0/0",    
      mnemonicLengths: '24',
      baseFee: 1000000, //denom (udrop)
      baseFeeCoin: 1, //coin (DROP)
      baseGas: 200000,
      powerReduction: 1000000,
      decimals: 6
    }
  }    
}