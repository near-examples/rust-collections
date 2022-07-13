async function addToLookupSet(accountData, contractAccount, contractId, iters) {
    console.log("Starting Lookup Set Insertions")
    for(let i = 0; i < iters; i++) {
        console.log(`Starting ${i+1} of ${iters} inserting LookupSets`)
        try {
            const accountId = `iter-${i.toString()}-benjiman.testnet`;
            const res = await contractAccount.functionCall({
                    contractId,
                    methodName: 'add_to_set',
                    args: {
                        'storage_type': 'lookup',
                        'value': accountId,
                    },
                    gas: "300000000000000"
                });

                let buff = new Buffer(res.status.SuccessValue, 'base64');
                let text = buff.toString('utf8');
                let parsed = JSON.parse(text)

                accountData[i].LookupSetAddGas = parsed.gas;
                accountData[i].LookupSetAddStorage = parsed.storage;
        } catch(e) {
            console.log('error adding to Set: ', e);
        }
        console.log(`Finished`)
    }
}

async function getFromLookupSet(accountData, contractAccount, contractId, iters) {
    console.log("Starting Lookup Set Gets")
    for(let i = 0; i < iters; i++) {
        console.log(`Starting ${i+1} of ${iters} Gets LookupSets`)
        try {
            const accountId = `iter-${i.toString()}-benjiman.testnet`;
            const res = await contractAccount.functionCall({
                    contractId,
                    methodName: 'get_from_set',
                    args: {
                        'storage_type': 'lookup',
                        'value': accountId,
                    },
                    gas: "300000000000000"
                });

                let buff = new Buffer(res.status.SuccessValue, 'base64');
                let text = buff.toString('utf8');
                let parsed = JSON.parse(text)

                accountData[i].LookupSetGetGas = parsed.gas;
                accountData[i].LookupSetGetStorage = parsed.storage;
        } catch(e) {
            console.log('error adding to Set: ', e);
        }
        console.log(`Finished`)
    }
}

async function startLookupSet(accountData, contractAccount, contractId, iters) {
    await addToLookupSet(accountData, contractAccount, contractId, iters);
    await getFromLookupSet(accountData, contractAccount, contractId, iters);
}

// Export it to make it available outside
module.exports.startLookupSet = startLookupSet;