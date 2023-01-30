const SliderDot = () => {
	return (
		<div className='flex justify-between items-center flex-row w-full min-w-full bg-site-dim border-[1px] border-transparent  min-h-[96px] sm:p-8 p-4 rounded-[20px]'>
			<div className='flex-col'>
				<input
					type='checkbox'
					disabled={false}
					checked={true}
					onChange={() => {}}
					className='w-full flex-1 bg-transparent outline-none font-poppins font-black text-2xl text-white cursor-pointer'
				/>
				<label className='cursor-pointer select-none'>5 Algo</label>
			</div>
			<div className='flex-col'>
				<input
					type='checkbox'
					disabled={true}
					onChange={() => {}}
					className='w-full flex-1 bg-transparent outline-none font-poppins font-black text-2xl text-white cursor-pointer'
				/>
				<label className='cursor-pointer select-none'>10 Algo</label>
			</div>
			<div className='flex-col'>
				<input
					type='checkbox'
					disabled={true}
					onChange={() => {}}
					className='w-full flex-1 bg-transparent outline-none font-poppins font-black text-2xl text-white cursor-pointer'
				/>
				<label className='cursor-pointer select-none'>50 Algo</label>
			</div>
			<div className='flex-col'>
				<input
					type='checkbox'
					disabled={true}
					onChange={() => {}}
					className='w-full flex-1 bg-transparent outline-none font-poppins font-black text-2xl text-white cursor-pointer'
				/>
				<label className='cursor-pointer select-none'>100 Algo</label>
			</div>
		</div>
	);
};

export default SliderDot;
