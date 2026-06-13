# Lesson 2 — Measurement Lab: capture your own numbers

This is the hands-on version of the experiment in the video. You run it once on **your own local WordPress site**, and you finish with two pieces of evidence:

1. The cost of **one** request (how long WordPress takes to build a page, and how many database queries it runs).
2. What happens to that page when **many** requests arrive at once.

Together they prove the lesson's core claim:

> **A site's hosting need is set by the requests that caching cannot remove — not by "visits per month."**

Everything here is free and reproducible. Nothing is faked.

> ⚠️ **Run this against a local site you own.** Never load-test a site you don't control or a live production server.

---

## What you need

| Tool | Why | Get it |
|------|-----|--------|
| LocalWP | A free local WordPress site to test against | https://localwp.com |
| WooCommerce | Gives you a real dynamic page (the cart) | https://wordpress.org/plugins/woocommerce/ |
| Query Monitor | Shows page build time + query count | https://wordpress.org/plugins/query-monitor/ |
| k6 | Free load-testing tool | https://k6.io/docs/get-started/installation/ |
| The files in `load-test/` | The test script and a cached-page stand-in | this folder |

Set up: a LocalWP site with WooCommerce active, at least one product, and that product added to the cart so `/cart/` renders a real cart.

---

## Part 1 — The cost of one request (Query Monitor)

1. Activate **Query Monitor** and make sure you're logged in (its panel only appears for admins).
2. Open your **home page**. In the Query Monitor admin bar, read the **Page Generation Time** and the **total queries**. Note them down.
3. Open your **cart page** (`/cart/`) and read the same two numbers.

You'll see the cart costs more to build than the home page, and runs more queries. The key difference isn't the size of the numbers — it's that **the home page can be cached and the cart cannot.** A page cache serves the home page as a finished file with no PHP. The cart changes per visitor, so it has to run WordPress every single time.

> Query Monitor only appears when WordPress actually builds the page, so every number you see is the real, uncached cost.

---

## Part 2 — The cost under load (k6)

You'll hit three addresses on the same site with a rising number of virtual users, and watch how each one holds up.

### Set up the cached stand-in

Copy `load-test/loadtest-cached.html` into your site's web root. In LocalWP: right-click the site → **Reveal in Explorer** → `app\public`. Confirm it opens at `https://your-site.local/loadtest-cached.html`. This static file represents a fully page-cached response: no PHP, no database.

### Run the three tests

From the `load-test/` folder, replacing the domain with your site's:

```bash
k6 run -e TARGET=https://your-site.local/loadtest-cached.html k6-loadtest.js
k6 run -e TARGET=https://your-site.local/                     k6-loadtest.js
k6 run -e TARGET=https://your-site.local/cart/                k6-loadtest.js
```

Each run ramps up to 50 virtual users over about 95 seconds and prints a summary.

### Read each summary

- `http_req_duration → p(95)` — the response time 95 of 100 requests stayed under.
- `http_reqs → .../s` — requests served per second.
- `http_req_failed` — the share that failed.
- `status_…` counters — what the failures were. **502/503** means the PHP worker pool ran out (that's the lesson working). **403/429** means a security or rate-limit plugin interfered — disable it and re-run.

> **If a run has many failures** (the cart often will), the headline `p(95)` looks misleadingly *low*, because fast error pages get averaged in. Read the `{ expected_response:true }` row instead — that's the real latency of the pages that actually rendered.

---

## Part 3 — See the cause (optional but convincing)

While the **cart** test is running, open **Task Manager → Details** and count the `php-cgi.exe` processes. On a default LocalWP site there are only about **two**. That's your PHP worker count — two slots building pages one at a time, with 50 virtual users queued behind them. That queue *is* the climb you measured.

---

## What you should see

The cached file stays flat no matter how many users pile on, because no PHP runs. The dynamic pages climb — and may start failing — as users stack up. Find the user level where **your** cart's response time starts to rise: **that is the number your hosting has to survive.**

Your absolute numbers will differ from the video (different machine, different worker count). The shape will hold.

If everything stays fast, your machine is strong — raise the `target` values in the `stages` block of `k6-loadtest.js` (e.g. 50 → 100) and re-run.

> **Don't size production hosting from these local numbers.** The load generator and the server share one machine here. Use the test to learn the pattern, then repeat it on staging or production-like hosting before you commit to a plan.

---

Bring the number you found to the **[hosting comparison checklist](resources/hosting-comparison-checklist.pdf)** and the hosting decision becomes much easier to defend.
