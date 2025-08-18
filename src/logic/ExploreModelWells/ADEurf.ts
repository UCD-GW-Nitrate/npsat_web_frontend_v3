import { erf } from "mathjs";

export function ADEurf(l: number, a: number, T: number){
    let out = [];
    out.push([0, 0]);
    var v = l/(a*365);
    var aL = 0.32 * Math.pow(l, 0.83);
    var D = aL*v + 1e-7;
    var c_prev = 0;
    var cc;
    for (let ii = 1; ii < T; ++ii){
      const c = ade(ii*365, v, l, D);
      cc = c - c_prev;
      if (cc < 0.000000001){
        cc = 0;
      }
      out.push([ii, cc]);
      c_prev = c;
      if (c > 0.98){
        break;
      }
  }
  return out;
}

function ade(t: number, v: number, x: number, D: number){
  var x_vt = x - v*t;
  var sqrDtx2 = 2*Math.sqrt(D*t);
  // var p1 = 0.5*erfc(x_vt/sqrDtx2);
  // var p2 = Math.sqrt(t*v*v/(Math.PI*D));
  // var p3 = Math.exp(-1.0*(x_vt*x_vt)/(4*D*t));
  // var p4 = 0.5 * (1+ v*x/D + t*v*v/D);
  // var p5 = Math.exp(v*x/D);
  // var p6 = erfc((x + v*t )/sqrDtx2)
  return  0.5*erfc(x_vt/sqrDtx2) + 
          Math.sqrt(t*v*v/(Math.PI*D)) * 
          Math.exp(-1.0*(x_vt*x_vt)/(4*D*t)) -
          0.5 * (1+ v*x/D + t*v*v/D) *
          Math.exp(v*x/D)*
          erfc((x + v*t )/sqrDtx2);
}

function erfc(x: number) {
    return 1-erf(x);
}
