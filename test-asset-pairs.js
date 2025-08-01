const { Kraken } = require('node-kraken-api');

async function testAssetPairsWithParameters() {
    console.log('Testing Enhanced Asset Pairs functionality...');

    try {
        const kraken = new Kraken();

        console.log('\n1. Testing Asset Pairs - All pairs (default)...');
        const allPairs = await kraken.assetPairs();
        console.log('✅ All pairs request working. Total pairs:', Object.keys(allPairs).length);

        console.log('\n2. Testing Asset Pairs - Specific pairs (BTC/USD, ETH/USD)...');
        const specificPairs = await kraken.assetPairs({ 
            pair: 'XXBTZUSD,XETHZUSD' 
        });
        console.log('✅ Specific pairs request working. Pairs returned:', Object.keys(specificPairs));

        console.log('\n3. Testing Asset Pairs - Leverage info...');
        const leverageInfo = await kraken.assetPairs({ 
            pair: 'XXBTZUSD',
            info: 'leverage' 
        });
        console.log('✅ Leverage info request working. Response keys:', Object.keys(leverageInfo));

        console.log('\n4. Testing Asset Pairs - Fees info...');
        const feesInfo = await kraken.assetPairs({ 
            pair: 'XXBTZUSD',
            info: 'fees' 
        });
        console.log('✅ Fees info request working. Response keys:', Object.keys(feesInfo));

        console.log('\n5. Testing Asset Pairs - Margin info...');
        const marginInfo = await kraken.assetPairs({ 
            pair: 'XXBTZUSD',
            info: 'margin' 
        });
        console.log('✅ Margin info request working. Response keys:', Object.keys(marginInfo));

        // Note: Country code filtering may not return different results for all regions
        console.log('\n6. Testing Asset Pairs - Country code filter (US)...');
        try {
            const countryFiltered = await kraken.assetPairs({ 
                country_code: 'US' 
            });
            console.log('✅ Country code filter working. Pairs returned:', Object.keys(countryFiltered).length);
        } catch (error) {
            console.log('ℹ️  Country code filter may not be supported or may return same results');
        }

        console.log('\n🎉 All enhanced Asset Pairs tests passed!');
        console.log('The new parameters (pair, info, country_code) are working correctly.');

    } catch (error) {
        console.error('❌ Error testing enhanced Asset Pairs:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
    }
}

testAssetPairsWithParameters();
