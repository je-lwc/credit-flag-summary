import { getRandom } from "./util";

export default function (
  accountId,
  creditRate,
  creditRate2,
  creditRate3,
  creditRate4
) {
  window.creditFlags = {
    accountId,
    creditRate,
    creditRate2,
    creditRate3,
    creditRate4,
  };
  return new Promise((resolve) =>
    setTimeout(
      () => resolve("Credit Flags processed Successfully"),
      getRandom(1, 500)
    )
  );
}