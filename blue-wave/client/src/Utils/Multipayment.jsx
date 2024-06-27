const MultiPayment = ({ paymentData, setSelectedPaymentMethod, index, onChange }) => {
  const { paymentName } = paymentData;

  return (
    <div>
      {paymentName === "카카오 페이" ? (
        <label htmlFor="payment_kakaopay">
          <input
            id="payment_kakaopay"
            className="payment_btn_kakaopay"
            type="radio"
            name="payment"
            value={paymentName}
            onChange={() => onChange(paymentData)}
            key="kakaopay" // 고유한 key prop 추가
          />
          <img src="http://localhost:8000/img/kakaopaylogo.png" alt="" className="kakaopay" />
          {paymentName}
        </label>
      ) : (
        <label htmlFor={`payment_${index}`}>
          <input
            id={`payment_${index}`}
            className="payment_btn_multi"
            type="radio"
            name="payment"
            value={paymentName}
            onChange={() => onChange(paymentData)}
            key={`payment_${index}`} // 고유한 key prop 추가
          />
          {paymentName}
        </label>
      )
      }
    </div>
  );
};

export default MultiPayment;
