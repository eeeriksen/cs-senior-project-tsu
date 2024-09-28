import { useState } from 'react';

export const useModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => setIsModalOpen(isModalOpen => !isModalOpen);

    return {
        isModalOpen,
        toggleModal,
    };
};