# Iván Sarapura — Personal portfolio

Bilingual portfolio built with Next.js 16, React 19, TypeScript and Tailwind CSS 4. The contact section sends direct messages through Resend and protects the Server Action with Vercel BotID.

## Local development

Use Node.js 22 or newer, install dependencies and create your local environment file:

```bash
npm install
cp .env.example .env.local
npm run dev
```

The site is available at [http://localhost:3000](http://localhost:3000). English is served at `/` and Spanish at `/es`.

## Contact form configuration

The form uses Resend's outbound Emails API. Resend Receiving and inbound webhooks are not required.

1. In Resend, add and verify a sending subdomain such as `mail.your-domain.com`.
2. Create an API key with sending access limited to that domain.
3. Set the following server-only variables locally and in Vercel:

```dotenv
RESEND_API_KEY=re_xxxxxxxxx
RESEND_FROM_EMAIL=contact@mail.your-domain.com
CONTACT_TO_EMAIL=your-private-inbox@example.com
```

`RESEND_FROM_EMAIL` must belong to the verified domain. `CONTACT_TO_EMAIL` is the private inbox that receives form submissions. The visitor's address is set as `Reply-To`; it is never used as the sender.

Also set `NEXT_PUBLIC_SITE_URL` to the canonical production URL. Do not prefix any secret with `NEXT_PUBLIC_`.

### Vercel setup

- Enable OIDC for the project so BotID can verify requests in production.
- Keep BotID Basic enabled; optionally enable Deep Analysis in the Firewall dashboard.
- Configure a WAF rate-limit rule for contact-form POST requests if traffic warrants it.
- Add the environment variables to Production, Preview and Development as appropriate.

The Vercel CLI is optional but useful for synchronizing configuration:

```bash
npm i -g vercel
vercel env pull
```

## Quality checks

The design tokens, component contracts and contribution rules are documented in
[`docs/design-system.md`](docs/design-system.md).

```bash
npm run lint
npm run lint:design
npm run typecheck
npm run test
npm run format:check
npm run build
npm run test:e2e
```

### End-to-end, accessibility and visual tests

The Playwright suite owns and starts a controlled `next start` production server on port 3100; it
will not reuse a server started outside the test run. Build first, then run the suite. Install the
evergreen browser engines once after `npm install`:

```bash
npx playwright install chromium firefox webkit
npm run build
npm run test:e2e
```

Chromium runs the complete suite, including the visual matrix. Firefox and WebKit run axe,
interactions, media preferences, responsive reflow and target checks. The suite covers English and
Spanish routes, list/detail pages, both themes, keyboard/menu/filter/form interactions, forced
colors, reduced motion, 320 px reflow and pointer targets. Axe enforces WCAG 2.2 AA without rule
exclusions. Versioned Ubuntu 24.04/Chromium snapshots cover eight routes at 390×844 and 1440×900,
critical interactive states, and focused below-fold desktop regions. The viewport matrix catches
page-level regressions without fragile giant full-page captures; focused screenshots give denser
coverage to representative home, footer, blog-list and article content.

After an intentional visual change, regenerate the complete Chromium baseline in production. The
update command builds the application, owns its `next start` server and serially replaces all 46
Ubuntu 24.04/Chromium snapshots; review every generated image before committing the baseline:

```bash
npm run test:e2e:update
```

Ejecuta este comando en Ubuntu 24.04, el entorno canónico de snapshots Linux/Chromium. En
macOS o Windows Playwright escribe referencias bajo otra carpeta de plataforma y no reemplaza
los baselines canónicos.

Failure artifacts are written to `test-results/`; the local HTML report is written to
`playwright-report/`. Both are ignored by Git.

Automated reflow at 320 px complements, but does not replace, the required manual browser check at
200% zoom and a screen-reader review.
