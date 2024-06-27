
export default function Paymentcompleteitem({cartCompleteData}) {
    const{p_name,option,quantity} = cartCompleteData;
    return (
        <>
          <ul className="payment-product">
            <li>
              <p>결제상품명</p>
              <span>{p_name}</span>
            </li>
            <li>
              <p>옵션</p>
              <span>{option}</span>
            </li>
            <li>
              <p>수량</p>
              <span>{quantity}개</span>
            </li>
          </ul>
        </>
    )
}