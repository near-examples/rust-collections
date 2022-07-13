async function addToUnorderedSet(accountData, contractAccount, contractId, iters) {
    console.log("Starting Unordered Set Insertions")
    for(let i = 0; i < iters; i++) {
        console.log(`Starting ${i+1} of ${iters} inserting UnorderedSets`)
        try {
            const accountId = `iter-${i.toString()}-benjiman.testnet`;
            const res = await contractAccount.functionCall({
                    contractId,
                    methodName: 'add_to_set',
                    args: {
                        'storage_type': 'unordered',
                        'value': accountId,
                    },
                    gas: "300000000000000"
                });

                let buff = new Buffer(res.status.SuccessValue, 'base64');
                let text = buff.toString('utf8');
                let parsed = JSON.parse(text)

                accountData[i].UnorderedSetAddGas = parsed.gas;
                accountData[i].UnorderedSetAddStorage = parsed.storage;
        } catch(e) {
            console.log('error adding to Set: ', e);
        }
        console.log(`Finished`)
    }
}

async function getFromUnorderedSet(accountData, contractAccount, contractId, iters) {
    console.log("Starting Unordered Set Gets")
    for(let i = 0; i < iters; i++) {
        console.log(`Starting ${i+1} of ${iters} Gets UnorderedSets`)
        try {
            const accountId = `iter-${i.toString()}-benjiman.testnet`;
            const res = await contractAccount.functionCall({
                    contractId,
                    methodName: 'get_from_set',
                    args: {
                        'storage_type': 'unordered',
                        'value': accountId,
                    },
                    gas: "300000000000000"
                });

                let buff = new Buffer(res.status.SuccessValue, 'base64');
                let text = buff.toString('utf8');
                let parsed = JSON.parse(text)

                accountData[i].UnorderedSetGetGas = parsed.gas;
                accountData[i].UnorderedSetGetStorage = parsed.storage;
        } catch(e) {
            console.log('error adding to Set: ', e);
        }
        console.log(`Finished`)
    }
}

async function startUnorderedSet(accountData, contractAccount, contractId, iters) {
    await addToUnorderedSet(accountData, contractAccount, contractId, iters);
    await getFromUnorderedSet(accountData, contractAccount, contractId, iters);
}

// Export it to make it available outside
module.exports.startUnorderedSet = startUnorderedSet;