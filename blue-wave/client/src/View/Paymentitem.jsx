export default function Paymentitem({item}) {
  const orderTotal = item.quantity * item.price  
  
  return (
        <div className="product-info-flex">
        <img
          src={item.image}
          alt=""
        />
        <div className="product-info-box">
          <p className="product-name">{item.p_name}</p>
          <p className="product-option">{item.option}<span className="product-option-span">{orderTotal}</span></p>
          <p>수량<span className="product-quantity">{item.quantity}</span></p>
        </div>
      </div>

   
    )
}