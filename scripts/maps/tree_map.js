async function addToTreeMap(accountData, contractAccount, contractId, iters) {
    console.log("Starting Tree Map Insertions")
    for(let i = 0; i < iters; i++) {
        console.log(`Starting ${i+1} of ${iters} inserting TreeMaps`)
        try {
            const accountId = `iter-${i.toString()}-benjiman.testnet`;
            const res = await contractAccount.functionCall({
                    contractId,
                    methodName: 'add_to_map',
                    args: {
                        'storage_type': 'tree',
                        'key': accountId,
                        "value": "hello"
                    },
                    gas: "300000000000000"
                });

                let buff = new Buffer(res.status.SuccessValue, 'base64');
                let text = buff.toString('utf8');
                let parsed = JSON.parse(text)

                accountData[i].TreeMapAddGas = parsed.gas;
                accountData[i].TreeMapAddStorage = parsed.storage;
        } catch(e) {
            console.log('error adding to map: ', e);
        }
        console.log(`Finished`)
    }
}

async function getFromTreeMap(accountData, contractAccount, contractId, iters) {
    console.log("Starting Tree Map Gets")
    for(let i = 0; i < iters; i++) {
        console.log(`Starting ${i+1} of ${iters} Gets TreeMaps`)
        try {
            const accountId = `iter-${i.toString()}-benjiman.testnet`;
            const res = await contractAccount.functionCall({
                    contractId,
                    methodName: 'get_from_map',
                    args: {
                        'storage_type': 'tree',
                        'key': accountId,
                    },
                    gas: "300000000000000"
                });

                let buff = new Buffer(res.status.SuccessValue, 'base64');
                let text = buff.toString('utf8');
                let parsed = JSON.parse(text)

                accountData[i].TreeMapGetGas = parsed.gas;
                accountData[i].TreeMapGetStorage = parsed.storage;
        } catch(e) {
            console.log('error adding to map: ', e);
        }
        console.log(`Finished`)
    }
}

async function startTreeMap(accountData, contractAccount, contractId, iters) {
    await addToTreeMap(accountData, contractAccount, contractId, iters);
    await getFromTreeMap(accountData, contractAccount, contractId, iters);
}

// Export it to make it available outside
module.exports.startTreeMap = startTreeMap;