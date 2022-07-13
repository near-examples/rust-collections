const { connect, KeyPair, keyStores, utils } = require("near-api-js");
const { parseNearAmount, formatNearAmount } = require("near-api-js/lib/utils/format");
const path = require("path");
const homedir = require("os").homedir();
const reader = require('xlsx');
const { startLookupMap } = require("./maps/lookup_map");
const { startTreeMap } = require("./maps/tree_map");
const { startUnorderedMap } = require("./maps/unordered_map");
const { startLookupSet } = require("./sets/lookup_set");
const { startUnorderedSet } = require("./sets/unordered_set");
const { startVectorSet } = require("./sets/vector");

// Reading our test file

let CONTRACT_ID = process.env.CONTRACT_NAME;
let NUM_ITERS = 10;

let NETWORK_ID = "testnet";
let near;
let config;
let keyStore;

// set up near
const initiateNear = async () => {
	const CREDENTIALS_DIR = ".near-credentials";

	const credentialsPath = (await path).join(homedir, CREDENTIALS_DIR);
	(await path).join;
	keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

	config = {
		networkId: NETWORK_ID,
		keyStore,
		nodeUrl: "https://rpc.testnet.near.org",
		walletUrl: "https://wallet.testnet.near.org",
		helperUrl: "https://helper.testnet.near.org",
		explorerUrl: "https://explorer.testnet.near.org",
	};

	near = await connect(config);
};

async function start() {
    var filePath = path.join(__dirname, '..', 'sheets', 'data.xlsx');
    const file = reader.readFile(filePath);

	//deployed linkdrop proxy contract
	await initiateNear();

	if(!CONTRACT_ID) {
		throw "must specify proxy contract ID";
	}

    const contractAccount = await near.account(CONTRACT_ID);

    console.log(`initializing contract for account ${CONTRACT_ID}`);
	try {
		await contractAccount.functionCall({
            contractId: CONTRACT_ID,
            methodName: 'new',
            args: {},
            gas: "300000000000000"
        });
	} catch(e) {
		console.log('error initializing contract: ', e);
	}

    let dataToWrite = [];
    let accountData = [];

    console.log("Pushing accounts");
    for(let index = 0; index < NUM_ITERS; index++) {
        const accountId = `iter-${index.toString()}-benjiman.testnet`;
        accountData.push({
            accountId,
        })
    }
    console.log("Done");



    await startTreeMap(accountData, contractAccount, CONTRACT_ID, NUM_ITERS);
    await startVectorSet(accountData, contractAccount, CONTRACT_ID, NUM_ITERS);
    
    await startUnorderedSet(accountData, contractAccount, CONTRACT_ID, NUM_ITERS);
    await startUnorderedMap(accountData, contractAccount, CONTRACT_ID, NUM_ITERS);
    
    await startLookupMap(accountData, contractAccount, CONTRACT_ID, NUM_ITERS);
    await startLookupSet(accountData, contractAccount, CONTRACT_ID, NUM_ITERS);
    


    for(let index = 0; index < NUM_ITERS; index++) {
        dataToWrite.push(
            accountData[index]
        )
    }
    const ws = reader.utils.json_to_sheet(dataToWrite)
    reader.utils.book_append_sheet(file,ws,`DataRun-${Date.now().toString()}`)
    
    // Writing to our file
    reader.writeFile(file, filePath)
}


start();