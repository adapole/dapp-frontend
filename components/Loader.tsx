import Image from 'next/image';
const Loader = () => {
	return (
		<div className='flex justify-center items-center flex-col w-full min-h-full'>
			<Image
				src='/vercel.svg'
				alt='Logo'
				width={56}
				height={56}
				className='w-56 h-56 object-contain'
			/>
			<p className='font-poppins font-normal text-dim-white text-lg text-center mt-10'>
				Connect your wallet
			</p>
		</div>
	);
};

export default Loader;
/* Welcome to CoinFog, Algorand's first mixing application that
			<br />
			helps you keep your cryptocurrency private and secure!
			<br /> Our algorithm ensures your digital funds remain anonymous and
			untraceable,
			<br /> so you can have peace of mind knowing your funds are safe and
			secure.
			<br /> With CoinFog, you can trust that your financial privacy is our top
			priority.
			<br /> Connect a wallet and try it out! */
