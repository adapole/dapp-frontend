import { createContext, ReactNode, useContext, useState } from 'react';

type ContextProviderProps = {
	children: ReactNode;
};
const initialValue = {
	showModal: false,
	handleToggle: (e: boolean) => {},
};
const StateContext = createContext(initialValue);

export const useShowModal = () => {
	return useContext(StateContext);
};

export const ContextProvider = ({ children }: ContextProviderProps) => {
	const [showModal, setShowModal] = useState(false);

	const handleToggle = (e: boolean) => {
		setShowModal(e);
	};

	return (
		// eslint-disable-next-line
		<StateContext.Provider value={{ handleToggle, showModal }}>
			{children}
		</StateContext.Provider>
	);
};
