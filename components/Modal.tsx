import { useState } from 'react';
import Image from 'next/image';
import { AiOutlineClose } from 'react-icons/ai';
import { useWallet } from '@txnlab/use-wallet';
import Connect from './Connect';
import ToolTip from './ToolTip';

export default function Modal() {
	const [showModal, setShowModal] = useState(false);
	const { providers, activeAccount } = useWallet();
	return (
		<>
			{activeAccount?.address ? (
				<>
					{providers?.map((provider) => (
						<div key={'provider-' + provider.metadata.id}>
							{provider.isConnected ? (
								<div className='absolute right-0'>
									{provider.isActive && provider.accounts.length && (
										<div className='flex justify-center items-center mr-4'>
											<ToolTip tooltip='Click to Disconnect'>
												<Image
													onClick={provider.disconnect}
													src={provider.metadata.icon}
													alt='Disconnect'
													width={30}
													height={30}
													className='rounded-full hover:cursor-pointer'
												/>
											</ToolTip>
											<select
												value={activeAccount?.address}
												onChange={(e) =>
													provider.setActiveAccount(e.target.value)
												}
												className='bg-transparent text-dim-white border-0'
											>
												{provider.accounts.map((account) => (
													<option key={account.address} value={account.address}>
														{account.address.substring(0, 4)}
														{'...'}
														{account.address.substring(
															account.address.length - 4
														)}
													</option>
												))}
											</select>
										</div>
									)}
								</div>
							) : (
								<></>
							)}
						</div>
					))}
				</>
			) : (
				<button
					className='bg-site-pink border-none outline-none px-6 py-2 font-poppins font-bold text-lg text-white rounded-xl leading-[24px] hover:bg-pink-600 transition-all'
					type='button'
					onClick={() => setShowModal(true)}
				>
					Connect wallet
				</button>
			)}
			{showModal ? (
				<>
					<div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-site-dim2'>
						<div className='relative w-auto my-6 mx-auto max-w-3xl'>
							{/*content*/}
							<div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-site-black outline-none focus:outline-none'>
								{/*header*/}
								<div className='flex  justify-between p-5 border-b border-solid border-slate-200 rounded-t items-center'>
									<h3 className='text-3xl font-semibold text-dim-white'>
										Connect a Wallet
									</h3>
									<button
										className='p-1 ml-auto bg-transparent border-0 float-right text-3xl leading-none font-semibold outline-none focus:outline-none'
										onClick={() => setShowModal(false)}
									>
										<span className='bg-transparent text-white opacity-50 rounded-full h-6 w-6 text-2xl block outline-none focus:outline-none hover:text-white hover:bg-site-dim2 hover:opacity-80 hover:animate-[spin_2s_ease-in-out]'>
											<AiOutlineClose />
										</span>
									</button>
								</div>
								{/*body*/}
								<Connect setShowModal={setShowModal} />
								{/*footer
								<div className='flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b'>
									<button
										className='text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
										type='button'
										onClick={() => setShowModal(false)}
									>
										Close
									</button>
								</div>
								
								<button
												className='bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
												type='button'
												onClick={provider.disconnect}
											>
												Disconnect
											</button>
								*/}
							</div>
						</div>
					</div>
					<div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
				</>
			) : null}
		</>
	);
}
