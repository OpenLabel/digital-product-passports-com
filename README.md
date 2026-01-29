# Digital Product Passports

An open-source, self-hostable Digital Product Passport (DPP) generator for EU compliance.

Supports wine e-labels, batteries, textiles, electronics, toys, and more product categories.

---

## 🚀 Self-Hosting Quick Start

### What You Need

| Service | Required? | Purpose |
|---------|-----------|---------|
| [Supabase](https://supabase.com) | ✅ Yes | Database & Auth (free tier available) |
| [Resend](https://resend.com) | ✅ Yes | Sending emails (free tier: 100 emails/day) |
| [Lovable](https://lovable.dev) | ❌ Optional | AI features only |

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) → Sign up (free)
2. Click **"New Project"** → Name it → Set a database password → Create
3. Wait ~2 minutes for provisioning

### Step 2: Get Your Supabase Credentials

Go to **Settings** → **API** and copy:

| Value | Example | Where to find it |
|-------|---------|------------------|
| Project URL | `https://abcdef.supabase.co` | Under "Project URL" |
| Anon Key | `eyJhbGci...` | Under "Project API keys" → anon/public |
| Project ID | `abcdef` | The subdomain from the URL |

### Step 3: Set Up the Database

Install the Supabase CLI and push the schema:

```bash
# Install Supabase CLI
npm install -g supabase

# Clone the repository
git clone https://github.com/OpenLabel/digital-product-passports-com.git
cd digital-product-passports-com

# Login and link to your project
supabase login
supabase link --project-ref YOUR_PROJECT_ID

# Push database schema (creates all tables and security policies)
supabase db push
```

### Step 4: Get Your Resend API Key (Required)

Resend is used to send counterfeit report emails. Free tier includes 100 emails/day.

1. Go to [resend.com](https://resend.com) → Sign up (free)
2. After signup, go to **API Keys**: [resend.com/api-keys](https://resend.com/api-keys)
3. Click **"Create API Key"**
4. Give it a name (e.g., "DPP Platform") → Click **"Add"**
5. **Copy the key immediately** (starts with `re_`) — you won't see it again!

### Step 5: Configure Supabase Secrets

Now add your API keys to Supabase:

```bash
# REQUIRED: Paste your Resend API key (the one starting with re_)
supabase secrets set RESEND_API_KEY=re_xxxxxxxxxx

# OPTIONAL: Only needed for AI features (wine label scanning)
# Get this from https://lovable.dev if you want AI autofill
supabase secrets set LOVABLE_API_KEY=your_key_here
```

> ⚠️ **Important**: For Resend to work in production, you must also [verify your sending domain](https://resend.com/domains). Until then, you can only send to your own email address.

### Step 6: Deploy Edge Functions

```bash
supabase functions deploy send-counterfeit-request
supabase functions deploy wine-label-ocr
supabase functions deploy get-public-passport
```

### Step 7: Deploy the Frontend

Choose one of these options:

#### Option A: Vercel (Recommended)

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FOpenLabel%2Fdigital-product-passports-com&env=VITE_SUPABASE_URL,VITE_SUPABASE_PUBLISHABLE_KEY,VITE_SUPABASE_PROJECT_ID)

Set these environment variables during deployment:
- `VITE_SUPABASE_URL` = Your Project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` = Your Anon Key
- `VITE_SUPABASE_PROJECT_ID` = Your Project ID

#### Option B: Railway

[![Deploy to Railway](https://railway.com/button.svg)](https://railway.com/template/new?template=https%3A%2F%2Fgithub.com%2FOpenLabel%2Fdigital-product-passports-com&envs=VITE_SUPABASE_URL,VITE_SUPABASE_PUBLISHABLE_KEY,VITE_SUPABASE_PROJECT_ID)

#### Option C: Docker

```bash
docker build -t dpp-platform .
docker run -p 80:80 \
  -e VITE_SUPABASE_URL=https://your-project.supabase.co \
  -e VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key \
  -e VITE_SUPABASE_PROJECT_ID=your-project-id \
  dpp-platform
```

#### Option D: Manual Build

```bash
npm install
npm run build
# Serve the 'dist' folder with any static file server
```

### Step 8: Complete Setup

1. Visit your deployed app
2. The first visitor is automatically the admin and sees the setup wizard
3. Fill in your company details (for EU legal compliance)
4. Done! You can now create and manage Digital Product Passports

---

## ✅ Checklist Summary

Before your first visit, make sure you have:

- [ ] Created a Supabase project
- [ ] Pushed the database schema (`supabase db push`)
- [ ] Set `RESEND_API_KEY` as a Supabase secret
- [ ] Deployed all 3 edge functions
- [ ] Deployed the frontend with the 3 environment variables

---

## Features

- 🍷 **Wine E-Labels**: Full EU Regulation 2021/2117 compliance
- 🔋 **Battery Passports**: Carbon footprint and recycling info
- 👕 **Textile Passports**: Care instructions and composition
- 🤖 **AI Autofill**: Scan wine labels to extract data (optional)
- 📱 **QR Codes**: Generate scannable codes for each passport
- 🌍 **Multi-language**: All 24 EU official languages
- 🔒 **Self-Hosted**: Full data sovereignty

---

## AI Features (Optional)

To enable AI-powered wine label scanning:

1. Get an API key from [lovable.dev](https://lovable.dev)
2. Set it: `supabase secrets set LOVABLE_API_KEY=your_key`
3. Check "Enable AI" during setup

Without this key, AI buttons are hidden but everything else works.

---

## Security

- All API keys stored as Supabase secrets (never in code)
- Row Level Security (RLS) on all tables
- Users can only see their own passports
- Public passports accessible without login (by design)
- First visitor to `/setup` becomes admin

---

## Development

```bash
npm install
npm run dev      # Start dev server
npm run test     # Run tests
npm run build    # Production build
```

---

## License

**GNU Affero General Public License v3.0 (AGPL-3.0)**

See [LICENSE](LICENSE) file.

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

---

## Support

- **GitHub Issues**: Report bugs
- **Discussions**: Ask questions
