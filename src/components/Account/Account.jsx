import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow'
import { useNavigate } from 'react-router-dom'
import { RecommendationForm } from '../RecommendationForm'
import { useModal } from '../../hooks/useModal';
import { useStore } from '../../store'
import { BackArrow } from '../Icons';
import { Modal } from '../Modal';
import './Account.css';

const apiUrl = import.meta.env.VITE_API_URL;

export const Account = () => {
    const { isModalOpen, toggleModal } = useModal();
    const [error, setError] = useState(null);
    const [deleteText, setDeleteText] = useState('');
    const [isLoadingDeletion, setIsLoadingDeletion] = useState(false);
    const { user } = useStore(
        useShallow((state) => ({
            user: state.user,
        }))
    );
    const navigate = useNavigate();

    const deleteAccount = async () => {
        setError(null);
        setIsLoadingDeletion(true);

        try {
            const response = await fetch(`${apiUrl}/user/delete-account`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: user.username }),
            });

            const data = await response.json();

            if (response.status === 200) {
                setDeleteText('');
                toggleModal();
                toast('Account deleted successfully');
                setTimeout(() => {
                    navigate('/');
                }, 3000);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Error: ' + err.message);
        } finally {
            setIsLoadingDeletion(false);
        }
    };

    const confirmDelete = () => {
        if (deleteText !== "DELETE") {
            setError('Type DELETE to confirm account deletion');
        } else {
            deleteAccount();
        }
    };

    const handleBackButton = () => {
        navigate('/');
    }

    return (
        <section className="account-section">
            <button className="back-button" onClick={handleBackButton}>
                <BackArrow />
            </button>
            <div className="account-deletion-page">
                <h1 className="page-title">Manage Account</h1>
                <div>
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <p className="form-value">{user.username}</p>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <p className="form-value">{'•'.repeat(12)}</p>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Creation Date</label>
                        <p className="form-value">{user.createdAt}</p>
                    </div>
                </div>
                <div className="button-container">
                    <button
                        onClick={toggleModal}
                        className="btn-delete"
                    >
                        Delete Account
                    </button>
                </div>
            </div>
            {isModalOpen && (
                <Modal toggleModal={toggleModal}>
                    <>
                        <h3>Are you sure you want to delete your account?</h3>
                        <p>If you are sure, type <span>DELETE</span> in the input below.</p>
                        <input
                            value={deleteText}
                            onChange={(e) => setDeleteText(e.target.value)}
                            type="text"
                        />
                        <div className="modal-buttons">
                            <button
                                className="confirm-button"
                                onClick={confirmDelete}
                                disabled={isLoadingDeletion}
                            >
                                Yes, Delete
                            </button>
                            <button
                                className="cancel-button"
                                onClick={toggleModal}
                                disabled={isLoadingDeletion}
                            >
                                Cancel
                            </button>
                        </div>
                        {error && <p className="error-text">{error}</p>}
                    </>
                </Modal>
            )}
            <section className="submit-recommendations">
                <div className="container">
                    <RecommendationForm />
                </div>
            </section>
        </section>
    );
};