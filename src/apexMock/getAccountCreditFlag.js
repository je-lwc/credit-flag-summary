import { getRandom } from "./util";

export default function () {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(window.creditFlags || {});
    }, getRandom(1, 500))
  );
}
