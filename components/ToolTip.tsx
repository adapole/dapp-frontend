import { FC, ReactNode, useRef } from 'react';

interface Props {
	children: ReactNode;
	tooltip?: string;
}

const ToolTip: FC<Props> = ({ children, tooltip }): JSX.Element => {
	const tooltipRef = useRef<HTMLSpanElement>(null);
	const container = useRef<HTMLDivElement>(null);
	return (
		<div
			ref={container}
			onMouseEnter={({ clientX }) => {
				if (!tooltipRef.current || !container.current) return;
				const { left, right } = container.current.getBoundingClientRect();

				tooltipRef.current.style.left = clientX - 80 - left + 'px';
			}}
			className='group relative inline-block'
		>
			{children}
			<span
				ref={tooltipRef}
				className='invisible group-hover:visible opacity-0 group-hover:opacity-100 transition p-1 rounded bg-site-dim2 text-white absolute top-full mt-2 whitespace-nowrap'
			>
				{tooltip}
			</span>
		</div>
	);
};

export default ToolTip;
