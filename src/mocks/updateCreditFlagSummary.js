import { getRandom } from './util';

export default function ({ accountId, creditRate, creditRate2, creditRate3, creditRate4 }) {
  window.creditFlags = {
    accountId,
    creditRate,
    creditRate2,
    creditRate3,
    creditRate4
  };
  console.log('update flags', window.creditFlags);
  return new Promise((resolve) =>
    setTimeout(() => resolve('Credit Flags processed Successfully'), getRandom(30000, 30000))
  );
}
