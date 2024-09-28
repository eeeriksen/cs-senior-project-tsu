import { Close } from '../Icons/Close';
import './Modal.css'

export function Modal({ toggleModal, children }) {
    return (
        <div className="modal-overlay" onClick={toggleModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={toggleModal}>
                    <Close />
                </button>
                {children}
            </div>
        </div>
    );
}
