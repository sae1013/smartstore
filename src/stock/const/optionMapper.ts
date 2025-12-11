import { ByProdCountry } from '../../common';

export const ORIGINAL_PRODUCT_ID: number = 12650488610;

export type OptionCombination = {
  id: number;
  stockQuantity: number;
  price: number;
  usable: boolean;
  optionName1: string;
  sellerManagerCode: string;
  optionValue: number | string;
};
export const BASE_PRICE: ByProdCountry<number> = {
  itunes: {
    india: 3000,
    turkey: 4000,
  },
};

export const OPTION_COMBINATIONS: ByProdCountry<OptionCombination[]> = {
  itunes: {
    india: [
      {
        id: 53712097198,
        stockQuantity: 100,
        price: 0,
        usable: true,
        optionValue: '100',
        optionName1: '100 루피',
        sellerManagerCode: 'option1',
      },
      {
        id: 53712097199,
        stockQuantity: 9,
        optionValue: '195',
        price: 2370,
        usable: true,
        optionName1: '195 루피',
        sellerManagerCode: 'option2',
      },
      {
        id: 53712097200,
        stockQuantity: 4,
        optionValue: '389',
        price: 7200,
        usable: true,
        optionName1: '389 루피',
        sellerManagerCode: 'option3',
      },
      {
        id: 53712097201,
        stockQuantity: 6,
        optionValue: '585',
        price: 12000,
        usable: true,
        optionName1: '585 루피',
        sellerManagerCode: 'option4',
      },
      // {
      //   id: 53712097202,
      //   stockQuantity: 5,
      //   optionValue: '1170',
      //   price: 23200,
      //   usable: true,
      //   optionName1: '1170 루피',
      //   sellerManagerCode: 'option5',
      // },
      // {
      //   id: 53712097203,
      //   stockQuantity: 2,
      //   price: 48900,
      //   optionValue: '2340',
      //   usable: true,
      //   optionName1: '2340 루피',
      //   sellerManagerCode: 'option6',
      // },
      {
        id: 54254624005,
        stockQuantity: 10,
        price: 19500,
        usable: true,
        optionValue: '1000',
        optionName1: '1000 루피',
        sellerManagerCode: 'option7',
      },
      {
        id: 54254624006,
        stockQuantity: 5,
        price: 41500,
        usable: true,
        optionValue: '2000',
        optionName1: '2000 루피',
        sellerManagerCode: 'option8',
      },
      {
        id: 54348085853,
        stockQuantity: 3,
        price: 50600,
        usable: true,
        optionValue: '2500',
        optionName1: '2500 루피',
        sellerManagerCode: 'option9',
      },
    ],
    turkey: [],
  },
};

export function createOptionMapperByValue(
  combinations: OptionCombination[],
): Record<string, OptionCombination> {
  return combinations.reduce(
    (acc, cur) => {
      acc[cur.optionValue] = cur;
      return acc;
    },
    {} as Record<string, OptionCombination>,
  );
}
