import React from 'react';

const OrderButton = ({ processPayment }) => {
  return (
    <button type="submit" onClick={processPayment}>
      결제하기
    </button>
  );
};

export default OrderButton;
