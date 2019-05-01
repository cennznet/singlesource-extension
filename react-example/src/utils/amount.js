import BigNumber from 'bignumber.js';

export const weiToAmount = (
  wei: BigNumber,
  decimal: BigNumber | string = '1e18'
): BigNumber => {
  const decimalBN = new BigNumber(decimal);
  const balBN = new BigNumber(wei.toString());
  return balBN.div(decimalBN);
};

// TODO: change wei to cennz min unit
export const amountToWei = (
  amount: BigNumber,
  decimal: BigNumber | string = '1e18'
): BigNumber => {
  const decimalBN = new BigNumber(decimal);
  return amount.multipliedBy(decimalBN);
}