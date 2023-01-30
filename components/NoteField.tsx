import { useState, useEffect, useRef } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const NoteField = (props: { value: string; setNoteValue: any }) => {
	const { value, setNoteValue } = props;
	const [eyeVis, seteyeVis] = useState(true);

	return (
		<div className='flex justify-between items-center flex-row w-full min-w-full bg-site-dim border-[1px] border-transparent hover:border-site-dim2 min-h-[96px] sm:p-8 p-4 rounded-[20px]'>
			<input
				placeholder='password'
				type={eyeVis ? 'text' : 'password'}
				value={value}
				disabled={false}
				onChange={(e) =>
					typeof setNoteValue === 'function' && setNoteValue(e.target.value)
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
	);
};

export default NoteField;
