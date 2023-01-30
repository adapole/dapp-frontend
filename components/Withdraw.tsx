import { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { algodClient, tealProgramRelay } from '../libs/api';
import createTransactionToSign, {
	getLogicSign,
	TransactionToSignType,
} from '../libs/helpers';
import RelayOp from './RelayOp';
import algosdk, { LogicSigAccount } from 'algosdk';
import { app_id, RelayContract } from '../libs/constants';

const Withdraw = () => {
	const [eyeVis, seteyeVis] = useState(true);
	const [withdrawSecret, setWithdrawSecret] = useState('');
	const [withdrawNullifier, setWithdrawNullifier] = useState('');
	const [newAddress, setNewAddress] = useState('');

	const escrowLsig = getLogicSign(RelayContract) as LogicSigAccount;

	const appCall = async (
		escrowLsig: algosdk.LogicSigAccount,
		to: string,
		secret?: string,
		nullifier?: string
	) => {
		if (!escrowLsig || !secret || !nullifier) {
			throw new Error('Missing transaction params.');
		}
		try {
			const suggestedParams = await algodClient.getTransactionParams().do();

			setWithdrawNullifier(nullifier);
			//console.log(escrowLsig.address());

			const transaction = algosdk.makeApplicationNoOpTxnFromObject({
				from: escrowLsig.address(),
				appIndex: app_id,
				appArgs: [
					Uint8Array.from(Buffer.from('withdraw')),
					Uint8Array.from(Buffer.from(secret)),
					Uint8Array.from(Buffer.from(nullifier)),
					Uint8Array.from(Buffer.from(to)),
				],
				accounts: [to],
				boxes: [
					{ appIndex: app_id, name: Uint8Array.from(Buffer.from('5algo')) },
					{ appIndex: app_id, name: Uint8Array.from(Buffer.from('NF')) },
					{ appIndex: app_id, name: Uint8Array.from(Buffer.from('')) },
				],
				suggestedParams,
			});

			//const txns = [];
			//
			//const appcall = createTransactionToSign(
			//	transaction,
			//	escrowLsig, // TODO: refactor
			//	TransactionToSignType.LsigTransaction
			//);
			//txns.push(appcall);
			//const signedTransactions = await processTransactions(
			//	txns,
			//	signTransactions
			//);

			const encodedTransaction = algosdk.encodeUnsignedTransaction(transaction);

			//const signedTransactions = await signTransactions([encodedTransaction]);
			let signedTxn = algosdk.signLogicSigTransactionObject(
				transaction,
				escrowLsig
			);

			// Submit the transaction
			let tx = await algodClient.sendRawTransaction(signedTxn.blob).do();

			console.log('Transaction : ' + tx.txId);
			const confirmedTxn = await algosdk.waitForConfirmation(
				algodClient,
				tx.txId,
				4
			);

			console.log(
				'Transaction ID: ' +
					tx.txId +
					' confirmed in round: ' +
					confirmedTxn['confirmed-round']
			);
		} catch (error) {
			console.error(error);
		}
	};
	const getRelay = async () => {
		let a = await tealProgramRelay(app_id);
		return a;
		//console.log(a);
		//let b64 = Buffer.from(a).toString('base64');
		//console.log(b64);
		//let u8 = new Uint8Array(Buffer.from(b64, 'base64'));
		//console.log(u8);
	};
	const algoRelay = async (to: string, escrowLsig: algosdk.LogicSigAccount) => {
		const txns = [];
		const amount = 5000000 - 1000000;
		try {
			const suggestedParams = await algodClient.getTransactionParams().do();
			const requestedAlgoTxn = createTransactionToSign(
				algosdk.makePaymentTxnWithSuggestedParamsFromObject({
					from: escrowLsig.address(),
					to,
					amount,
					suggestedParams,
				}),
				escrowLsig,
				TransactionToSignType.LsigTransaction
			);

			txns.push(requestedAlgoTxn);
		} catch (err) {
			console.error(err);
		}
	};
	return (
		<div className='flex flex-col w-full items-center'>
			<div className='mb-8 w-[100%]'>
				<RelayOp />
			</div>
			<div className='mb-8'>
				<div className='flex justify-between items-center flex-row w-full min-w-full bg-site-dim border-[1px] border-transparent hover:border-site-dim2 min-h-[64px] sm:p-8 p-4 rounded-[20px]'>
					<input
						placeholder='password'
						type={eyeVis ? 'text' : 'password'}
						value={withdrawSecret}
						disabled={false}
						onChange={(e) =>
							typeof setWithdrawSecret === 'function' &&
							setWithdrawSecret(e.target.value)
						}
						className='w-full flex-1 bg-transparent outline-none font-poppins font-black text-2xl text-white'
					/>
					<div
						className='relative'
						onClick={() => {
							seteyeVis((prevState) => !prevState);
						}}
					>
						<button className='flex flex-row items-center bg-site-dim2 py-2 px-4 rounded-xl font-poppins font-bold text-white'>
							{eyeVis ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
						</button>
					</div>
				</div>
			</div>
			<div className='mb-8 w-[100%]'>
				<div className='flex justify-between items-center flex-row w-full min-w-full bg-site-dim border-[1px] border-transparent hover:border-site-dim2 min-h-[64px] sm:p-8 p-4 rounded-[20px]'>
					<input
						placeholder='nullifier'
						type='text'
						value={withdrawNullifier}
						disabled={false}
						onChange={(e) =>
							typeof setWithdrawNullifier === 'function' &&
							setWithdrawNullifier(e.target.value)
						}
						className='w-full flex-1 bg-transparent outline-none font-poppins font-black text-2xl text-white'
					/>
				</div>
			</div>

			<div className='mb-2 w-[100%]'>
				<div className='flex justify-between items-center flex-row w-full min-w-full bg-site-dim border-[1px] border-transparent hover:border-site-dim2 min-h-[64px] sm:p-8 p-4 rounded-[20px]'>
					<input
						placeholder='address'
						type='text'
						value={newAddress}
						disabled={false}
						onChange={(e) =>
							typeof setNewAddress === 'function' &&
							setNewAddress(e.target.value)
						}
						className='w-full flex-1 bg-transparent outline-none font-poppins font-black text-2xl text-white'
					/>
				</div>
			</div>
			<button
				onClick={async () => {
					const a = await tealProgramRelay(app_id);
					await appCall(a, newAddress, withdrawSecret, withdrawNullifier);
				}}
				className={`bg-site-pink border-none outline-none px-6 py-2 font-poppins font-bold text-lg rounded-2xl leading-[24px] transition-all min-h-[56px]`}
			>
				Withdraw
			</button>
		</div>
	);
};

export default Withdraw;
