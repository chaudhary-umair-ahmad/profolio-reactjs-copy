# Profolio React — Tenant & Feature Overview

This document summarizes how the product behaves **across tenants**.

**Who this covers**

- **Zameen** — Pakistan (Zameen, and OLX where applicable).
- **Bayut KSA** — Saudi Arabia (Bayut).
- **GCC** — Bayut product for the **GCC region** (Bayut tenant builds in this footprint other than **Bayut KSA**). In this repository, **GCC** maps to `TENANT_KEY` values `oman` (Oman), `bahrain` (Bahrain), `qatar` (Qatar), `jordon` (Jordan), and `eg` (Egypt)—see `isGCCTenant` in `src/utility/env.js`. In prose below, **GCC** means that whole group unless a point applies only to **Bayut KSA** or **Zameen**.

---

## Authentication

1. **Bayut KSA and GCC** — In production there is typically **no standalone Profolio login screen**. Identity is handled through **Keycloak** when that integration is enabled for the build. **Bayut KSA** may relax Keycloak on specific **public** flows (for example magic post-ad) so those URLs stay usable without a full SSO round-trip.
2. **Zameen** — Keycloak is off for this tenant; **session cookies** carry auth in production, with a **dev-only login** where configured. Production assumes continuity with the classified property site.
3. **Traffic labeling** — Outgoing requests can be tagged so analytics and backends know whether traffic is **lite (member area)** vs **full Profolio**, and whether Keycloak headers apply.

---

## Member area vs Profolio (package user)

1. **Rule** — After the current user is normalized, **non–package users** are treated as **member area** (lite); **package users** get the **full Profolio** experience on the Profolio origin.
2. **Redirects** — Where **member area is a supported product**, the app can send users between the **classified** origin (lite) and the **Profolio** origin (pro) based on that package flag.
3. **Zameen normalization** — The mapped user is shaped so everyone is treated like a **package user** for that flag, which matches having **no separate member-area surface** for Pakistan in this stack.

---

## Identity & user model

1. **Bayut KSA and GCC** — Current user is loaded from the **shared Bayut account service** (“current user”) and mapped to app fields (platform linkage for Bayut vs Dubizzle, credits per brand, LMS eligibility, and so on).
2. **Zameen** — Profile and settings use **Zameen’s user APIs**; mapping handles **OLX linkage**, quota shifts, and which portals (Zameen vs Zameen+OLX) apply.

---

## Multi-platform (Bayut / Dubizzle / Zameen / OLX)

1. **GCC** — Product configuration lists **Bayut and Dubizzle**; stats and listings flows often need a **platform** choice so numbers stay per brand.
2. **Bayut KSA** — Centered on the **Saudi / Bayut** product; credit and stats modeling aligns **KSA** with the Bayut side rather than copying every dual-brand dashboard pattern used in **GCC** builds.
3. **Multi-platform flag on the user** — Drives whether the UI shows **brand switchers** and whether **per-section** context (dashboard, inbox, reports, etc.) tracks the selected brand.

---

## Listings

1. **Bayut KSA and GCC** — Listings use the **shared Bayut listings platform** (HTTP APIs, filters, payloads, and response mapping vary by country). **Bayut KSA** carries the richest **category and field** catalog.
2. **Zameen** — **Pakistan-specific** listings APIs and mappers, not the same contract as **Bayut KSA** or **GCC**.
3. **Keycloak-linked users (Bayut markets)** — When Keycloak is enabled, identifiers in stats and agency flows may use **external** user ids instead of internal ones.

---

## Post listing

1. **Default for GCC** — One **large, shared post-listing flow** implements create/edit for **GCC**: form state, checkout/cart where applicable, optional verification steps, and a **shared dynamic form** (sections driven by API field definitions). **GCC** tenants rely on this as-is when they export few screen overrides.
2. **Bayut KSA — extra layer on top of the default** — **Saudi Arabia** replaces that screen with a variant that still uses the **same shared dynamic form** underneath but wraps it with **KSA-only** behavior: **REGA** disclosure and related compliance, **Nafath** identity flows where required, rules for **non-Saudi nationals**, project-attached listing behavior, seasonal promos, discount campaigns, and other toggles driven by **Saudi configuration**. It is an **extension / wrapper** of the common Bayut journey, not a second unrelated form engine.
3. **Zameen — fully separate journey** — **Pakistan** uses its **own post-listing experience** end to end (different fields, integrations such as search, and flows). It does **not** reuse the large **Bayut** post-listing screen or the shared dynamic form stack used for **Bayut KSA** or **GCC**. **Reason:** product, legal, and backend contracts for **Zameen** diverged early enough that a dedicated implementation is maintained.
4. **Reuse of pieces** — Maps, media pickers, and some compliance helpers may still be **shared widgets** where **Zameen** and **Bayut** stacks need the same behavior.

---

## Credits, cart & checkout

1. **Bayut KSA and GCC** — Credits are normalized per brand (**Bayut** vs **Dubizzle**, with **KSA** aligned to Bayut-side credits). **Dashboard widgets** and filters scope by **user**. Credit subscribers can **see where spend went**, **buy top-ups and bundles**, and complete checkout with **safe return** after PSP (payment service provider) hand-off; **maintenance** and optional **event-style checkout** exist where configured.
2. **Zameen** — **Quota-first operations**: **allowance vs use**, **monthly credit purchase**, **contracts**, and **add-on purchases** through the shop with **order history**; **agency automation** (**auto utilization**) can move or consume **quota** across listings where the build ships it. Checkout is mostly **card** on **Zameen**, while **Bayut KSA** adds **buy now pay later** and **wallet-style** methods where configured.
3. **Analytics source** — Request metadata can mark **lite vs pro** origins for reporting.

---

## Agency & staff

1. **Tenant flags** — Invites, add-user forms, and staff management differ by market (**Bayut KSA** vs **Zameen** vs **GCC**). On **Bayut** member-area builds, agencies can **onboard colleagues** through invite flows when the product allows.
2. **Agency admin** — Enables **acting on behalf of the whole agency** in dashboards (including picking which agent’s stats to show) and changes how listing and stats APIs are scoped.

---

## Reports & analytics

1. **Bayut KSA and GCC** — Performance and dashboard data use the **shared Bayut / Profolio analytics stack** (trends, product stats, dashboard tiles). Credit / premium subscribers, when entitled, open **summary**, **listing-level**, and **leads-&-reach** style surfaces on that stack. **LMS** (lead and call tracking) layers on when enabled for the user and that market’s configuration.
2. **Zameen** — Uses **Pakistan (Zameen) dashboard** APIs and transformers, not the same dashboard contract as **Bayut KSA** or **GCC**.
3. **Per-tenant report modules** — **Bayut KSA** may use country-specific handlers; **GCC** builds often repeat **dual-brand** (Bayut + Dubizzle) parameter patterns. Each market can evolve independently.

---

## LMS (lead management / tracking)

1. **Feature flags** — Nested configuration turns **insights, performance tables, lead breakdowns**, and similar modules on or off.
2. **What ships when customers buy in** — **Lead and call intelligence**: **TruLeads**-style rollups, operational **lead lists**, and **LMS dashboards** so teams see who engaged, from which channel, and how follow-up is going—same stack, gated by **entitlement** and tenant config.
3. **By market** — **Bayut KSA** enables the **widest** set. In default **GCC** constants, **oman** and **eg** ship LMS with a **reduced** submodule set; **bahrain**, **qatar**, and **jordon** ship LMS **off**—**always trust that market’s configuration** over this document.
4. **Report bundling** — Graph requests may **merge** generic stats with LMS stats when tracking is allowed.

---

## Contracts & subscriptions

1. **Zameen** — **Contracts** are a first-class configuration area; shared dashboard logic **skips** contract calls when the tenant has not enabled them.

---

## Inbox, leads, notifications

1. **Zameen** — **Conversation-first** inbox and leads on **Pakistan** services (not the Bayut **email-leads** pattern); notification center behavior differs from **Bayut KSA**.
2. **Bayut KSA** — **Inbox** is **disabled** in the default route/menu (`HIDE_INBOX`), unlike other Bayut markets.
3. **GCC** — Uses the shared **email-leads** inbox stack; some modules still use **legacy query-string filters** on user id for notifications or listings.

---

## Localization & UX

1. **Bayut KSA and GCC** — **Arabic and English**, RTL where applicable. **Zameen** is typically **English-only** in language configuration.
2. **Money and numbers** — Currency symbol, fraction rules, and numeral style follow **tenant configuration** (e.g. **Zameen** may use **Indian** grouping for large numbers).
3. **Lite / marketing modes** — URL or theme detection can switch **fonts and chrome** for lightweight or marketing surfaces.

---

## Listings catalog extensions & REGA surfaces

1. **Listings data** — **Daily rental** category and redirection behavior are **KSA-specific** in the listings layer.
2. **REGA elsewhere** — **Footer**, **report-to-REGA**, and related surfaces use the same KSA compliance toggles as the post-listing journey.

---

## Engagement, trust & in-product communications

1. **Engagement & trust** — **Lead nudges** / **matching-lead** toasts, **national day** modal, **MoEngage** web push, **in-app notification center**, **profile completion** prompts, and **TrueCheck** where configured.

---

## Credit utilization prompts & AI-assisted listing copy

1. **Credits & copy** — **Smart credits utilisation** prompts; **locale-aware AI-assisted** listing title/description fields when enabled.

---

## Ad licensing & agent performance

1. **Ad license & agent metrics** — **Ad license** purchase and tracking where the market requires it; **agent performance** so managers can compare staff on activity and outcomes.

---

## Staff quota, listing upgrades & help channels

1. **Agency staff** — **Manage quota** flows where `MANAGE_QUOTA_ENABLED` applies (staff-level quota controls alongside **auto utilization** described under **Credits, cart & checkout**).
2. **Products & listings UX** — **Jeffi / videography** tied to upgrades and quota for supported slugs; **listing health** where the Zameen shell provides it; **quality tips** on listings.
3. **Help** — **Zendesk** is the primary help path (contrast with in-app **help & support** on many Bayut markets).

---

## Captcha, OTP hardening & per-market UI flags

1. **Captcha** — Defaults often enable **captcha on Keycloak OTP** endpoints for **GCC** tenants (pattern differs from **Zameen** / **Bayut KSA** defaults).
2. **UX flags** — **Service areas**, **help & support** entry, **room** property type, and **verified** listing icon differ by country—compare each tenant `constants`.

---

## Saved searches, brokerage programs & access governance

1. **Saved searches** — **Bayut** markets may enable the feature when configured; **Zameen** keeps it **off** in defaults.
2. **Convert to agency** — Available on Bayut markets where the tenant flag is on.
3. **TruBroker** — **TruPoints / leaderboard** UI exists, but **TruBroker**-wide features are **mostly off** in defaults (`TRU_BROKER_ENABLED`); **KSA** still ships **agent performance** separately.
4. **Session & abuse** — **Keycloak** builds can sync logout across tabs via a configured **`BroadcastChannel`** name; **Humbucker** loads from env when enabled.
5. **Access & packaging** — What each user can open respects **permissions**, **agency vs individual**, **currency / package-user** rules, and flags such as `HIDE_INBOX` and `HIDE_REPORTS`.

---
