# Lesson 2 — Choosing WordPress Hosting

### Why storage isn't the number that breaks

🎬 **Watch the lesson:** https://youtu.be/BQmJqJUNbYc
▶️ **Full playlist:** https://youtube.com/playlist?list=PLb08u3hzX6fmSB91z4Cxe8JXttkUqdqbM

---

## The idea in one line

A hosting plan's "50 GB storage · 200,000 visits/month · unlimited everything" tells you almost nothing about whether your store or course site slows down. The number that decides it is **how many requests have to run WordPress at the same time, without a full-page cache.** This lesson measures that breaking point on a local machine, names what causes it (PHP workers), and turns it into a method for reading any hosting plan.

## What you'll be able to do

- Tell a **cached** request from a **dynamic** one — and know which breaks under load
- Read a hosting plan by **PHP workers, CPU, RAM, and database**, not storage and visits
- Classify any site (brochure, store, membership, custom) by its same-time uncacheable requests
- Compare providers like-for-like and treat unpublished limits as unknown
- Run the experiment yourself and bring a real number to your next hosting decision

---

## What's in this folder

```
lesson-02-choosing-wordpress-hosting/
├── README.md                ← you are here
├── lab-guide.md             ← measure your own numbers (Query Monitor + k6)
├── load-test/
│   ├── README.md            ← step-by-step reproduction guide
│   ├── k6-loadtest.js       ← the exact load-test script from the video
│   └── loadtest-cached.html ← static stand-in for a fully cached page
└── resources/
    ├── hosting-comparison-checklist.pdf        ← evaluate any plan, field by field
    ├── woocommerce-lms-sizing-case-study.pdf   ← worked sizing for a store + courses
    └── enterprise-hosting-review-case-study.pdf ← review checklist for revenue-critical sites
```

## Reproduce the test (≈10 minutes)

You'll need a local WordPress site ([LocalWP](https://localwp.com), free) with [WooCommerce](https://wordpress.org/plugins/woocommerce/), and [k6](https://k6.io/docs/get-started/installation/) (free). Then follow **[load-test/README.md](load-test/README.md)** — it walks you through running the test against a cached page and your cart, and reading the results.

The reference numbers from the video (a 6-core laptop, 2 PHP workers):

| Target | p95 response | Requests/sec | Failures |
|--------|-------------:|-------------:|---------:|
| Cached static file | ~117 ms | 422 | 0% |
| Home page (cache off) | 13.6 s | 6.0 | 0% |
| WooCommerce cart | 10.4 s | 5.1 | 0% |

> These are **local numbers from one machine.** Yours will differ — the *shape* won't. Don't size production hosting from a local run; use it to learn the pattern, then confirm on staging or production-like hosting.

---

## A note on the resources

The **comparison checklist** is the reusable artifact from the lesson — capture each plan's category, exact plan, sites, storage, traffic model, runtime resources (CPU/RAM/workers/database), and operations. When a field isn't published, write "not published" and let that gap shape the decision.

The **case studies** apply the method end-to-end: one sizes a WooCommerce + LMS launch (≈20 courses, 1,000 students, 50–100 active at once); the other is the pre-launch review checklist for enterprise or brand-critical projects.

---

💬 **Did you run it?** Post the same-time load where *your* cart page starts to slow down — in the video comments or as an issue here.
