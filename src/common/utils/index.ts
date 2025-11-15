export const NAVER_COMMERCE_API = {
  BASE_URL: 'https://api.commerce.naver.com/external',
  AUTH: {
    TOKEN_URL: '/v1/oauth2/token',
  },
  ORDER: {
    GET_ORDER_URL: '/v1/pay-order/seller/orders/:orderId/product-order-ids', // 상품 목록조회
  },
};

export const parseProductOption = (optionText: string) => {
  const re =
    /이메일(?:\s*\([^)]*\))?\s*:\s*(?<email>[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})\s*\/\s*금액\s*:\s*(?<amount>[\d,]+)/u;

  const m = optionText.match(re);
  let email = '';
  let amount = '';
  if (m) {
    email = m?.groups?.email || '';
    amount = m?.groups?.amount || '';
  }
  return { email, amount };
};
