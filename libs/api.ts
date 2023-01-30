import algosdk from 'algosdk';

const baseServer = 'https://testnet-api.algonode.cloud';
const port = '';
//const token = {
//	'X-API-Key': process.env.NEXT_PUBLIC_PURESTAKE ?? '',
//};
const token = '';

export const algodClient = new algosdk.Algodv2(token, baseServer, port);

export async function tealProgramRelay(appId: number) {
	let params = await algodClient.getTransactionParams().do();
	console.log(params);

	let data =
		'#pragma version 6 \ntxn RekeyTo \nglobal ZeroAddress \n== \ntxn Fee \nglobal MinTxnFee \n<= \n&& \ntxn TypeEnum \nint appl \n== \ntxn OnCompletion \nint NoOp \n== \n&& \n&& \ntxn ApplicationID \narg 0 \nbtoi \n== \n&& \nreturn';
	let results = await algodClient.compile(data).do();
	console.log('Hash = ' + results.hash);
	console.log('Result = ' + results.result);

	let myAccount = algosdk.mnemonicToSecretKey(
		process.env.NEXT_PUBLIC_TESTACCOUNT_MENMONIC ?? ''
	);

	let program = new Uint8Array(Buffer.from(results.result, 'base64'));
	//let round = params.firstRound + 172800;
	let args = relayUint8Args(appId);
	let lsig = new algosdk.LogicSigAccount(program, args);
	lsig.sign(myAccount.sk);
	//console.log(lsig.address());
	//let lsigs = lsig.toByte();

	//console.log(lsigs);
	//return lsigs;

	return lsig;
}
function relayUint8Args(appId: number) {
	return [algosdk.encodeUint64(appId)];
}
