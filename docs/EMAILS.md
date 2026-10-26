# Velvet Shell — transactional emails

## From address (spam fix)

All mail is sent via **Resend** as:

`Velvet Shell <sales@velvetshell.in>`

- Set `RESEND_FROM_EMAIL` on **both** storefront and admin (local + Vercel).
- Code **never** falls back to `onboarding@resend.dev` (that domain is why owner mail hit Spam).
- Domain `velvetshell.in` must stay verified in the Resend dashboard.

## Templates

Shared layout: `lib/email/templates.js` (copied to `admin/lib/email/templates.js`).

Professional single card, mobile-width (~560px), sections for customer / items / totals (subtotal, shipping, discount + coupon, total) / payment / delivery / tracking as relevant.

---

## When mail fires · who gets it

| # | Trigger | Code path | Buyer | Owners (`ORDERS_NOTIFY_EMAIL` / `RESEND_TO_OWNER`) |
|---|---------|-----------|-------|-----------------------------------------------------|
| 1 | **Order paid / placed** (checkout succeeds) | Storefront `POST /api/orders` → `sendOrderEmails` in `lib/auth/mail.js` | Order confirmation (items, address, payment, totals, coupon) | “New order received” (SKU table, customer, payment, totals) |
| 2 | **Admin books Delhivery** (AWB created) | Admin `POST /api/orders/[id]/ship` → `sendShipmentEmails` in `admin/lib/mail.js` | Shipped + AWB + Track link | Shipment booked + AWB |
| 3 | **Delhivery marks delivered** (webhook) | Storefront `POST /api/webhooks/delhivery` → `sendShipmentEmails` | Delivered notice | Delivered notice |
| 4 | **Admin “Resend order email”** | Admin `POST /api/orders/[id]/notify` `{ type: "order" }` | Same as #1 | Same as #1 |
| 5 | **Admin “Resend tracking email”** | Admin notify `{ type: "shipped" }` | Same as #2 | Same as #2 |
| 6 | **Forgot password** | Storefront `POST /api/auth/forgot-password` → `sendPasswordResetEmail` | Reset code | — |
| 7 | **Gifting enquiry form** | Storefront `POST /api/gifting/enquiry` → `sendGiftingEnquiryEmail` | — | `GIFTING_NOTIFY_EMAIL` (fallback: order notify list) |

Owners are parsed from comma/semicolon lists in env (e.g. `info.velvetshell@gmail.com,sales@velvetshell.in`).  
`ADMIN_EMAIL` login username is **not** used as a mail recipient.

---

## Required env (storefront + admin production)

```
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=Velvet Shell <sales@velvetshell.in>
ORDERS_NOTIFY_EMAIL=info.velvetshell@gmail.com,sales@velvetshell.in
RESEND_TO_OWNER=info.velvetshell@gmail.com,sales@velvetshell.in
GIFTING_NOTIFY_EMAIL=info.velvetshell@gmail.com
NEXT_PUBLIC_SITE_URL=https://velvetshell.com
```

After deploy, use admin order → **Resend order email** / **Resend tracking email** to re-send the new templates for an existing order.
