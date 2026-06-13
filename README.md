# WordPress Performance Engineering — Diagnose, Optimize, and Prevent Slow Sites

A free, measurement-first video course on making WordPress fast and _keeping_ it fast. Every lesson is built on the same principle: **don't guess, measure.** We find the slow layer with real tools, prove what's happening with numbers, then fix it — and the techniques transfer to any WordPress, WooCommerce, or LMS site.

This repository holds the companion materials for the course: lab guides, runnable load tests, checklists, and case studies. Everything here is reproducible on your own machine.

▶️ **Watch the full playlist:** https://youtube.com/playlist?list=PLb08u3hzX6fmSB91z4Cxe8JXttkUqdqbM

---

## Who this is for

- WordPress developers and freelancers who want to stop guessing about performance
- WooCommerce and LMS site owners who need their sites to hold up under real traffic
- Anyone who has ever been told "just buy better hosting" and wanted to know _which_ number actually matters

You don't need to be a sysadmin. The tools are free, the labs run on a local site, and each lesson explains the _why_ before the _how_.

---

## Lessons

| #   | Lesson                                                               | Status                                   | Materials                                                  |
| --- | -------------------------------------------------------------------- | ---------------------------------------- | ---------------------------------------------------------- |
| 1   | How WordPress Actually Loads a Page                                  | 🎬 On YouTube                            | —                                                          |
| 2   | Choosing WordPress Hosting: Why Storage Isn't the Number That Breaks | 🎬 [Watch](https://youtu.be/BQmJqJUNbYc) | [Materials](lessons/lesson-02-choosing-wordpress-hosting/) |
| 3   | The Real Causes of Slow WordPress Sites                              | ⏳ Coming soon                           | —                                                          |
| 4   | Caching Done Properly                                                | ⏳ Coming soon                           | —                                                          |
| 5   | Database Performance and Query Mistakes                              | ⏳ Coming soon                           | —                                                          |
| 6   | Plugin and Theme Performance Auditing                                | ⏳ Coming soon                           | —                                                          |
| 7   | Frontend Performance for WordPress                                   | ⏳ Coming soon                           | —                                                          |
| 8   | WooCommerce and Dynamic Site Optimization                            | ⏳ Coming soon                           | —                                                          |
| 9   | Server, PHP, and Hosting-Level Optimization                          | ⏳ Coming soon                           | —                                                          |
| 10  | Debugging Performance Like an Engineer                               | ⏳ Coming soon                           | —                                                          |
| 11  | Common WordPress Mistakes and How to Prevent Them                    | ⏳ Coming soon                           | —                                                          |
| 12  | A Professional Local WordPress Debugging Environment                 | ⏳ Coming soon                           | —                                                          |
| 13  | Xdebug with LocalWP and VS Code                                      | ⏳ Coming soon                           | —                                                          |
| 14  | Profiling WordPress with Xdebug and Cachegrind                       | ⏳ Coming soon                           | —                                                          |
| 15  | WP-CLI, Logs, Reproducing Bugs, and Evidence-Based Fixes             | ⏳ Coming soon                           | —                                                          |

Materials are added here as each lesson is published. ⭐ **Star the repo** and **subscribe to the playlist** to follow along.

---

## How to use this repo

Each published lesson lives under `lessons/` and is self-contained. Open the lesson's own `README.md` first — it links the video and explains what every file is for. Most lessons include a hands-on lab you run on a **local** WordPress site (the course uses the free [LocalWP](https://localwp.com)).

> ⚠️ **Run load tests against your own local site only** — never against a site you don't own or a live production server.

---

## What's inside Lesson 2

[Lesson 2](lessons/lesson-02-choosing-wordpress-hosting/) is the first lesson with a full materials pack:

- A **runnable k6 load test** that reproduces the exact experiment from the video — watch a cached page stay flat while the cart page climbs from ~0.1s to 10+ seconds under load.
- A **hosting comparison checklist** (PDF) for evaluating any plan by what actually matters: PHP workers, CPU, RAM, and database — not storage and "visits per month."
- Two worked **case studies** (PDF): sizing a WooCommerce + LMS site, and an enterprise-grade hosting review checklist.

---

## License

The materials in this repository are released under [CC BY 4.0](LICENSE) — you're free to use, adapt, and share them, including commercially, as long as you give credit. Please link back to the course.

## Author

Created by **Ali Ali** as part of the _WordPress Performance Engineering_ course.
Questions, corrections, and reproductions are welcome — open an issue or reply in the video comments.
