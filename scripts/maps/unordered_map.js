async function addToUnorderedMap(accountData, contractAccount, contractId, iters) {
    console.log("Starting Unordered Map Insertions")
    for(let i = 0; i < iters; i++) {
        console.log(`Starting ${i+1} of ${iters} inserting UnorderedMaps`)
        try {
            const accountId = `iter-${i.toString()}-benjiman.testnet`;
            const res = await contractAccount.functionCall({
                    contractId,
                    methodName: 'add_to_map',
                    args: {
                        'storage_type': 'unordered',
                        'key': accountId,
                        "value": "hello"
                    },
                    gas: "300000000000000"
                });

                let buff = new Buffer(res.status.SuccessValue, 'base64');
                let text = buff.toString('utf8');
                let parsed = JSON.parse(text)

                accountData[i].UnorderedMapAddGas = parsed.gas;
                accountData[i].UnorderedMapAddStorage = parsed.storage;
        } catch(e) {
            console.log('error adding to map: ', e);
        }
        console.log(`Finished`)
    }
}

async function getFromUnorderedMap(accountData, contractAccount, contractId, iters) {
    console.log("Starting Unordered Map Gets")
    for(let i = 0; i < iters; i++) {
        console.log(`Starting ${i+1} of ${iters} Gets UnorderedMaps`)
        try {
            const accountId = `iter-${i.toString()}-benjiman.testnet`;
            const res = await contractAccount.functionCall({
                    contractId,
                    methodName: 'get_from_map',
                    args: {
                        'storage_type': 'unordered',
                        'key': accountId,
                    },
                    gas: "300000000000000"
                });

                let buff = new Buffer(res.status.SuccessValue, 'base64');
                let text = buff.toString('utf8');
                let parsed = JSON.parse(text)

                accountData[i].UnorderedMapGetGas = parsed.gas;
                accountData[i].UnorderedMapGetStorage = parsed.storage;
        } catch(e) {
            console.log('error adding to map: ', e);
        }
        console.log(`Finished`)
    }
}

async function startUnorderedMap(accountData, contractAccount, contractId, iters) {
    await addToUnorderedMap(accountData, contractAccount, contractId, iters);
    await getFromUnorderedMap(accountData, contractAccount, contractId, iters);
}

// Export it to make it available outside
module.exports.startUnorderedMap = startUnorderedMap;