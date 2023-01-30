import { useWallet } from '@txnlab/use-wallet';
import Image from 'next/image';

export default function Connect(props: { setShowModal: any }) {
	const { setShowModal } = props;
	const { providers, activeAccount } = useWallet();

	const activeLink =
		'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-dim-white text-md m-2 cursor-pointer hover:bg-white hover:text-site-black';
	// Map through the providers.
	// Render account information and "connect", "set active", and "disconnect" buttons.
	// Finally, map through the `accounts` property to render a dropdown for each connected account.
	return (
		<div>
			{providers?.map((provider) => (
				<div key={'provider-' + provider.metadata.id}>
					{provider.isConnected ? (
						<></>
					) : (
						<div
							onClick={() => {
								provider.connect();
								setShowModal(false);
							}}
							className={activeLink}
						>
							<img
								width={30}
								height={30}
								alt=''
								src={provider.metadata.icon}
								className='mr-4 '
							/>
							{provider.metadata.name} {provider.isActive && '[active]'}
						</div>
					)}
				</div>
			))}
		</div>
	);
}
