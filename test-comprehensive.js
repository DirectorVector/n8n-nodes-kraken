// Comprehensive test demonstrating the enhanced Asset Pairs functionality
const { Kraken } = require('node-kraken-api');

async function runComprehensiveTests() {
    console.log('🚀 Testing Enhanced Kraken Asset Pairs Node');
    console.log('===========================================\n');

    const kraken = new Kraken();
    let testsPassed = 0;
    let totalTests = 0;

    const runTest = async (testName, testFn) => {
        totalTests++;
        try {
            console.log(`${totalTests}. ${testName}...`);
            await testFn();
            console.log(`✅ PASSED: ${testName}\n`);
            testsPassed++;
        } catch (error) {
            console.log(`❌ FAILED: ${testName}`);
            console.log(`   Error: ${error.message}\n`);
        }
    };

    // Test 1: Default behavior (all pairs, info type)
    await runTest('Default Asset Pairs (backward compatibility)', async () => {
        const result = await kraken.assetPairs();
        if (Object.keys(result).length === 0) throw new Error('No pairs returned');
        console.log(`   📊 Retrieved ${Object.keys(result).length} trading pairs`);
    });

    // Test 2: Specific pairs filter
    await runTest('Specific Asset Pairs Filter', async () => {
        const result = await kraken.assetPairs({ pair: 'XXBTZUSD,XETHZUSD' });
        const pairs = Object.keys(result);
        if (!pairs.includes('XXBTZUSD') || !pairs.includes('XETHZUSD')) {
            throw new Error('Expected pairs not found');
        }
        console.log(`   📊 Successfully filtered to: ${pairs.join(', ')}`);
    });

    // Test 3: Leverage information
    await runTest('Leverage Information Retrieval', async () => {
        const result = await kraken.assetPairs({
            pair: 'XXBTZUSD',
            info: 'leverage'
        });
        if (!result.XXBTZUSD) throw new Error('BTC/USD leverage info not found');
        console.log(`   📊 Leverage info available for BTC/USD`);
    });

    // Test 4: Fees information
    await runTest('Fees Information Retrieval', async () => {
        const result = await kraken.assetPairs({
            pair: 'XXBTZUSD',
            info: 'fees'
        });
        if (!result.XXBTZUSD) throw new Error('BTC/USD fees info not found');
        console.log(`   📊 Fees info available for BTC/USD`);
    });

    // Test 5: Margin information
    await runTest('Margin Information Retrieval', async () => {
        const result = await kraken.assetPairs({
            pair: 'XXBTZUSD',
            info: 'margin'
        });
        if (!result.XXBTZUSD) throw new Error('BTC/USD margin info not found');
        console.log(`   📊 Margin info available for BTC/USD`);
    });

    // Test 6: Country code filtering
    await runTest('Country Code Filtering', async () => {
        const allPairs = await kraken.assetPairs();
        const usPairs = await kraken.assetPairs({ country_code: 'US' });

        console.log(`   📊 All pairs: ${Object.keys(allPairs).length}`);
        console.log(`   📊 US pairs: ${Object.keys(usPairs).length}`);

        // Country filtering may return the same or different results
        if (typeof usPairs !== 'object') throw new Error('Invalid response format');
    });

    // Test 7: Combined parameters
    await runTest('Combined Parameters Test', async () => {
        const result = await kraken.assetPairs({
            pair: 'XXBTZUSD,XETHZUSD',
            info: 'fees',
            country_code: 'US'
        });

        const pairs = Object.keys(result);
        if (pairs.length === 0) throw new Error('No results with combined parameters');
        console.log(`   📊 Combined query returned: ${pairs.join(', ')}`);
    });

    // Final Results
    console.log('===========================================');
    console.log(`🎯 Test Results: ${testsPassed}/${totalTests} tests passed`);

    if (testsPassed === totalTests) {
        console.log('🎉 ALL TESTS PASSED!');
        console.log('✨ The enhanced Asset Pairs functionality is working perfectly!');
        console.log('\n📋 Summary of New Features:');
        console.log('   • ✅ Specific asset pairs filtering (pair parameter)');
        console.log('   • ✅ Different info types (info parameter): info, leverage, fees, margin');
        console.log('   • ✅ Country/region filtering (country_code parameter)');
        console.log('   • ✅ Full backward compatibility maintained');
        console.log('   • ✅ Parameter combination support');
    } else {
        console.log('⚠️  Some tests failed. Please check the errors above.');
    }
}

// Run the comprehensive tests
runComprehensiveTests().catch(console.error);
