importScripts('../vendor/tn93.min.js');

const snps = (s1, s2) => {
  let n = Math.min(s1.length, s2.length);
  let sum = 0;
  for (let i = 0; i < n; i++) {
    let c1 = s1[i];
    let c2 = s2[i];
    sum += (c1 != c2) & (c1 != '-') & (c2 != '-');
  }
  return sum;
};

onmessage = function(e) {
  let start = Date.now();
  let subset = e.data.nodes,
    metrics = e.data.metrics,
    n = subset.length,
    s = e.data.strategy.toUpperCase(),
    t = 0;
  let output = metrics[0] == 'snps' ?
      new Uint16Array((n * n - n) / 2) :
      new Float32Array((n * n - n) / 2);
  for (let i = 0; i < n; i++) {
    let source = subset[i];
    for (let j = 0; j < i; j++) {
      output[t++] = metrics[0] == 'snps' ?
        snps(source['seq'], subset[j]['seq']) :
        tn93(source['seq'], subset[j]['seq'], s);
    }
  }
  console.log('Links Compute time: ', (Date.now() - start).toLocaleString(), 'ms');
  start = Date.now();
  postMessage({ links: output.buffer, start }, [output.buffer]);
  close();
};
