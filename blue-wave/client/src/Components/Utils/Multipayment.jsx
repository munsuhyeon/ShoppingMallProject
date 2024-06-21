

const MultiPayment = ({  paymentData,setSelectedPaymentMethod,index }) => {
  const { paymentName } =
    paymentData;
 

  return(
       <>
      {paymentName == "카카오 페이" ? (
        <>
        <label htmlFor="1">
        <input
        className="payment_btn_kakaopay"
        id="1"
        type="radio"
        name="payment"
        value={paymentName}
        onChange={() => setSelectedPaymentMethod(paymentData)}
        />
          {paymentName}</label>
        </>
        
      ) : (
        <>
        <label htmlFor={index}>
        <input
          id={index}
          className="payment_btn_multi"
          type="radio"
          name="payment"
          value={paymentName}
          onChange={() => setSelectedPaymentMethod(paymentData)}
        />
          {paymentName}</label>
        </>
      )}
    </>
    )
};

export default MultiPayment;
