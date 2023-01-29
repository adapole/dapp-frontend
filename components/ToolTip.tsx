import { FC, ReactNode } from 'react';

interface Props {
	children: ReactNode;
	tooltip?: string;
}

const ToolTip: FC<Props> = ({ children, tooltip }): JSX.Element => {
	return (
		<div className='group relative inline-block'>
			{children}
			<span className='invisible group-hover:visible opacity-0 group-hover:opacity-100 transition p-1 rounded bg-site-dim2 text-white absolute top-full mt-2 whitespace-nowrap'>
				{tooltip}
			</span>
		</div>
	);
};

export default ToolTip;
