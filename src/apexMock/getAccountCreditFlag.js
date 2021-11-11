import { getRandom } from './util';

export default function () {
  return new Promise((resolve) => {
    const f = window.creditFlags || {};
    setTimeout(() => {
      resolve({
        CREDIT_RATE__c: f.creditRate,
        CREDIT_RATE2__c: f.creditRate2,
        CREDIT_RATE3__c: f.creditRate3,
        CREDIT_RATE4__c: f.creditRate4
      });
    }, getRandom(1, 500));
  });
}
