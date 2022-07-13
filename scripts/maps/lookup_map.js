async function addToLookupMap(accountData, contractAccount, contractId, iters) {
    console.log("Starting Lookup Map Insertions")
    for(let i = 0; i < iters; i++) {
        console.log(`Starting ${i+1} of ${iters} inserting LookupMaps`)
        try {
            const accountId = `iter-${i.toString()}-benjiman.testnet`;
            const res = await contractAccount.functionCall({
                    contractId,
                    methodName: 'add_to_map',
                    args: {
                        'storage_type': 'lookup',
                        'key': accountId,
                        "value": "hello"
                    },
                    gas: "300000000000000"
                });

                let buff = new Buffer(res.status.SuccessValue, 'base64');
                let text = buff.toString('utf8');
                let parsed = JSON.parse(text)

                accountData[i].LookupMapAddGas = parsed.gas;
                accountData[i].LookupMapAddStorage = parsed.storage;
        } catch(e) {
            console.log('error adding to map: ', e);
        }
        console.log(`Finished`)
    }
}

async function getFromLookupMap(accountData, contractAccount, contractId, iters) {
    console.log("Starting Lookup Map Gets")
    for(let i = 0; i < iters; i++) {
        console.log(`Starting ${i+1} of ${iters} Gets LookupMaps`)
        try {
            const accountId = `iter-${i.toString()}-benjiman.testnet`;
            const res = await contractAccount.functionCall({
                    contractId,
                    methodName: 'get_from_map',
                    args: {
                        'storage_type': 'lookup',
                        'key': accountId,
                    },
                    gas: "300000000000000"
                });

                let buff = new Buffer(res.status.SuccessValue, 'base64');
                let text = buff.toString('utf8');
                let parsed = JSON.parse(text)

                accountData[i].LookupMapGetGas = parsed.gas;
                accountData[i].LookupMapGetStorage = parsed.storage;
        } catch(e) {
            console.log('error adding to map: ', e);
        }
        console.log(`Finished`)
    }
}

async function startLookupMap(accountData, contractAccount, contractId, iters) {
    await addToLookupMap(accountData, contractAccount, contractId, iters);
    await getFromLookupMap(accountData, contractAccount, contractId, iters);
}

// Export it to make it available outside
module.exports.startLookupMap = startLookupMap;