import { useEffect } from 'react';
import WalletConnect from '@walletconnect/client';
import algosdk, { LogicSigAccount, Transaction } from 'algosdk';

export function getLogicSign(compiledContract: string) {
	if (!compiledContract) {
		return;
	}
	const program = new Uint8Array(Buffer.from(compiledContract, `base64`));
	return new LogicSigAccount(program, []);
}

export enum TransactionToSignType {
	UserTransaction,
	LsigTransaction,
	UserFeeTransaction,
	LsigFeeTransaction,
}

export interface TransactionToSign {
	transaction: Transaction;
	signer: WalletConnect | LogicSigAccount;
	type: TransactionToSignType;
}

export default function createTransactionToSign(
	transaction: Transaction,
	signer: undefined | LogicSigAccount,
	type: TransactionToSignType
) {
	return {
		transaction: transaction,
		signer: signer,
		type: type,
	} as TransactionToSign;
}

export const processTransactions = async (
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

export const useOnClickOutside = (ref: any, handler: any) => {
	useEffect(() => {
		const listener = (event: any) => {
			// Do nothing if clicking ref's element or descendent elements
			if (!ref.current || ref.current.contains(event.target)) {
				return;
			}
			handler(event);
		};

		document.addEventListener('mousedown', listener);
		document.addEventListener('touchstart', listener);

		return () => {
			document.removeEventListener('mousedown', listener);
			document.removeEventListener('touchstart', listener);
		};
	}, [ref, handler]);
};

export const hash = async (message: string) => {
	const utf8 = new TextEncoder().encode(message);
	const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray
		.map((bytes) => bytes.toString(16).padStart(2, '0'))
		.join('');
	return hashHex;
};

export const getRndInteger = (min: number, max: number) => {
	return Math.floor(Math.random() * (max - min)) + min;
};
