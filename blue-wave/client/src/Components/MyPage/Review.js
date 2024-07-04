import React, { useState } from 'react';
import Text  from './Text';
import Modal from "./Modal"

const Review = ({userId,orderId,productId,pname,mainimage}) => {

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };
 

  return (
    <div className="">
      <button className='review_btn' onClick={openModal} style={{cursor:'pointer'}}>리뷰쓰기</button>
      <Modal isOpen={modalIsOpen} onClose={closeModal}>
     <Text
      orderId={orderId}
      isClose={closeModal}
      userId={userId}
      productId={productId}
      pname={pname}
      mainimage={mainimage}
     />
     <button className="ReviewButton_x" onClick={closeModal}>X</button>
     </Modal>
     <p></p>

    </div>
  );
};

export default Review;