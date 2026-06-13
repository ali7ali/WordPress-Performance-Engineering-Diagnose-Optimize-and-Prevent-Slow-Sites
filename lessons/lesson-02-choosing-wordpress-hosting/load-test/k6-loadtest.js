// WordPress Performance Course — Lesson 2: hosting load test
// Run this against YOUR OWN local site only. Never load-test a site you do not own.
// -----------------------------------------------------------------------------
// WHAT THIS MEASURES
//   How one URL behaves as more requests arrive at the SAME TIME.
//   Run it three times (one URL each) and compare the summaries:
//
//     1) a static .html file   -> page-cached best case (no PHP, no database)
//     2) the WordPress home /   -> a cacheable page with cache OFF (full PHP)
//     3) the WooCommerce /cart/ -> a request caching can NEVER remove
//
//   The cached run stays flat. The dynamic runs bend upward as concurrency
//   rises -- that bend is requests waiting for a free PHP worker.
//
// HOW TO RUN (PowerShell, from the folder containing this file):
//   k6 run -e TARGET=https://your-site.local/loadtest-cached.html k6-loadtest.js
//   k6 run -e TARGET=https://your-site.local/                     k6-loadtest.js
//   k6 run -e TARGET=https://your-site.local/cart/                k6-loadtest.js
//
//   Screenshot each end-of-run summary. Read:
//     http_req_duration .... p(95)   = 95th percentile latency
//     http_reqs ............ .../s   = throughput (requests per second)
//     http_req_failed ...... %       = share of failed/timed-out requests
//     status_*  counters ... which status codes the failures actually were
//
//   READING A RUN WITH MANY FAILURES (like the cart):
//     The headline p(95) mixes fast error pages into the latency number and
//     becomes misleadingly LOW. Use the `{ expected_response:true }` row for
//     the real latency of pages that rendered, and `http_req_failed` for the
//     share that never did.
//
//   If everything stays fast (strong machine), raise the numbers in `stages`
//   below (e.g. 50 -> 100) and re-run until the dynamic p95 visibly climbs.
// -----------------------------------------------------------------------------

import http from 'k6/http';
import { check } from 'k6';
import { Counter } from 'k6/metrics';

// Per-status counters so the summary shows WHICH errors occurred under load
// (e.g. 502/503 = PHP worker pool exhausted; 403/429 = a security/rate-limit
// plugin interfering -- disable it and re-run).
const statusCounters = {
  200: new Counter('status_200'),
  403: new Counter('status_403'),
  429: new Counter('status_429'),
  500: new Counter('status_500'),
  502: new Counter('status_502'),
  503: new Counter('status_503'),
  504: new Counter('status_504'),
};
const statusOther = new Counter('status_other');
const statusTimeout = new Counter('status_timeout_or_network'); // status 0

// Target URL is passed on the command line with -e TARGET=...
const TARGET = __ENV.TARGET || 'https://your-site.local/';

export const options = {
  // LocalWP uses a self-signed certificate; ignore cert validation locally.
  insecureSkipTLSVerify: true,

  // Concurrency staircase: hold at 10, then 30, then 50 simultaneous users.
  // Each `target` is the number of virtual users (VUs) sending requests at once.
  stages: [
    { duration: '10s', target: 10 },  // ramp up to 10 concurrent users
    { duration: '20s', target: 10 },  // hold 10
    { duration: '10s', target: 30 },  // ramp to 30
    { duration: '20s', target: 30 },  // hold 30
    { duration: '10s', target: 50 },  // ramp to 50
    { duration: '20s', target: 50 },  // hold 50  <-- watch p95 here
    { duration: '5s',  target: 0 },   // ramp down
  ],

  // Pass/fail lines so the summary is easy to read at a glance.
  // (A failing threshold does NOT stop the test; it just flags the result.)
  thresholds: {
    http_req_failed: ['rate<0.01'],     // <1% errors is healthy
    http_req_duration: ['p(95)<800'],   // 95% of responses under 800ms is healthy
  },
};

export default function () {
  const res = http.get(TARGET);
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  if (res.status === 0) {
    statusTimeout.add(1);
  } else if (statusCounters[res.status]) {
    statusCounters[res.status].add(1);
  } else {
    statusOther.add(1);
  }
}
