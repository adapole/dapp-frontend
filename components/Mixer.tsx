import { useState } from 'react';
import Transact from './Transact';
import NoteField from './NoteField';
import SliderDot from './SliderDot';
import Balance from './Balance';
import { useWallet } from '@txnlab/use-wallet';
import algosdk from 'algosdk';
import { algodClient } from '../libs/api';
import { app_id } from '../libs/constants';
import createTransactionToSign, {
	hash,
	getRndInteger,
	TransactionToSign,
	TransactionToSignType,
} from '../libs/helpers';
import Withdraw from './Withdraw';

const Mixer = () => {
	const [openTab, setOpenTab] = useState(1);
	const [noteValue, setNoteValue] = useState('');
	const [nullifier, setNullifier] = useState('');
	const { activeAddress, signTransactions, sendTransactions, activeAccount } =
		useWallet();

	const sendTransaction = async (
		from?: string,
		to?: string,
		amount?: number,
		note?: string
	) => {
		if (!from || !to || !amount || !note) {
			throw new Error('Missing transaction params.');
		}

		const params = await algodClient.getTransactionParams().do();

		const transaction = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
			from,
			to,
			amount,
			note: new Uint8Array(Buffer.from(note)),
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

	const appOptin = async (
		from?: string,
		to?: string,
		amount?: number,
		note?: string
	) => {
		if (!from) {
			throw new Error('Missing transaction params.');
		}
		try {
			const suggestedParams = await algodClient.getTransactionParams().do();
			const appIndex = 79061945;

			const transaction = algosdk.makeApplicationOptInTxnFromObject({
				from,
				appIndex,
				note: new Uint8Array(Buffer.from('OptIn Jina')),
				appArgs: [],
				suggestedParams,
			});

			const encodedTransaction = algosdk.encodeUnsignedTransaction(transaction);

			const signedTransactions = await signTransactions([encodedTransaction]);

			const waitRoundsToConfirm = 4;

			const { id } = await sendTransactions(
				signedTransactions,
				waitRoundsToConfirm
			);

			console.log('Successfully sent transaction. Transaction ID: ', id);
		} catch (error) {
			console.error(error);
		}
	};
	const hasher = async (note: string) => {
		console.log(getRndInteger(11, 100000));
		hash(note).then((hex) => console.log(hex));
	};
	const appCall = async (from: string, note?: string, nullifier?: string) => {
		if (!from || !note || !nullifier) {
			throw new Error('Missing transaction params.');
		}
		try {
			const suggestedParams = await algodClient.getTransactionParams().do();

			const s_n = note + nullifier;
			setNullifier(nullifier);
			console.log(note);
			console.log(hash(s_n));

			const transaction1 = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
				from,
				to: algosdk.getApplicationAddress(app_id),
				amount: 5000000,

				suggestedParams,
			});

			const transaction2 = algosdk.makeApplicationNoOpTxnFromObject({
				from,
				appIndex: app_id,
				appArgs: [
					Uint8Array.from(Buffer.from('deposit')),
					Uint8Array.from(Buffer.from(await hash(s_n))),
				],
				boxes: [
					{ appIndex: app_id, name: Uint8Array.from(Buffer.from('5algo')) },
				],
				suggestedParams,
			});

			const txns = [];
			const AlgoDeposit5 = createTransactionToSign(
				transaction1,
				undefined, // TODO: refactor
				TransactionToSignType.UserFeeTransaction
			);
			const appcall = createTransactionToSign(
				transaction2,
				undefined, // TODO: refactor
				TransactionToSignType.UserTransaction
			);
			txns.push(AlgoDeposit5, appcall);
			const signedTransactions = await processTransactions(
				txns,
				signTransactions
			);

			//const encodedTransaction = algosdk.encodeUnsignedTransaction(transaction);

			//const signedTransactions = await signTransactions([encodedTransaction]);

			const waitRoundsToConfirm = 4;

			const { id } = await sendTransactions(
				signedTransactions,
				waitRoundsToConfirm
			);

			console.log('Successfully sent transaction. Transaction ID: ', id);
		} catch (error) {
			console.error(error);
		}
	};

	const processTransactions = async (
		transactions: TransactionToSign[],
		signTransactions: (transactions: Uint8Array[]) => Promise<Uint8Array[]>
	) => {
		const rawTxns = [...transactions.map((txn) => txn.transaction)];
		const txnGroup = algosdk.assignGroupID(rawTxns);
		const txnGroupEncoded = txnGroup.map((txn, index) => {
			const txnToSign = transactions[index];
			if (
				txnToSign.type === TransactionToSignType.LsigTransaction ||
				txnToSign.type === TransactionToSignType.LsigFeeTransaction
			) {
				const signedEscrowTx = algosdk.signLogicSigTransactionObject(
					txnGroup[index],
					transactions[index].signer as algosdk.LogicSigAccount
				);

				return signedEscrowTx.blob;
			}
			return algosdk.encodeUnsignedTransaction(txn);
		});

		const signedUserTransactionsResult = await signTransactions(
			txnGroupEncoded
		).catch((error) => {
			console.error(error);
			return [];
		});

		return signedUserTransactionsResult;
	};
	return (
		<div>
			<ul
				className='flex mb-0 list-none flex-wrap pb-4 flex-row'
				role='tablist'
			>
				<li className='-mb-px mr-2 last:mr-0 flex-auto text-center'>
					<a
						className={
							'text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal ' +
							(openTab === 1
								? 'text-white bg-site-pink'
								: 'text-dim-white bg-site-black')
						}
						onClick={(e) => {
							e.preventDefault();
							setOpenTab(1);
						}}
						data-toggle='tab'
						href='#link1'
						role='tablist'
					>
						<i className='fas fa-space-shuttle text-base mr-1'></i> Deposit
					</a>
				</li>
				<li className='-mb-px mr-2 last:mr-0 flex-auto text-center'>
					<a
						className={
							'text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal ' +
							(openTab === 2
								? 'text-white bg-site-pink'
								: 'text-dim-white bg-site-black')
						}
						onClick={(e) => {
							e.preventDefault();
							setOpenTab(2);
						}}
						data-toggle='tab'
						href='#link2'
						role='tablist'
					>
						<i className='fas fa-cog text-base mr-1'></i> Withdraw
					</a>
				</li>
			</ul>
			<div className='relative flex flex-col min-w-0 break-words bg-site-dim w-full mb-6 shadow-lg rounded-2xl'>
				<div className='px-4 py-5 flex-auto'>
					<div className='tab-content tab-space'>
						<div className={openTab === 1 ? 'block' : 'hidden'} id='link1'>
							<div className='flex flex-col w-full items-center'>
								<div className='mb-8'>
									<NoteField value={noteValue} setNoteValue={setNoteValue} />
								</div>
								<div className='mb-8 w-[100%]'>
									<SliderDot />
									<Balance nullifier={nullifier} />
								</div>
								<button
									onClick={async () => {
										if (activeAddress)
											await appCall(
												activeAddress,
												noteValue,
												getRndInteger(11, 100000).toString()
											);
										//sendTransaction(activeAddress, activeAddress, 1000, noteValue);
									}}
									className={`bg-site-pink border-none outline-none px-6 py-2 font-poppins font-bold text-lg rounded-2xl leading-[24px] transition-all min-h-[56px]`}
								>
									Deposit
								</button>

								{/* <button
				onClick={async () => {
					await hasher(noteValue);
				}}
			>
				hash
			</button><Transact /> */}
							</div>
						</div>
						<div className={openTab === 2 ? 'block' : 'hidden'} id='link2'>
							<Withdraw />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Mixer;
