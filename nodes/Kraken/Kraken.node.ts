import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';

import KrakenClient from 'node-kraken-api';

export class Kraken implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Kraken',
		name: 'kraken',
		icon: 'file:kraken.svg',
		group: ['finance'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Kraken cryptocurrency exchange API',
		defaults: {
			name: 'Kraken',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'krakenApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Account',
						value: 'account',
					},
					{
						name: 'Market Data',
						value: 'marketData',
					},
					{
						name: 'Trading',
						value: 'trading',
					},
				],
				default: 'marketData',
			},
			// Market Data Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['marketData'],
					},
				},
				options: [
					{
						name: 'Get Asset Info',
						value: 'getAssetInfo',
						description: 'Get information about assets',
					},
					{
						name: 'Get Asset Pairs',
						value: 'getAssetPairs',
						description: 'Get tradeable asset pairs',
					},
					{
						name: 'Get Ticker',
						value: 'getTicker',
						description: 'Get ticker information',
					},
					{
						name: 'Get OHLC Data',
						value: 'getOHLC',
						description: 'Get OHLC (candlestick) data',
					},
					{
						name: 'Get Order Book',
						value: 'getOrderBook',
						description: 'Get order book data',
					},
					{
						name: 'Get Recent Trades',
						value: 'getRecentTrades',
						description: 'Get recent trades',
					},
				],
				default: 'getTicker',
			},
			// Account Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['account'],
					},
				},
				options: [
					{
						name: 'Get Account Balance',
						value: 'getBalance',
						description: 'Get account balance',
					},
					{
						name: 'Get Trade Balance',
						value: 'getTradeBalance',
						description: 'Get trade balance',
					},
					{
						name: 'Get Open Orders',
						value: 'getOpenOrders',
						description: 'Get open orders',
					},
					{
						name: 'Get Closed Orders',
						value: 'getClosedOrders',
						description: 'Get closed orders',
					},
					{
						name: 'Get Trades History',
						value: 'getTradesHistory',
						description: 'Get trades history',
					},
				],
				default: 'getBalance',
			},
			// Trading Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['trading'],
					},
				},
				options: [
					{
						name: 'Add Order',
						value: 'addOrder',
						description: 'Place a new order',
					},
					{
						name: 'Cancel Order',
						value: 'cancelOrder',
						description: 'Cancel an existing order',
					},
				],
				default: 'addOrder',
			},
			// Market Data Fields
			{
				displayName: 'Asset Pair',
				name: 'pair',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['marketData'],
						operation: ['getTicker', 'getOHLC', 'getOrderBook', 'getRecentTrades'],
					},
				},
				default: 'XXBTZUSD',
				description: 'Asset pair to get data for (e.g., XXBTZUSD for BTC/USD)',
			},
			{
				displayName: 'Asset',
				name: 'asset',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['marketData'],
						operation: ['getAssetInfo'],
					},
				},
				default: '',
				description: 'Comma-separated list of assets to get info for (leave empty for all)',
			},
			{
				displayName: 'Interval',
				name: 'interval',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['marketData'],
						operation: ['getOHLC'],
					},
				},
				options: [
					{ name: '1 minute', value: 1 },
					{ name: '5 minutes', value: 5 },
					{ name: '15 minutes', value: 15 },
					{ name: '30 minutes', value: 30 },
					{ name: '1 hour', value: 60 },
					{ name: '4 hours', value: 240 },
					{ name: '1 day', value: 1440 },
					{ name: '1 week', value: 10080 },
					{ name: '15 days', value: 21600 },
				],
				default: 60,
				description: 'Time interval for OHLC data',
			},
			{
				displayName: 'Count',
				name: 'count',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['marketData'],
						operation: ['getOrderBook'],
					},
				},
				default: 100,
				description: 'Maximum number of asks/bids',
			},
			// Trading Fields
			{
				displayName: 'Pair',
				name: 'tradingPair',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['trading'],
						operation: ['addOrder'],
					},
				},
				default: 'XXBTZUSD',
				required: true,
				description: 'Asset pair for the order',
			},
			{
				displayName: 'Type',
				name: 'orderType',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['trading'],
						operation: ['addOrder'],
					},
				},
				options: [
					{ name: 'Buy', value: 'buy' },
					{ name: 'Sell', value: 'sell' },
				],
				default: 'buy',
				required: true,
				description: 'Type of order',
			},
			{
				displayName: 'Order Type',
				name: 'orderSubType',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['trading'],
						operation: ['addOrder'],
					},
				},
				options: [
					{ name: 'Market', value: 'market' },
					{ name: 'Limit', value: 'limit' },
				],
				default: 'market',
				required: true,
				description: 'Order subtype',
			},
			{
				displayName: 'Volume',
				name: 'volume',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['trading'],
						operation: ['addOrder'],
					},
				},
				default: '',
				required: true,
				description: 'Order quantity in base asset',
			},
			{
				displayName: 'Price',
				name: 'price',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['trading'],
						operation: ['addOrder'],
						orderSubType: ['limit'],
					},
				},
				default: '',
				description: 'Price for limit orders',
			},
			{
				displayName: 'Transaction ID',
				name: 'txid',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['trading'],
						operation: ['cancelOrder'],
					},
				},
				default: '',
				required: true,
				description: 'Transaction ID of the order to cancel',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const credentials = await this.getCredentials('krakenApi');
		const apiKey = credentials.apiKey as string;
		const apiSecret = credentials.apiSecret as string;
		const sandbox = credentials.sandbox as boolean;

		// Initialize Kraken client
		const kraken = new KrakenClient(apiKey, apiSecret, {
			hostname: sandbox ? 'api.demo-futures.kraken.com' : 'api.kraken.com',
		});

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				let responseData: any;

				if (resource === 'marketData') {
					switch (operation) {
						case 'getAssetInfo':
							const asset = this.getNodeParameter('asset', i) as string;
							responseData = await kraken.api('Assets', asset ? { asset } : {});
							break;

						case 'getAssetPairs':
							responseData = await kraken.api('AssetPairs');
							break;

						case 'getTicker':
							const tickerPair = this.getNodeParameter('pair', i) as string;
							responseData = await kraken.api('Ticker', { pair: tickerPair });
							break;

						case 'getOHLC':
							const ohlcPair = this.getNodeParameter('pair', i) as string;
							const interval = this.getNodeParameter('interval', i) as number;
							responseData = await kraken.api('OHLC', {
								pair: ohlcPair,
								interval,
							});
							break;

						case 'getOrderBook':
							const orderBookPair = this.getNodeParameter('pair', i) as string;
							const count = this.getNodeParameter('count', i) as number;
							responseData = await kraken.api('Depth', {
								pair: orderBookPair,
								count,
							});
							break;

						case 'getRecentTrades':
							const tradesPair = this.getNodeParameter('pair', i) as string;
							responseData = await kraken.api('Trades', { pair: tradesPair });
							break;

						default:
							throw new NodeOperationError(
								this.getNode(),
								`The operation "${operation}" is not known!`,
								{ itemIndex: i },
							);
					}
				} else if (resource === 'account') {
					switch (operation) {
						case 'getBalance':
							responseData = await kraken.api('Balance');
							break;

						case 'getTradeBalance':
							responseData = await kraken.api('TradeBalance');
							break;

						case 'getOpenOrders':
							responseData = await kraken.api('OpenOrders');
							break;

						case 'getClosedOrders':
							responseData = await kraken.api('ClosedOrders');
							break;

						case 'getTradesHistory':
							responseData = await kraken.api('TradesHistory');
							break;

						default:
							throw new NodeOperationError(
								this.getNode(),
								`The operation "${operation}" is not known!`,
								{ itemIndex: i },
							);
					}
				} else if (resource === 'trading') {
					switch (operation) {
						case 'addOrder':
							const pair = this.getNodeParameter('tradingPair', i) as string;
							const type = this.getNodeParameter('orderType', i) as string;
							const ordertype = this.getNodeParameter('orderSubType', i) as string;
							const volume = this.getNodeParameter('volume', i) as string;
							const price = this.getNodeParameter('price', i) as string;

							const orderParams: any = {
								pair,
								type,
								ordertype,
								volume,
							};

							if (ordertype === 'limit' && price) {
								orderParams.price = price;
							}

							responseData = await kraken.api('AddOrder', orderParams);
							break;

						case 'cancelOrder':
							const txid = this.getNodeParameter('txid', i) as string;
							responseData = await kraken.api('CancelOrder', { txid });
							break;

						default:
							throw new NodeOperationError(
								this.getNode(),
								`The operation "${operation}" is not known!`,
								{ itemIndex: i },
							);
					}
				} else {
					throw new NodeOperationError(
						this.getNode(),
						`The resource "${resource}" is not known!`,
						{ itemIndex: i },
					);
				}

				returnData.push({
					json: responseData,
					pairedItem: { item: i },
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: error.message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
