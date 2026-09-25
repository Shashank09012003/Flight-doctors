# Flights Doctor — Website

![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel&logoColor=white)

Marketing and flight-enquiry website for **Flights Doctor**, an independent travel agency based in Parramatta, NSW, Australia. A single-page React app with a flight booking enquiry form, a contact page, and a full terms & conditions page — no custom backend, form submissions go out via Web3Forms.

🔗 Live site: [flightsdoctor.com.au](https://www.flightsdoctor.com.au)

## Features

- Flight enquiry / booking request form on the homepage — trip type, travellers, cabin class, dates
- Dedicated Contact page with form validation and an international phone input
- Terms & Conditions page with expandable sections
- Popular domestic routes with indicative pricing
- Testimonials, FAQ accordion, and scroll-reveal animations
- Serverless form handling via [Web3Forms](https://web3forms.com) — submissions land straight in email, no backend required
- Fully responsive, mobile-first layout

## Tech Stack

- **React** + **TypeScript**
- **Vite** — bundler mode, with a `@/*` → `src/*` path alias
- **Tailwind CSS**
- **Framer Motion** — page and section animations
- **Lucide React** — icons
- **react-phone-input-2** — phone number input on the Contact page
- **Web3Forms** — serverless form submission → email

## Project Structure

```
flight-doctors-main/
├── Assets/
│   └── Flights_Doctor_Logo_white_background.png
├── src/
│   ├── App.tsx          # All pages & components (Home, Terms, Contact)
│   ├── index.css        # Tailwind entry + global styles
│   ├── main.tsx          # React root
│   └── vite-env.d.ts
├── .env                  # Local environment variables (not committed)
├── .gitignore
├── vercel.json            # SPA rewrite rule for Vercel
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
Create a `.env` file in the project root:
```bash
VITE_WEB3FORMS_ACCESS_KEY=your_access_key_here
```
Get an access key from [web3forms.com](https://web3forms.com) — create it using the **info@flightsdoctor.com.au** inbox, since that's the address submissions will be delivered to (the key's registered email decides the destination, not any field in the code).

### 3. Run the dev server
```bash
npm run dev
```

### 4. Build for production
```bash
npm run build
```

## Routing

This project uses manual client-side routing (`history.pushState` / `popstate`) instead of a router library. There are three routes: `/`, `/terms`, and `/contact`. Because routing is fully client-side, the host needs an explicit fallback rule so that direct links and page refreshes on `/terms` or `/contact` don't 404. `vercel.json` handles this for Vercel:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## Deployment (Vercel)

1. Push the repo to GitHub — make sure `.env` is listed in `.gitignore` first.
2. Import the project in Vercel. It auto-detects the Vite preset (Build Command: `npm run build`, Output Directory: `dist`).
3. Add `VITE_WEB3FORMS_ACCESS_KEY` under **Project Settings → Environment Variables** (Production).
4. Deploy, then verify `/terms` and `/contact` load correctly on a direct visit and on refresh, and test both forms.
5. Connect the `flightsdoctor.com.au` domain under **Project Settings → Domains**.

## Contact

- 📍 Level 14, 3 Parramatta Square, 153 Macquarie St, Parramatta NSW 2150, Australia
- 📞 02 8759 7722
- ✉️ info@flightsdoctor.com.au
- 🌐 [www.flightsdoctor.com.au](https://www.flightsdoctor.com.au)

---
© Flights Doctor Pty Ltd
