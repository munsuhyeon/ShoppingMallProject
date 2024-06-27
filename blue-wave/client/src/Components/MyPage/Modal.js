import React from 'react';
import PropTypes from 'prop-types';
const Modal = ({ isOpen, onClose, children, setModalIsOpen }) => {
    // 모달이 열려있지 않다면 null 반환
    if (!isOpen) return null;

    // 모달 닫기 핸들러
    const closeModal = () => {
        setModalIsOpen(false);
    };

    // 모달 외부를 클릭하면 모달 닫기
    const handleOutsideClick = (e) => {
        if (e.target === e.currentTarget) {
        closeModal();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOutsideClick}>
        <div className="modal">
            <div className='modal_body'>
            {children}
            </div>
        </div>
        </div>
    );
};

    Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    };

export default Modal;