import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@txnlab/use-wallet';
import algosdk from 'algosdk';
import { algodClient } from '../libs/api';
import { formatBigNumWithDecimals } from '../libs/utilities';
import { RxCopy } from 'react-icons/rx';
import ToolTip from './ToolTip';

const Balance = (props: { nullifier: string }) => {
	const { nullifier } = props;
	const [algoBalance, setAlgoBalance] = useState(0);
	const [isCopied, setIsCopied] = useState(false);
	// TODO create useContext to getBalance at wallet connect call
	const { activeAddress, signTransactions, sendTransactions, activeAccount } =
		useWallet();
	const checkBalance = async (activeAddress: string) => {
		//Check balance
		try {
			let accountInfo = await algodClient
				.accountInformation(activeAddress)
				.do();
			console.log('Account balance: %d microAlgos', accountInfo.amount);
			console.log(activeAccount?.providerId);
			const numAmount: number = Number(
				formatBigNumWithDecimals(accountInfo.amount, 6)
			);
			setAlgoBalance(numAmount);
		} catch (error) {
			console.error(error);
		}
	};
	/*
	useEffect(() => {
		if (activeAddress) checkBalance(activeAddress);
		console.log('Runned!');
		return () => {};
	}, []);
*/
	if (!activeAddress) {
		return (
			<div className='w-full text-left mt-2 ml-2'>
				<div className='font-poppins font-normal text-dim-white'>
					<p className='text-white'>Connect an account first.</p>
				</div>
			</div>
		);
	}
	return (
		<div className='w-full text-left mt-2 ml-2'>
			<div className='font-poppins font-normal text-dim-white'>
				<p
					className='font-semibold text-white cursor-pointer'
					onClick={() => {
						if (activeAddress) checkBalance(activeAddress);
					}}
				>
					Balance:{' '}
					{algoBalance && <span className='font-normal'>{algoBalance}</span>}
				</p>
			</div>
			{nullifier && (
				<ToolTip tooltip={isCopied ? 'Copied' : 'Copy To Clipboard'}>
					<button
						type='button'
						onClick={() => {
							navigator.clipboard.writeText(nullifier);
							setIsCopied(true);
						}}
						className='font-semibold text-white cursor-pointer'
					>
						Nullifier: <span className='font-normal'>{nullifier}</span>
						<RxCopy />
					</button>
				</ToolTip>
			)}
		</div>
	);
};

export default Balance;
