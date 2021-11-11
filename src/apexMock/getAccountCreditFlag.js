import { getRandom } from './util';

export default function () {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve({
        CREDIT_RATE__c: creditRate,
        CREDIT_RATE2__c: creditRate2,
        CREDIT_RATE3__c: creditRate3,
        CREDIT_RATE4__c: creditRate4
      });
    }, getRandom(1, 500))
  );
}
