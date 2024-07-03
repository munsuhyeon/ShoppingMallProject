// 반품/교환 정보

import React from "react";
import "./InformationSection.css";

const InformationSection = () => {
  return (
    <section id="Information">
      <div className="Notation">
        <h4>배송 정보</h4>
        <div className="Notation-Details">
          <table>
            <thead>
              <tr>
                <th>배송방법</th>
                <th>순차배송</th>
                <th rowSpan="2">배송비</th>
                <th rowSpan="2">
                  무료배송 - 배송 상품 중 19,800원 이상 구매 시 무료배송 -
                  도서산간 지역 추가비용 없음
                </th>
              </tr>
              <tr>
                <th>묶음배송 여부</th>
                <th>가능</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th rowSpan="4">배송기간</th>
                <th className="Delivery">
                  ㆍ블루웨이브 배송 지역 : 주문 및 결제 완료 후, 1-2일 이내 도착
                  <br />
                  ㆍ블루웨이브 미배송 지역 : 주문 및 결제 완료 후, 2-3일 이내
                  도착
                  <br />
                  - 도서 산간 지역 등은 하루가 더 소요될 수 있습니다. 곧
                  고객님께도 블루웨이브가 찾아갈 수 있도록 노력하겠습니다
                  <br />
                  ㆍ천재지변, 물량 수급 변동 등 예외적인 사유 발생 시, 다소
                  지연될 수 있는 점 양해 부탁드립니다.
                </th>
                <th></th>
                <th></th>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="Notation-Details2">
          <h4>교환/반품 안내</h4>
          <p>
            ㆍ교환/반품에 관한 일반적인 사항은 판매자가 제시사항보다 관계법령이
            우선합니다.
            <br />
            다만, 판매자의 제시사항이 관계법령보다 소비자에게 유리한 경우에는
            판매자 제시사항이 적용됩니다.
          </p>
          <table>
            <tbody>
              <tr>
                <th>교환/반품 비용</th>
                <th>
                  ㆍ멤버십 회원: 무료로 반품/교환 가능
                  <br />
                  ㆍ멤버십 회원 아닌 경우:
                  <br />
                  1&#41; [총 주문금액] - [반품 상품금액] = 19,800원 미만인 경우
                  반품비 5,000원
                  <br />
                  2&#41; [총 주문금액] - [반품 상품금액] = 19,800원 이상인 경우
                  반품비 2,500원
                </th>
              </tr>
              <tr>
                <th>묶음배송 여부</th>
                <th>가능</th>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="Notation-Details3">
          <h4>교환/반품 제한사항</h4>
          <p>
            ㆍ주문/제작 상품의 경우, 상품의 제작이 이미 진행된 경우
            <br />
            ㆍ상품 포장을 개봉하여 사용 또는 설치 완료되어 상품의 가치가 훼손된
            경우 (단, 내용 확인을 위한 포장 개봉의 경우는 예외)
            <br />
            ㆍ고객의 사용, 시간경과, 일부 소비에 의하여 상품의 가치가 현저히
            감소한 경우
            <br />
            ㆍ세트상품 일부 사용, 구성품을 분실하였거나 취급 부주의로 인한
            파손/고장/오염으로 재판매 불가한 경우
            <br />
            ㆍ모니터 해상도의 차이로 인해 색상이나 이미지가 실제와 달라, 고객이
            단순 변심으로 교환/반품을 무료로 요청하는 경우
            <br />
            ㆍ제조사의 사정 (신모델 출시 등) 및 부품 가격 변동 등에 의해 무료
            교환/반품으로 요청하는 경우
            <br />
          </p>
        </div>
        <p>※ 각 상품별로 아래와 같은 사유로 취소/반품이 제한될 수 있습니다.</p>
        <div className="Notation-Details4">
          <table>
            <tbody>
              <tr>
                <th>의류/잡화/수입명품</th>
                <th>
                  ㆍ상품의 택(TAG) 제거, 라벨 및 상품 훼손, 구성품 누락으로
                  상품의 가치가 현저히 감소된 경우
                </th>
              </tr>
              <tr>
                <th>계절상품/식품/화장품</th>
                <th>
                  ㆍ신선/냉장/냉동 상품의 단순변심의 경우
                  <br />
                  ㆍ뷰티 상품 이용 시 트러블(알러지, 붉은 반점, 가려움,
                  따가움)이 발생하는 경우, 진료 확인서 및 소견서 등을 증빙하면
                  환불이 가능 (제반비용 고객부담)
                </th>
              </tr>
              <tr>
                <th>전자/가전/설치상품</th>
                <th className="Delivery">
                  ㆍ설치 또는 사용하여 재판매가 어려운 경우
                  <br />
                  ㆍ상품의 시리얼 넘버 유출로 내장된 소프트웨어의 가치가 감소한
                  경우 (내비게이션, OS시리얼이 적힌 PMP)
                  <br />
                  ㆍ홀로그램 등을 분리, 분실, 훼손하여 상품의 가치가 현저히
                  감소하여 재판매가 불가할 경우 (노트북, 데스크탑 PC 등)
                </th>
              </tr>
              <tr>
                <th>자동차용품</th>
                <th className="Delivery">
                  ㆍ상품을 개봉하여 장착한 이후 단순변심인 경우
                </th>
              </tr>
              <tr>
                <th>CD/DVD/GAME/ BOOK</th>
                <th className="Delivery">
                  ㆍ복제가 가능한 상품의 포장 등을 훼손한 경우
                </th>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="Notation-Details5">
          <h4>판매자 정보</h4>
          <table>
            <tbody>
              <tr>
                <th>상호/대표자</th>
                <th>Blue Wave</th>
                <th>사업장 소재지</th>
                <th>이젠아카데미</th>
              </tr>
              <tr>
                <th>e-mail</th>
                <th>Bluewave@Bluewave.com</th>
                <th>연락처</th>
                <th>1111-1111</th>
              </tr>
              <tr>
                <th>통신판매업 신고번호</th>
                <th>1111-인천-1111</th>
                <th>사업자번호</th>
                <th>111-11-11111</th>
              </tr>
            </tbody>
          </table>
          <p>
            미성년자가 체결한 계약은 법정대리인이 동의하지 않는 경우 본인 또는
            법정대리인이 취소할 수 있습니다. 쿠팡은 통신판매중개자로서
            통신판매의 당사자가 아니며, 광고, 고시정보, 상품 주문, 배송 및
            환불의 의무와 책임은 각 판매자에 있습니다.
          </p>
        </div>
      </div>
    </section>
  );
};

export default InformationSection;
