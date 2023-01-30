import Head from 'next/head';
import Image from 'next/image';
import Modal from '../components/Modal';
import { useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import {
	useWallet,
	reconnectProviders,
	initializeProviders,
	WalletProvider,
} from '@txnlab/use-wallet';
import Loader from '../components/Loader';
import Mixer from '../components/Mixer';

const walletProviders = initializeProviders([], {
	network: 'testnet',
	nodeServer: 'https://testnet-api.algonode.cloud',
	nodeToken: '',
	nodePort: '',
});

const Home = () => {
	const x = useMotionValue(0);
	const y = useMotionValue(0);
	const rotateX = useTransform(y, [-100, 100], [30, -30]);
	const rotateY = useTransform(x, [-100, 100], [-30, 30]);
	// Reconnect the session when the user returns to the dApp
	useEffect(() => {
		reconnectProviders(walletProviders);
	}, []);

	const { activeAccount } = useWallet();

	return (
		<div>
			{/*<div className='flex min-h-screen flex-col items-center justify-center py-2'>*/}
			<Head>
				<title>Coin Fog</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<div className='flex justify-center min-h-screen sm:px-16 px-6 bg-site-black'>
				<div className='flex justify-between items-center flex-col max-w-[1280px] w-full'>
					<header className='flex flex-row justify-between items-center w-full sm:py-10 py-6'>
						<Image
							src='/coinfog_logo.jpg'
							alt='CoinFog Logo'
							width={72}
							height={16}
							className='rounded-full opacity-40 object-contain'
						/>
						<WalletProvider value={walletProviders}>
							<Modal />
						</WalletProvider>
					</header>
					<div className='flex-1 flex justify-start items-center flex-col w-full mt-10'>
						<h1 className='text-white font-poppins font-black text-5xl tracking-wide'>
							CoinFog
						</h1>
						<p className='text-dim-white font-poppins font-medium mt-3 text-base'>
							Privacy for tokens on Algorand
						</p>

						<motion.div
							style={{ x, y, rotateX, rotateY, z: 100 }}
							drag
							dragElastic={0.16}
							dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
							whileTap={{ cursor: 'grabbing' }}
							className='mt-10 w-full flex justify-center cursor-grab'
						>
							<div className='relative md:max-w-[700px] md:min-w-[500px] min-w-full max-w-full gradient-border p-[2px] rounded-3xl'>
								<div className='pink_gradient' />
								<div className='w-full min-h-[400px] bg-site-black backdrop-blur-[4px] rounded-3xl shadow-card flex p-10'>
									<motion.div
										style={{
											x,
											y,
											rotateX,
											rotateY,

											z: 10000,
										}}
										drag
										dragElastic={0.12}
										whileTap={{ cursor: 'grabbing' }}
										className='text-white'
									>
										<WalletProvider value={walletProviders}>
											{!activeAccount?.address ? <Loader /> : <Mixer />}
										</WalletProvider>
									</motion.div>
								</div>
								<div className='blue_gradient' />
							</div>
						</motion.div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
