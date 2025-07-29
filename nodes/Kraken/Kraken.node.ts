import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';

import { Kraken as KrakenClient } from 'node-kraken-api';

export class Kraken implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Kraken',
		name: 'kraken',
		icon: 'file:krakenPro.svg',
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
						action: 'Get asset info',
					},
					{
						name: 'Get Asset Pairs',
						value: 'getAssetPairs',
						description: 'Get tradeable asset pairs',
						action: 'Get asset pairs',
					},
					{
						name: 'Get OHLC Data',
						value: 'getOHLC',
						description: 'Get OHLC (candlestick) data',
						action: 'Get ohlc data',
					},
					{
						name: 'Get Order Book',
						value: 'getOrderBook',
						description: 'Get order book data',
						action: 'Get order book',
					},
					{
						name: 'Get Recent Trades',
						value: 'getRecentTrades',
						action: 'Get recent trades',
					},
					{
						name: 'Get Ticker',
						value: 'getTicker',
						description: 'Get ticker information',
						action: 'Get ticker',
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
						action: 'Get account balance',
					},
					{
						name: 'Get Closed Orders',
						value: 'getClosedOrders',
						action: 'Get closed orders',
					},
					{
						name: 'Get Open Orders',
						value: 'getOpenOrders',
						action: 'Get open orders',
					},
					{
						name: 'Get Trade Balance',
						value: 'getTradeBalance',
						action: 'Get trade balance',
					},
					{
						name: 'Get Trades History',
						value: 'getTradesHistory',
						action: 'Get trades history',
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
						action: 'Add order',
					},
					{
						name: 'Cancel Order',
						value: 'cancelOrder',
						description: 'Cancel an existing order',
						action: 'Cancel an existing order',
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
					{ name: '1 Minute', value: 1 },
					{ name: '5 Minutes', value: 5 },
					{ name: '15 Minutes', value: 15 },
					{ name: '30 Minutes', value: 30 },
					{ name: '1 Hour', value: 60 },
					{ name: '4 Hours', value: 240 },
					{ name: '1 Day', value: 1440 },
					{ name: '1 Week', value: 10080 },
					{ name: '15 Days', value: 21600 },
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
					{ name: 'Limit', value: 'limit' },
					{ name: 'Market', value: 'market' },
					{ name: 'Settle Position', value: 'settle-position' },
					{ name: 'Stop Loss', value: 'stop-loss' },
					{ name: 'Stop Loss Limit', value: 'stop-loss-limit' },
					{ name: 'Take Profit', value: 'take-profit' },
					{ name: 'Take Profit Limit', value: 'take-profit-limit' },
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
						orderSubType: ['limit', 'stop-loss-limit', 'take-profit-limit'],
					},
				},
				default: '',
				required: true,
				description: 'Price for limit orders',
			},
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				displayOptions: {
					show: {
						resource: ['trading'],
						operation: ['addOrder'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Close Order Type',
						name: 'closeOrderType',
						type: 'options',
						options: [
							{ name: 'Limit', value: 'limit' },
							{ name: 'Stop Loss', value: 'stop-loss' },
							{ name: 'Stop Loss Limit', value: 'stop-loss-limit' },
							{ name: 'Take Profit', value: 'take-profit' },
							{ name: 'Take Profit Limit', value: 'take-profit-limit' },
						],
						default: 'limit',
						description: 'Conditional close order type',
					},
					{
						displayName: 'Close Price',
						name: 'closePrice',
						type: 'string',
						default: '',
						description: 'Conditional close order price',
					},
					{
						displayName: 'Close Price 2',
						name: 'closePrice2',
						type: 'string',
						default: '',
						description: 'Conditional close order secondary price',
					},
					{
						displayName: 'Expire Time',
						name: 'expiretm',
						type: 'string',
						default: '',
						description: 'Expiration time (Unix timestamp or +&lt;n&gt; for relative time)',
					},
					{
						displayName: 'Leverage',
						name: 'leverage',
						type: 'string',
						default: '',
						description: 'Amount of leverage desired (default: none)',
					},
					{
						displayName: 'Order Flags',
						name: 'oflags',
						type: 'multiOptions',
						options: [
							{ name: 'No Market Price Protection', value: 'nompp' },
							{ name: 'Post Only', value: 'post' },
							{ name: 'Prefer Fee in Base Currency', value: 'fcib' },
							{ name: 'Prefer Fee in Quote Currency', value: 'fciq' },
							{ name: 'Volume in Quote Currency', value: 'viqc' },
						],
						default: [],
						description: 'Order flags (comma-separated)',
					},
					{
						displayName: 'Price 2',
						name: 'price2',
						type: 'string',
						default: '',
						description: 'Secondary price (for stop-loss and take-profit orders)',
					},
					{
						displayName: 'Start Time',
						name: 'starttm',
						type: 'string',
						default: '',
						description: 'Scheduled start time (Unix timestamp or +&lt;n&gt; for relative time)',
					},
					{
						displayName: 'Time in Force',
						name: 'timeinforce',
						type: 'options',
						options: [
							{ name: 'Fill or Kill', value: 'FOK' },
							{ name: 'Good Till Cancelled', value: 'GTC' },
							{ name: 'Immediate or Cancel', value: 'IOC' },
						],
						default: 'GTC',
						description: 'Time in force policy',
					},
					{
						displayName: 'User Reference ID',
						name: 'userref',
						type: 'number',
						default: 0,
						description: 'User reference ID for order tracking',
					},
					{
						displayName: 'Validate Only',
						name: 'validate',
						type: 'boolean',
						default: false,
						description: 'Whether to validate inputs only. Do not submit order.',
					},
				],
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

		// Initialize Kraken client
		const kraken = new KrakenClient({
			key: apiKey,
			secret: apiSecret,
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
							responseData = await kraken.assets(asset ? { asset } : {});
							break;

						case 'getAssetPairs':
							responseData = await kraken.assetPairs();
							break;

						case 'getTicker':
							const tickerPair = this.getNodeParameter('pair', i) as string;
							responseData = await kraken.ticker({ pair: tickerPair });
							break;

						case 'getOHLC':
							const ohlcPair = this.getNodeParameter('pair', i) as string;
							const interval = this.getNodeParameter('interval', i) as number;
							responseData = await kraken.ohlc({
								pair: ohlcPair,
								interval,
							});
							break;

						case 'getOrderBook':
							const orderBookPair = this.getNodeParameter('pair', i) as string;
							const count = this.getNodeParameter('count', i) as number;
							responseData = await kraken.depth({
								pair: orderBookPair,
								count,
							});
							break;

						case 'getRecentTrades':
							const tradesPair = this.getNodeParameter('pair', i) as string;
							responseData = await kraken.trades({ pair: tradesPair });
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
							responseData = await kraken.balance();
							break;

						case 'getTradeBalance':
							responseData = await kraken.tradeBalance();
							break;

						case 'getOpenOrders':
							responseData = await kraken.openOrders();
							break;

						case 'getClosedOrders':
							responseData = await kraken.closedOrders();
							break;

						case 'getTradesHistory':
							responseData = await kraken.tradesHistory();
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
							const additionalOptions = this.getNodeParameter('additionalOptions', i) as any;

							const orderParams: any = {
								pair,
								type,
								ordertype,
								volume,
							};

							// Add price for orders that require it
							if (['limit', 'stop-loss-limit', 'take-profit-limit'].includes(ordertype) && price) {
								orderParams.price = price;
							}

							// Add additional options if provided
							if (additionalOptions.userref !== undefined) {
								orderParams.userref = additionalOptions.userref;
							}
							if (additionalOptions.price2) {
								orderParams.price2 = additionalOptions.price2;
							}
							if (additionalOptions.leverage) {
								orderParams.leverage = additionalOptions.leverage;
							}
							if (additionalOptions.oflags && additionalOptions.oflags.length > 0) {
								orderParams.oflags = additionalOptions.oflags.join(',');
							}
							if (additionalOptions.timeinforce) {
								orderParams.timeinforce = additionalOptions.timeinforce;
							}
							if (additionalOptions.starttm) {
								orderParams.starttm = additionalOptions.starttm;
							}
							if (additionalOptions.expiretm) {
								orderParams.expiretm = additionalOptions.expiretm;
							}
							if (additionalOptions.closeOrderType) {
								orderParams['close[ordertype]'] = additionalOptions.closeOrderType;
							}
							if (additionalOptions.closePrice) {
								orderParams['close[price]'] = additionalOptions.closePrice;
							}
							if (additionalOptions.closePrice2) {
								orderParams['close[price2]'] = additionalOptions.closePrice2;
							}
							if (additionalOptions.validate !== undefined) {
								orderParams.validate = additionalOptions.validate;
							}

							responseData = await kraken.addOrder(orderParams);
							break;

						case 'cancelOrder':
							const txid = this.getNodeParameter('txid', i) as string;
							responseData = await kraken.cancelOrder({ txid });
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
