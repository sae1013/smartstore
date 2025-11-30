export interface OrderInfo {
  orderId: string; //
  productOrderId: string; // '2025111166846551',
  lastChangedType: string; // 'PAYED',
  paymentDate: string; // '2025-11-11T17:03:28.207+09:00',
  lastChangedDate: string; //'2025-11-11T17:03:28.000+09:00';
  productOrderStatus: string; //'PAYED';
  receiverAddressChanged: boolean;
}

export interface SmartstoreResponse<TData> {
  code: string;
  message: string;
  data: TData;
}

export interface LastChangedStatus {
  lastChangeStatuses: OrderInfo[];
  more?: {
    moreFrom: string;
    moreSequence: string;
  };
}

export interface IOrderDetail {
  orderId: string; // 2025111139447091
  ordererNo: string; // 204154814
  ordererId: string; // jmw9****
  ordererName: string; // 정민우
  ordererTel: string; // 010-8361-9220
}

export interface IProductOrderDetail {
  quantity: number; // 2
  productOrderId: string;
  productOrderStatus: string; // PAYED
  productOption: string; // 상품코드를 받으실 이메일: sae1013@gmail.com / 금액: 195 루피
  productName: string; // 애플 인도 앱스토어 아이튠즈 기프트카드 (리딤코드 발송)
  shippingAddress: {
    tel1: string; // 수신자 번호
  };
}

export interface OrderDetail {
  order: IOrderDetail;
  productOrder: IProductOrderDetail;
}

export type OrderDetailResponse = SmartstoreResponse<OrderDetail[]>;

/**

 [
 {
 order: {
 orderId: '2025111139447091',
 orderDate: '2025-11-11T17:02:50.484+09:00',
 ordererId: 'jmw9****',
 ordererNo: '204154814',
 ordererName: '정민우',
 ordererTel: '010-8361-9220',
 isDeliveryMemoParticularInput: 'false',
 paymentDate: '2025-11-11T17:03:28.207+09:00',
 paymentMeans: '신용카드 간편결제',
 payLocationType: 'PC',
 orderDiscountAmount: 0,
 generalPaymentAmount: 2800,
 naverMileagePaymentAmount: 0,
 chargeAmountPaymentAmount: 0,
 payLaterPaymentAmount: 0,
 isMembershipSubscribed: false
 },
 productOrder: {
 productOrderId: '2025111166846551',
 quantity: 1,
 initialQuantity: 1,
 remainQuantity: 1,
 totalProductAmount: 2800,
 initialProductAmount: 2800,
 remainProductAmount: 2800,
 totalPaymentAmount: 2800,
 initialPaymentAmount: 2800,
 remainPaymentAmount: 2800,
 productOrderStatus: 'PAYED',
 productId: '12488813490',
 productName: '애플 인도 앱스토어 아이튠즈 기프트카드 (리딤코드 발송)',
 unitPrice: 2800,
 productClass: '조합형옵션상품',
 originalProductId: '12432324531',
 merchantChannelId: '102761766',
 deliveryAttributeType: 'NORMAL',
 placeOrderDate: '2025-11-11T17:03:28.404+09:00',
 placeOrderStatus: 'OK',
 shippingDueDate: '2025-11-14T23:59:59.000+09:00',
 expectedDeliveryMethod: 'NOTHING',
 packageNumber: '2025111144922071',
 itemNo: '52635195021',
 productOption: '상품코드를 받으실 이메일: sae1013@gmail.com / 금액: 100 루피',
 optionCode: '52635195021',
 optionPrice: 0,
 mallId: 'ncp_1p3wpw_01',
 inflowPath: '검색>쇼핑검색(네이버쇼핑)',
 inflowPathAdd: 'undefined',
 productDiscountAmount: 0,
 initialProductDiscountAmount: 0,
 remainProductDiscountAmount: 0,
 sellerBurdenDiscountAmount: 0,
 shippingAddress: [Object],
 commissionRatingType: '결제수수료',
 commissionPrePayStatus: 'GENERAL_PRD',
 paymentCommission: 101,
 saleCommission: 0,
 knowledgeShoppingSellingInterlockCommission: 84,
 channelCommission: 0,
 expectedSettlementAmount: 2615,
 taxType: 'TAX_EXEMPTION'
 }
 }
 ]


 */
