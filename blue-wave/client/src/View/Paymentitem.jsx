export default function Paymentitem({ item }) {
  const orderTotal = item.quantity * item.price;

  // 가격 포맷팅 함수
  const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  return (
    <div className="product-info-flex">
      <img src={item.image} alt="" />
      <div className="product-info-box">
        <p className="product-name">{item.p_name}</p>
        <p className="product-option">
          {item.option}
          <span className="product-option-span">
            {formatPrice(orderTotal)} 원
          </span>
        </p>
        <p className="Paymentvalue">
          수량<span className="product-quantity">{item.quantity}</span>
        </p>
      </div>
    </div>
  );
}
