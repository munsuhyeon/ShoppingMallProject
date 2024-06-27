import React from 'react';

const OrderButton = ({ onClick  }) => {
  return (
    <button type="submit" onClick={onClick }>
      결제하기
    </button>
  );
};

export default OrderButton;
