# Reproduce the Lesson 2 load test

This is the exact test from the video. Run it against **your own local WordPress site only** — never against a site you do not own or a live server.

## What you need

1. A local WordPress site (the video uses [LocalWP](https://localwp.com), free) with [WooCommerce](https://wordpress.org/plugins/woocommerce/) and one product in the cart.
2. [k6](https://k6.io/docs/get-started/installation/) — a free load-testing tool. On Windows: `winget install k6 --source winget`.
3. The two files in this folder: `k6-loadtest.js` and `loadtest-cached.html`.

## Setup (2 minutes)

Copy `loadtest-cached.html` into your site's web root (in LocalWP: right-click the site → Reveal in Explorer → `app\public`). Confirm it opens at `https://your-site.local/loadtest-cached.html`. This static file stands in for a fully page-cached response: no PHP, no database.

## Run the three tests

From the folder containing `k6-loadtest.js` (replace the domain with your site's):

```powershell
k6 run -e TARGET=https://your-site.local/loadtest-cached.html k6-loadtest.js
k6 run -e TARGET=https://your-site.local/                     k6-loadtest.js
k6 run -e TARGET=https://your-site.local/cart/                k6-loadtest.js
```

Each run ramps up to 50 simultaneous virtual users over about 95 seconds and prints a summary.

## How to read the summary

- `http_req_duration → p(95)` — the response time 95 out of 100 requests stayed under.
- `http_reqs → .../s` — requests served per second.
- `http_req_failed` — the share of requests that failed.
- `status_…` counters — which status codes the failures were. 502/503 means the PHP worker pool gave out (that is the lesson working). 403/429 means a security or rate-limit plugin interfered — disable it and re-run.

**If a run has many failures** (the cart probably will): the headline `p(95)` becomes misleadingly *low*, because fast error pages get mixed into it. Read the `{ expected_response:true }` row instead — that is the real response time of the pages that actually rendered.

## What you should see

The static file stays flat. The dynamic pages climb — and may start failing — as users stack up. Find the user level where *your* cart's response time starts to climb: that is the number your hosting has to survive. Your absolute numbers will differ from the video (different machine, different worker count); the shape will hold.

If everything stays fast, your machine is strong — raise the `target` values in the `stages` block (e.g. 50 → 100) and re-run.

**Don't size production hosting from these local numbers.** The load generator and the server share one machine here. Use the test to learn the pattern, then repeat it on staging or production-like hosting before you commit.
