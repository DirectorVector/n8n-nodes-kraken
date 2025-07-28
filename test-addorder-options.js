/**
 * Test script to verify all addOrder options are working correctly
 */

// Import the compiled node
const { Kraken } = require('./dist/nodes/Kraken/Kraken.node.js');

// Mock node-kraken-api
const mockKraken = {
    addOrder: (params) => {
        console.log('AddOrder called with parameters:');
        console.log(JSON.stringify(params, null, 2));
        
        // Verify all parameters are properly passed
        const expectedParams = [
            'pair', 'type', 'ordertype', 'volume', 'price',
            'userref', 'price2', 'leverage', 'oflags', 'timeinforce',
            'starttm', 'expiretm', 'close[ordertype]', 'close[price]',
            'close[price2]', 'validate'
        ];
        
        const presentParams = Object.keys(params);
        const missingExpected = expectedParams.filter(param => !presentParams.includes(param));
        
        console.log('\n📊 Parameter Analysis:');
        console.log('Present parameters:', presentParams.length);
        console.log('Expected parameters:', expectedParams.length);
        
        if (missingExpected.length > 0) {
            console.log('❌ Missing expected parameters:', missingExpected);
        } else {
            console.log('✅ All expected parameters are present!');
        }
        
        // Check parameter values
        console.log('\n🔍 Parameter Values:');
        console.log('- pair:', params.pair);
        console.log('- type:', params.type);
        console.log('- ordertype:', params.ordertype);
        console.log('- volume:', params.volume);
        console.log('- price:', params.price);
        console.log('- userref:', params.userref);
        console.log('- oflags:', params.oflags);
        console.log('- validate:', params.validate);
        
        return Promise.resolve({ result: 'mock-order-id' });
    }
};

// Override require to mock node-kraken-api
const Module = require('module');
const originalRequire = Module.prototype.require;
Module.prototype.require = function(...args) {
    if (args[0] === 'node-kraken-api') {
        return { Kraken: function() { return mockKraken; } };
    }
    return originalRequire.apply(this, args);
};

// Mock the n8n context
const mockContext = {
    getInputData: () => [{}],
    getCredentials: async () => ({
        apiKey: 'test-key',
        apiSecret: 'test-secret'
    }),
    getNodeParameter: (param, index) => {
        const testParams = {
            'resource': 'trading',
            'operation': 'addOrder',
            'tradingPair': 'XXBTZUSD',
            'orderType': 'buy',
            'orderSubType': 'limit',
            'volume': '0.001',
            'price': '50000',
            'additionalOptions': {
                userref: 12345,
                price2: '51000',
                leverage: '2:1',
                oflags: ['post', 'fcib'],
                timeinforce: 'IOC',
                starttm: '+60',
                expiretm: '+3600',
                closeOrderType: 'take-profit',
                closePrice: '55000',
                closePrice2: '56000',
                validate: true
            }
        };
        return testParams[param];
    },
    getNode: () => ({ name: 'Test Kraken Node' }),
    continueOnFail: () => false
};

async function testAddOrderOptions() {
    console.log('🧪 Testing addOrder with all available options...\n');
    
    try {
        const krakenNode = new Kraken();
        const result = await krakenNode.execute.call(mockContext);
        
        console.log('\n✅ Test completed successfully!');
        console.log('📤 Final result:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error(error.stack);
    }
}

// Run the test
testAddOrderOptions();
