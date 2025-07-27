const { Kraken } = require('node-kraken-api');

async function debugKrakenAPI() {
    console.log('Debugging Kraken API...');

    try {
        const kraken = new Kraken();

        console.log('Testing assets method...');
        const assets = await kraken.assets();
        console.log('Assets response:', JSON.stringify(assets, null, 2));

    } catch (error) {
        console.error('Error:', error);
        console.error('Stack:', error.stack);
    }
}

debugKrakenAPI();
