# Digital Product Passports

An open-source, self-hostable Digital Product Passport (DPP) generator for EU compliance.

Supports wine e-labels, batteries, textiles, electronics, toys, and more product categories.

---

## 🌐 Just Want to Create a DPP?

**No setup required!** Use our free hosted service:

👉 **[digital-product-passports.com](https://www.digital-product-passports.com/)**

Create compliant Digital Product Passports in minutes, no installation needed.

---

## 🖥️ Self-Hosting Options

There are **two ways** to self-host this application:

| Option | Best For | Complexity |
|--------|----------|------------|
| **Supabase Cloud** | Most users, quick setup | ⭐ Easy |
| **Self-Hosted Supabase** | Air-gapped environments, full control | ⭐⭐⭐ Advanced |

---

## Option 1: Supabase Cloud (Recommended)

Use Supabase's free cloud tier for the easiest setup.

### Prerequisites

Create free accounts on:

1. **[Supabase](https://supabase.com)** — Database & Authentication (free tier: 500MB, 2 projects)
2. **[Resend](https://resend.com)** — Email notifications (free tier: 100 emails/day)

### One-Command Setup

```bash
git clone https://github.com/OpenLabel/digital-product-passports-com.git
cd digital-product-passports-com
chmod +x setup.sh
./setup.sh
```

**The interactive `setup.sh` script handles everything:**

| Step | What it does |
|------|--------------|
| 1 | Checks prerequisites (Node.js, npm, Supabase CLI) |
| 2 | Prompts for your Supabase credentials |
| 3 | Prompts for your Resend API key |
| 4 | Connects and links your Supabase project |
| 5 | Pushes the database schema |
| 6 | Configures all secrets securely |
| 7 | Deploys edge functions |
| 8 | Generates your `.env` file |
| 9 | Installs npm dependencies |

After completion, run `npm run build` and deploy the `dist` folder!

---

## Option 2: Self-Hosted Supabase (Full Control)

For enterprise, air-gapped, or fully on-premises deployments, you can run Supabase itself on your own servers using Docker.

### Why Self-Host Supabase?

- ✅ **100% data sovereignty** — Everything runs on your infrastructure
- ✅ **Air-gapped deployments** — No external network calls
- ✅ **No vendor lock-in** — Full control over your stack
- ✅ **Compliance** — Meet strict regulatory requirements (GDPR, etc.)

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Your Infrastructure                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────────────────────────┐   │
│  │   Frontend   │    │      Self-Hosted Supabase        │   │
│  │   (React)    │───▶│  ┌────────────────────────────┐  │   │
│  │              │    │  │  PostgreSQL   (database)   │  │   │
│  └──────────────┘    │  │  GoTrue       (auth)       │  │   │
│         │            │  │  PostgREST    (API)        │  │   │
│         │            │  │  Storage      (files)      │  │   │
│         ▼            │  │  Edge Runtime (functions)  │  │   │
│  ┌──────────────┐    │  │  Studio       (dashboard)  │  │   │
│  │    Nginx     │    │  └────────────────────────────┘  │   │
│  │  (optional)  │    └──────────────────────────────────┘   │
│  └──────────────┘                                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Step 1: Deploy Self-Hosted Supabase

Follow the official Supabase self-hosting guide:

📖 **[Supabase Self-Hosting with Docker](https://supabase.com/docs/guides/self-hosting/docker)**

Quick start:

```bash
# Clone Supabase Docker setup
git clone --depth 1 https://github.com/supabase/supabase
cd supabase/docker

# Copy example config
cp .env.example .env

# ⚠️ IMPORTANT: Edit .env and change these values:
# - POSTGRES_PASSWORD (use a strong password)
# - JWT_SECRET (generate with: openssl rand -base64 32)
# - ANON_KEY (generate at https://supabase.com/docs/guides/self-hosting#api-keys)
# - SERVICE_ROLE_KEY (generate at same URL)

# Start Supabase
docker compose up -d
```

Your self-hosted Supabase will be available at:
- **API**: `http://localhost:8000`
- **Studio Dashboard**: `http://localhost:3000`

### Step 2: Configure This Application

Create a `.env` file pointing to your self-hosted Supabase:

```bash
# Point to your self-hosted Supabase instance
VITE_SUPABASE_URL=http://localhost:8000
VITE_SUPABASE_PUBLISHABLE_KEY=your-generated-anon-key
VITE_SUPABASE_PROJECT_ID=self-hosted
```

> **Production note**: Replace `localhost` with your actual server hostname/IP.

### Step 3: Apply Database Schema

Connect to your self-hosted PostgreSQL and run the migrations:

```bash
# Option A: Using Supabase CLI (if configured)
supabase db push --db-url postgresql://postgres:your-password@localhost:5432/postgres

# Option B: Using psql directly
psql postgresql://postgres:your-password@localhost:5432/postgres < supabase/migrations/*.sql
```

### Step 4: Configure Edge Functions

For self-hosted Supabase, you have two options for backend functions:

**Option A: Supabase Edge Runtime (Docker)**

The self-hosted Docker setup includes `supabase/edge-runtime`. Deploy functions to it:

```bash
# Copy functions to the edge-runtime volume
docker cp supabase/functions/. supabase-edge-functions:/home/deno/functions/
```

**Option B: Run as Standalone Deno Server**

If you prefer not to use edge-runtime, the functions can run as a standalone Deno server:

```bash
cd supabase/functions
deno run --allow-net --allow-env --allow-read index.ts
```

### Step 5: Set Secrets for Functions

For self-hosted deployments, set environment variables directly:

```bash
# In your docker-compose.yml or .env for edge functions:
RESEND_API_KEY=re_xxxxxxxxxx
LOVABLE_API_KEY=your_key_here  # Optional, for AI features
```

### Step 6: Build and Deploy Frontend

```bash
npm install
npm run build
# Deploy 'dist' folder to your web server (Nginx, Apache, etc.)
```

### Production Checklist for Self-Hosted

- [ ] Use HTTPS (TLS certificates via Let's Encrypt or similar)
- [ ] Set strong passwords for PostgreSQL and JWT secrets
- [ ] Configure firewall rules (only expose ports 80/443)
- [ ] Set up automated backups for PostgreSQL
- [ ] Monitor disk space (especially for storage bucket)
- [ ] Configure log rotation
- [ ] Set up health checks / monitoring

---

## 📋 Manual Setup (Cloud Option)

If you prefer to run commands manually, or if you're on Windows without WSL:

<details>
<summary>Click to expand manual instructions</summary>

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) → Sign up (free)
2. Click **"New Project"** → Name it → Set a database password → Create
3. Wait ~2 minutes for provisioning

### Step 2: Get Your Supabase Credentials

Go to **Settings** → **API** and note these values:

| Value | Where to find it |
|-------|------------------|
| Project ID | The subdomain from your URL (e.g., `abcdef` from `https://abcdef.supabase.co`) |
| Project URL | Full URL like `https://abcdef.supabase.co` |
| Anon Key | Under "Project API keys" → starts with `eyJ...` |

### Step 3: Install Supabase CLI and Push Schema

```bash
# Install Supabase CLI globally
npm install -g supabase

# Login (opens browser)
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_ID

# Push database schema
supabase db push
```

### Step 4: Get Your Resend API Key

1. Go to [resend.com](https://resend.com) → Sign up (free)
2. Navigate to [resend.com/api-keys](https://resend.com/api-keys)
3. Click **"Create API Key"** → Give it a name → **"Add"**
4. **Copy the key immediately** (starts with `re_`) — you won't see it again!

> ⚠️ **For production**: Verify your sending domain at [resend.com/domains](https://resend.com/domains)

### Step 5: Set Secrets

```bash
# Required: Resend API key
supabase secrets set RESEND_API_KEY=re_xxxxxxxxxx

# Optional: Lovable API key (for AI features)
supabase secrets set LOVABLE_API_KEY=your_key_here
```

### Step 6: Deploy Backend Functions

```bash
supabase functions deploy send-counterfeit-request --no-verify-jwt
supabase functions deploy wine-label-ocr --no-verify-jwt
supabase functions deploy get-public-passport --no-verify-jwt
```

### Step 7: Create Environment File

Create a `.env` file in the project root:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...your-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-id
```

### Step 8: Build and Deploy

```bash
npm install
npm run build
# Deploy the 'dist' folder to your web server
```

</details>

---

## 🖥️ Frontend Deployment Options

After setup, deploy the `dist` folder using any of these options:

### Vercel (Recommended for Cloud)

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FOpenLabel%2Fdigital-product-passports-com&env=VITE_SUPABASE_URL,VITE_SUPABASE_PUBLISHABLE_KEY,VITE_SUPABASE_PROJECT_ID)

### Railway

[![Deploy to Railway](https://railway.com/button.svg)](https://railway.com/template/new?template=https%3A%2F%2Fgithub.com%2FOpenLabel%2Fdigital-product-passports-com&envs=VITE_SUPABASE_URL,VITE_SUPABASE_PUBLISHABLE_KEY,VITE_SUPABASE_PROJECT_ID)

### Docker

```bash
docker build -t dpp-platform .
docker run -p 80:80 \
  -e VITE_SUPABASE_URL=https://your-project.supabase.co \
  -e VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key \
  -e VITE_SUPABASE_PROJECT_ID=your-project-id \
  dpp-platform
```

### Static Hosting (Nginx, Apache, etc.)

Just upload the contents of the `dist` folder to your web server.

---

## 🔧 Final Setup

After deploying:

1. Visit your app URL
2. The first visitor sees the setup wizard
3. Enter your company details (required for EU compliance)
4. Done! Start creating Digital Product Passports

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🍷 **Wine E-Labels** | Full EU Regulation 2021/2117 compliance |
| 🔋 **Battery Passports** | Carbon footprint and recycling info |
| 👕 **Textile Passports** | Care instructions and composition |
| 🤖 **AI Autofill** | Scan wine labels to extract data (optional) |
| 📱 **QR Codes** | Generate scannable codes for each passport |
| 🌍 **24 Languages** | All EU official languages supported |
| 🔒 **Self-Hosted** | Full data sovereignty |

---

## 🤖 AI Features (Optional)

To enable AI-powered wine label scanning:

1. Get an API key from [lovable.dev](https://lovable.dev)
2. Set it: `supabase secrets set LOVABLE_API_KEY=your_key`
3. The AI button will appear in wine passport forms

Without this key, AI buttons are hidden but everything else works.

---

## 🔒 Security

- All API keys stored as Supabase secrets (never in code)
- Row Level Security (RLS) on all tables
- Users can only see their own passports
- Public passports accessible without login (by design)
- First visitor to `/setup` becomes admin

---

## 💻 Development

```bash
npm install
npm run dev      # Start dev server
npm run test     # Run tests
npm run build    # Production build
```

---

## 📜 License

**GNU Affero General Public License v3.0 (AGPL-3.0)**

See [LICENSE](LICENSE) file.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

---

## ❓ Support

- **GitHub Issues**: Report bugs
- **Discussions**: Ask questions
