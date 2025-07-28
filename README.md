# n8n-nodes-kraken

This package provides n8n community nodes for integrating with the Kraken cryptocurrency exchange API.

> ⚠️ **Disclaimer**
>
> This package is considered production-ready for the author's use case, but broader testing is ongoing.
>
> While `n8n-nodes-kraken` has proven stable in real-world usage, it has not yet been widely tested across diverse workflows. Users are encouraged to try it out and report any issues or feature requests.
>
> **Breaking changes may still occur** as community feedback is incorporated and the feature set evolves.

## Features

The Kraken node supports the following operations:

### Market Data
- Get Asset Info - Retrieve information about assets
- Get Asset Pairs - Get tradeable asset pairs
- Get Ticker - Get ticker information for trading pairs
- Get OHLC Data - Get candlestick/OHLC data
- Get Order Book - Get order book data
- Get Recent Trades - Get recent trade history

### Account Operations
- Get Account Balance - Retrieve account balance
- Get Trade Balance - Get trade balance information
- Get Open Orders - List open orders
- Get Closed Orders - List closed orders
- Get Trades History - Get account trade history

### Trading Operations
- Add Order - Place buy/sell orders (market or limit)
- Cancel Order - Cancel existing orders

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Credentials

You need to create Kraken API credentials:

1. Log into your Kraken account
2. Go to Settings → API
3. Generate a new API key with the required permissions
4. Use the API key and secret in n8n

### Required Permissions

For basic market data operations, no special permissions are required.

For account and trading operations, you'll need:
- Query Funds
- Query Open Orders
- Query Closed Orders
- Query Ledger Entries
- Create & Modify Orders (for trading)
- Cancel & Close Orders (for trading)

## Usage

1. Add the Kraken node to your workflow
2. Configure your Kraken API credentials
3. Select the resource and operation you want to perform
4. Configure the required parameters
5. Execute the workflow

## Examples

### Get Bitcoin Price
- Resource: Market Data
- Operation: Get Ticker
- Asset Pair: XXBTZUSD

### Check Account Balance
- Resource: Account
- Operation: Get Account Balance

### Place a Market Order
- Resource: Trading
- Operation: Add Order
- Pair: XXBTZUSD
- Type: Buy
- Order Type: Market
- Volume: 0.001

## Supported Asset Pairs

Common asset pairs include:
- XXBTZUSD (Bitcoin/USD)
- XETHZUSD (Ethereum/USD)
- ADAUSD (Cardano/USD)
- SOLUSD (Solana/USD)

For a complete list, use the "Get Asset Pairs" operation.

## Links

- [Kraken API Documentation](https://docs.kraken.com/rest/)
- [n8n Community Nodes](https://docs.n8n.io/integrations/community-nodes/)

## License

[MIT](LICENSE.md)
