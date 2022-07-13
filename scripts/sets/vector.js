async function addToVectorSet(accountData, contractAccount, contractId, iters) {
    console.log("Starting Vector Set Insertions")
    for(let i = 0; i < iters; i++) {
        console.log(`Starting ${i+1} of ${iters} inserting VectorSets`)
        try {
            const accountId = `iter-${i.toString()}-benjiman.testnet`;
            const res = await contractAccount.functionCall({
                    contractId,
                    methodName: 'add_to_set',
                    args: {
                        'storage_type': 'vector',
                        'value': accountId,
                    },
                    gas: "300000000000000"
                });

                let buff = new Buffer(res.status.SuccessValue, 'base64');
                let text = buff.toString('utf8');
                let parsed = JSON.parse(text)

                accountData[i].VectorSetAddGas = parsed.gas;
                accountData[i].VectorSetAddStorage = parsed.storage;
        } catch(e) {
            console.log('error adding to Set: ', e);
        }
        console.log(`Finished`)
    }
}

async function getFromVectorSet(accountData, contractAccount, contractId, iters) {
    console.log("Starting Vector Set Gets")
    for(let i = 0; i < iters; i++) {
        console.log(`Starting ${i+1} of ${iters} Gets VectorSets`)
        try {
            const accountId = `iter-${i.toString()}-benjiman.testnet`;
            const res = await contractAccount.functionCall({
                    contractId,
                    methodName: 'get_from_set',
                    args: {
                        'storage_type': 'vector',
                        'value': accountId,
                        'index': i
                    },
                    gas: "300000000000000"
                });

                let buff = new Buffer(res.status.SuccessValue, 'base64');
                let text = buff.toString('utf8');
                let parsed = JSON.parse(text)

                accountData[i].VectorSetGetGas = parsed.gas;
                accountData[i].VectorSetGetStorage = parsed.storage;
        } catch(e) {
            console.log('error adding to Set: ', e);
        }
        console.log(`Finished`)
    }
}

async function startVectorSet(accountData, contractAccount, contractId, iters) {
    await addToVectorSet(accountData, contractAccount, contractId, iters);
    await getFromVectorSet(accountData, contractAccount, contractId, iters);
}

// Export it to make it available outside
module.exports.startVectorSet = startVectorSet;