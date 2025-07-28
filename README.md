# n8n-nodes-kraken

This package provides an n8n node with multiple operations to utilize the Kraken cryptocurrency exchange API.

> ⚠️ **Disclaimer**
>
> This package is considered production-ready for the author's use case, but broader testing is ongoing.
>
> While `n8n-nodes-kraken` has proven stable in real-world usage, it has not yet been widely tested across diverse workflows. Users are encouraged to try it out and report any issues or feature requests.

> ⚠️ **Important Notice on Real-World Usage**
>
> This package enables direct interaction with the Kraken cryptocurrency exchange via the `node-kraken-api` wrapper. It is capable of placing **live orders** that involve **real funds**.
>

> ⚠️ **No Sandbox or Test Mode Available (yet)**
> 
> The underlying dependency (`node-kraken-api`) does not support Kraken's sandbox environment. As a result, **all trades executed through this node are real and will affect your actual Kraken account balance.**
>
> Please use this node with extreme caution. Ensure that your workflows are thoroughly tested in a safe environment before executing any operations on live accounts. The author is not responsible for any financial losses or unintended trades resulting from the use of this package.
>
> **Double-check your credentials, order parameters, and automation logic before executing any of the [Trading Operations](https://github.com/DirectorVector/n8n-nodes-kraken/edit/master/README.md#trading-operations).**


## Features

The Kraken node supports the following operations:

### Market Data
- [Get Asset Info](https://docs.kraken.com/api/docs/rest-api/get-asset-info) - Retrieve information about assets
- [Get Asset Pairs](https://docs.kraken.com/api/docs/rest-api/get-tradable-asset-pairs) - Get tradeable asset pairs
- [Get Ticker](https://docs.kraken.com/api/docs/rest-api/get-ticker-information) - Get ticker information for trading pairs
- [Get OHLC Data](https://docs.kraken.com/api/docs/rest-api/get-ohlc-data) - Get candlestick/OHLC data
- [Get Order Book](https://docs.kraken.com/api/docs/rest-api/get-order-book) - Get order book data
- [Get Recent Trades](https://docs.kraken.com/api/docs/rest-api/get-recent-trades) - Get recent trade history

### Account Operations
- [Get Account Balance](https://docs.kraken.com/api/docs/rest-api/get-account-balance) - Retrieve account balance
- [Get Trade Balance](https://docs.kraken.com/api/docs/rest-api/get-trade-balance) - Get trade balance information
- [Get Open Orders](https://docs.kraken.com/api/docs/rest-api/get-open-orders) - List open orders
- [Get Closed Orders](https://docs.kraken.com/api/docs/rest-api/get-closed-orders) - List closed orders
- [Get Trades History](https://docs.kraken.com/api/docs/rest-api/get-trade-history) - Get account trade history

### Trading Operations
- [Add Order](https://docs.kraken.com/api/docs/rest-api/add-order/) - Place buy/sell orders (market or limit)
- [Cancel Order](https://docs.kraken.com/api/docs/rest-api/cancel-order/) - Cancel existing orders

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Credentials

You need to create Kraken API credentials:

1. Log into your Kraken account thru [Kraken Pro](https://pro.kraken.com/) - *must use Kraken Pro for API
2. Go to Settings → API
3. Generate a new API key with the required permissions - Start with "Query Funds" to get your balance and increase permissions as you test out the node
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
