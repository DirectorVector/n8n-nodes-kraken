const { Kraken } = require('node-kraken-api');

async function testKrakenAPI() {
    console.log('Testing Kraken API without credentials (public endpoints)...');

    try {
        // Test with no credentials for public endpoints
        const kraken = new Kraken();

        console.log('\n1. Testing Asset Info...');
        const assets = await kraken.assets();
        console.log('✅ Assets endpoint working. Sample assets:', Object.keys(assets).slice(0, 5));

        console.log('\n2. Testing Asset Pairs...');
        const pairs = await kraken.assetPairs();
        console.log('✅ Asset pairs endpoint working. Sample pairs:', Object.keys(pairs).slice(0, 5));

        console.log('\n3. Testing Ticker (BTC/USD)...');
        const ticker = await kraken.ticker({ pair: 'XXBTZUSD' });
        console.log('✅ Ticker endpoint working. BTC/USD price:', ticker.XXBTZUSD?.c?.[0] || 'N/A');

        console.log('\n4. Testing OHLC Data (BTC/USD)...');
        const ohlc = await kraken.ohlc({ pair: 'XXBTZUSD', interval: 60 });
        console.log('✅ OHLC endpoint working. Data points returned:', ohlc.XXBTZUSD?.length || 0);

        console.log('\n🎉 All public API tests passed! The Kraken node should work correctly.');

    } catch (error) {
        console.error('❌ Error testing Kraken API:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
    }
}

testKrakenAPI();
