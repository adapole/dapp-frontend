import React from 'react';
import {
	useWallet,
	DEFAULT_NODE_BASEURL,
	DEFAULT_NODE_TOKEN,
	DEFAULT_NODE_PORT,
} from '@txnlab/use-wallet';
import algosdk from 'algosdk';

const baseServer = 'https://testnet-algorand.api.purestake.io/ps2';
const port = '';
const token = {
	'X-API-Key': process.env.NEXT_PUBLIC_PURESTAKE ?? '',
};

const algodClient = new algosdk.Algodv2(token, baseServer, port);

export default function Transact() {
	const { activeAddress, signTransactions, sendTransactions, activeAccount } =
		useWallet();

	const sendTransaction = async (
		from?: string,
		to?: string,
		amount?: number
	) => {
		if (!from || !to || !amount) {
			throw new Error('Missing transaction params.');
		}

		const params = await algodClient.getTransactionParams().do();

		const transaction = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
			from,
			to,
			amount,
			suggestedParams: params,
		});

		const encodedTransaction = algosdk.encodeUnsignedTransaction(transaction);

		const signedTransactions = await signTransactions([encodedTransaction]);

		const waitRoundsToConfirm = 4;

		const { id } = await sendTransactions(
			signedTransactions,
			waitRoundsToConfirm
		);

		console.log('Successfully sent transaction. Transaction ID: ', id);
	};

	if (!activeAddress) {
		return <p>Connect an account first.</p>;
	}
	const checkBalance = async (activeAddress: string) => {
		//Check your balance
		let accountInfo = await algodClient.accountInformation(activeAddress).do();
		console.log('Account balance: %d microAlgos', accountInfo.amount);
		console.log(activeAccount?.providerId);
	};

	return (
		<div>
			<button
				onClick={() => sendTransaction(activeAddress, activeAddress, 1000)}
				className='button'
			>
				Sign and send transactions
			</button>
			<button onClick={() => checkBalance(activeAddress)} className='button'>
				Check balance
			</button>
		</div>
	);
}
