import { erf } from 'mathjs';

function erfc(x: number) {
  return 1 - erf(x);
}

function ade(t: number, v: number, x: number, D: number) {
  const val = x - v * t;
  const sqrDtx2 = 2 * Math.sqrt(D * t);

  return (
    0.5 * erfc(val / sqrDtx2) +
    Math.sqrt((t * v * v) / (Math.PI * D)) *
      Math.exp((-1.0 * (val * val)) / (4 * D * t)) -
    0.5 *
      (1 + (v * x) / D + (t * v * v) / D) *
      Math.exp((v * x) / D) *
      erfc((x + v * t) / sqrDtx2)
  );
}

export function ADEurf(l: number, a: number, T: number) {
  const out = [];
  const v = l / (a * 365);
  const aL = 0.32 * l ** 0.83;
  const D = aL * v + 1e-7;
  let cPrev = 0;
  let cc;

  out.push([0, 0]);
  for (let ii = 1; ii < T; ii += 1) {
    const c = ade(ii * 365, v, l, D);
    cc = c - cPrev;

    if (cc < 0.000000001) {
      cc = 0;
    }

    out.push([ii, cc]);
    cPrev = c;

    if (c > 0.98) {
      break;
    }
  }

  return out;
}
