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

```bash
npm run lint
npm run typecheck
npm run test
npm run format:check
npm run build
```
