# Digital Product Passport

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Open Source](https://img.shields.io/badge/Open%20Source-Yes-brightgreen.svg)](https://github.com/OpenLabel/digital-product-passports-com)

An **open-source, self-hostable** platform for creating legally compliant Digital Product Passports (DPPs) for EU regulations.

---

## 🌐 Don't Want to Self-Host?

**Use our free hosted service — no setup required:**

<p align="center">
  <a href="https://www.digital-product-passports.com/">
    <img src="https://img.shields.io/badge/🚀_Try_It_Free-digital--product--passports.com-4F46E5?style=for-the-badge&labelColor=1e1e2e" alt="Try it free" />
  </a>
</p>

Create compliant Digital Product Passports in minutes. No installation, no credit card.

---

## 📋 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Hosting Options](#-hosting-options)
- [Detailed Setup Guide](#-detailed-setup-guide)
- [Deployment](#-deployment)
- [Configuration](#-configuration)
- [Security](#-security)
- [Development](#-development)
- [Architecture](#-architecture)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🍷 **Wine E-Labels** | Full EU Regulation 2021/2117 compliance with ingredients, nutrition, allergens |
| 🔋 **Battery Passports** | Carbon footprint, recycling info, manufacturer data |
| 👕 **Textile Passports** | Care instructions, fiber composition, sustainability |
| 🔌 **Electronics** | Repair information, hazardous substances, WEEE compliance |
| 🧸 **Toys & More** | Safety certifications, age warnings, materials |
| 📱 **QR Codes** | Generate scannable codes linking to each passport |
| 🌍 **24 Languages** | All EU official languages supported |
| 🤖 **AI Autofill** | Optional: scan wine labels to extract data automatically |
| 🔒 **Self-Hosted** | Full data sovereignty — your data, your servers |
| 📜 **Long-Term Storage** | Designed for 50+ year data retention (wine, etc.) |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([download](https://nodejs.org))
- **Git** ([download](https://git-scm.com))

### One-Command Setup

```bash
git clone https://github.com/OpenLabel/digital-product-passports-com.git
cd digital-product-passports-com
chmod +x setup.sh
./setup.sh
```

The interactive script guides you through everything:

1. Choose your backend (Supabase Cloud or Self-Hosted)
2. Enter your credentials
3. Set up the database
4. Configure secrets
5. Deploy backend functions
6. Generate your `.env` file
7. Install dependencies

After setup: `npm run build` and deploy the `dist` folder.

---

## 🏠 Hosting Options

The platform supports two backend configurations:

### Option 1: Supabase Cloud ⭐ Recommended

**Best for:** Most users, quick setup, minimal maintenance

| Pros | Cons |
|------|------|
| ✅ 5-minute setup | ❌ Data on Supabase servers |
| ✅ Free tier (500MB DB, 1GB storage) | ❌ Requires internet |
| ✅ Automatic backups | ❌ Rate limits on free tier |
| ✅ Managed security updates | |
| ✅ Global CDN | |

**Free tier includes:**
- 500 MB database
- 1 GB file storage
- 50,000 monthly active users
- 500,000 Edge Function invocations
- 2 projects

### Option 2: Self-Hosted Supabase (Docker)

**Best for:** Enterprise, air-gapped environments, full control

| Pros | Cons |
|------|------|
| ✅ 100% data sovereignty | ❌ More complex setup |
| ✅ Air-gapped deployments | ❌ You manage backups |
| ✅ No vendor lock-in | ❌ Requires Docker knowledge |
| ✅ Unlimited resources | ❌ You manage security updates |
| ✅ Full infrastructure control | ❌ Needs 2-4GB RAM minimum |

**Requirements:**
- Docker & Docker Compose
- 2-4 GB RAM minimum
- 10+ GB disk space

---

## 📖 Detailed Setup Guide

### Supabase Cloud Setup

<details>
<summary><strong>Click to expand step-by-step instructions</strong></summary>

#### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up (free)
2. Click **"New Project"**
3. Choose a name and set a database password
4. Select a region close to your users
5. Click **"Create new project"**
6. Wait ~2 minutes for provisioning

#### Step 2: Get Your Credentials

Navigate to **Settings → API** and note:

| Credential | Where to Find |
|------------|---------------|
| **Project ID** | The subdomain in your URL (e.g., `abcdef` from `https://abcdef.supabase.co`) |
| **Project URL** | Full URL: `https://abcdef.supabase.co` |
| **Anon Key** | Under "Project API keys" → `anon` `public` (starts with `eyJ...`) |

#### Step 3: Get a Resend API Key

Resend handles email notifications (counterfeit reports):

1. Go to [resend.com](https://resend.com) and sign up (free)
2. Navigate to [resend.com/api-keys](https://resend.com/api-keys)
3. Click **"Create API Key"**
4. Copy the key (starts with `re_`)

> ⚠️ **For production:** Verify your sending domain at [resend.com/domains](https://resend.com/domains)

#### Step 4: Run the Setup Script

```bash
./setup.sh
```

Select **[1] Supabase Cloud** and enter your credentials when prompted.

</details>

### Self-Hosted Supabase Setup

<details>
<summary><strong>Click to expand step-by-step instructions</strong></summary>

#### Prerequisites

- Docker Engine 20.10+
- Docker Compose v2.0+
- 2-4 GB RAM available
- 10+ GB disk space

#### Step 1: Run the Setup Script

```bash
./setup.sh
```

Select **[2] Self-Hosted Supabase (Docker)**.

The script will:
1. Clone the Supabase Docker setup
2. Generate secure credentials
3. Start all services (PostgreSQL, GoTrue, PostgREST, Storage, etc.)
4. Apply database migrations
5. Configure edge functions

#### Step 2: Access Your Local Supabase

After setup completes:

| Service | URL |
|---------|-----|
| **API** | `http://localhost:8000` |
| **Studio (Dashboard)** | `http://localhost:3000` |
| **Database** | `localhost:5432` |

#### Step 3: Managing Docker Services

```bash
# View running containers
cd supabase-docker/docker
docker compose ps

# View logs
docker compose logs -f

# Stop services
docker compose down

# Start services
docker compose up -d

# Reset everything (⚠️ deletes data)
docker compose down -v
```

#### Production Considerations

For production self-hosted deployments:

- [ ] Use HTTPS (TLS certificates via Let's Encrypt)
- [ ] Change default passwords in `.env`
- [ ] Configure firewall (only expose ports 80/443)
- [ ] Set up automated PostgreSQL backups
- [ ] Configure log rotation
- [ ] Set up monitoring (Prometheus, Grafana)
- [ ] Use a reverse proxy (Nginx, Traefik)

</details>

### Manual Setup (No Script)

<details>
<summary><strong>Click to expand manual instructions</strong></summary>

If you prefer not to use the setup script:

#### 1. Install Supabase CLI

```bash
npm install -g supabase
```

#### 2. Login and Link

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_ID
```

#### 3. Push Database Schema

```bash
supabase db push
```

#### 4. Set Secrets

```bash
supabase secrets set RESEND_API_KEY=re_xxxxxxxxxx
supabase secrets set LOVABLE_API_KEY=your_key_here  # Optional
```

#### 5. Deploy Functions

```bash
supabase functions deploy send-counterfeit-request --no-verify-jwt
supabase functions deploy wine-label-ocr --no-verify-jwt
supabase functions deploy get-public-passport --no-verify-jwt
```

#### 6. Create `.env`

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...your-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-id
```

#### 7. Build

```bash
npm install
npm run build
```

</details>

---

## 🚢 Deployment

After running `npm run build`, deploy the `dist` folder:

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FOpenLabel%2Fdigital-product-passports-com&env=VITE_SUPABASE_URL,VITE_SUPABASE_PUBLISHABLE_KEY,VITE_SUPABASE_PROJECT_ID)

### Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/OpenLabel/digital-product-passports-com)

### Docker

```bash
# Build the image
docker build -t dpp-platform .

# Run
docker run -p 80:80 \
  -e VITE_SUPABASE_URL=https://your-project.supabase.co \
  -e VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key \
  -e VITE_SUPABASE_PROJECT_ID=your-project-id \
  dpp-platform
```

### Static Hosting

Upload the contents of `dist/` to any static host:
- Nginx
- Apache
- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Blob Storage

---

## ⚙️ Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | ✅ | Your Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | ✅ | Your Supabase anon/public key |
| `VITE_SUPABASE_PROJECT_ID` | ✅ | Your Supabase project ID |

### Supabase Secrets

Set via `supabase secrets set KEY=value`:

| Secret | Required | Description |
|--------|----------|-------------|
| `RESEND_API_KEY` | ✅ | For email notifications |
| `LOVABLE_API_KEY` | ❌ | For AI wine label scanning |

### First-Time Setup Wizard

After deployment:

1. Visit your app URL
2. The first visitor sees the setup wizard
3. Enter your company details:
   - Company name (appears on DPPs)
   - Company address (EU compliance)
   - Sender email (for notifications)
4. This data is stored in your database

> **Security note:** The first person to complete setup becomes the administrator. Make sure you complete this step before making the app public.

---

## 🔒 Security

### Data Protection

- **Row Level Security (RLS):** Every table has RLS policies
- **User Isolation:** Users can only access their own passports
- **Public Access:** Published DPPs are intentionally public (by design)
- **Secrets:** All API keys stored as Supabase secrets, never in code
- **No Hardcoded URLs:** All URLs are dynamically generated

### Authentication

- Email/password authentication via Supabase Auth
- Session management with automatic token refresh
- Secure password requirements

### For Self-Hosted Deployments

Additional security measures to implement:

- [ ] HTTPS everywhere (TLS 1.2+)
- [ ] Database encryption at rest
- [ ] Regular security updates for Docker images
- [ ] Network segmentation
- [ ] Access logging and monitoring
- [ ] Regular backups with encryption

---

## 💻 Development

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build

# Preview production build
npm run preview
```

### Project Structure

```
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   ├── data/           # Static data (ingredients, etc.)
│   ├── templates/      # DPP category templates
│   ├── i18n/           # Translations (24 languages)
│   └── integrations/   # Supabase client
├── supabase/
│   ├── functions/      # Edge functions
│   └── migrations/     # Database migrations
└── public/             # Static assets
```

### Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, shadcn/ui
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Rich Text:** TipTap
- **i18n:** i18next
- **Testing:** Vitest

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Pages     │  │ Components  │  │    Hooks & State        │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Supabase (Cloud or Self-Hosted)               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  PostgreSQL │  │    Auth     │  │   Edge Functions        │  │
│  │  (Database) │  │  (GoTrue)   │  │  - OCR                  │  │
│  │             │  │             │  │  - Email                │  │
│  │  - passports│  │  - Login    │  │  - Public passport API  │  │
│  │  - profiles │  │  - Signup   │  │                         │  │
│  │  - config   │  │  - Sessions │  │                         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                     Storage (Files)                          ││
│  │                   - Product images                           ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### Database Schema

| Table | Purpose |
|-------|---------|
| `passports` | Product passport data |
| `profiles` | User profiles linked to auth |
| `site_config` | Instance configuration |
| `api_usage` | Usage tracking for rate limits |

---

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Write tests for new features
- Follow existing code style
- Update documentation as needed
- Keep commits focused and atomic

---

## 📜 License

**GNU Affero General Public License v3.0 (AGPL-3.0)**

This means:
- ✅ Free to use, modify, and distribute
- ✅ Can use commercially
- ⚠️ Must disclose source code
- ⚠️ Must use same license for derivatives
- ⚠️ Network use counts as distribution

See [LICENSE](LICENSE) for full text.

---

## ❓ Support

- **GitHub Issues:** [Report bugs](https://github.com/OpenLabel/digital-product-passports-com/issues)
- **Discussions:** [Ask questions](https://github.com/OpenLabel/digital-product-passports-com/discussions)
- **Email:** See repository for contact info

---

<p align="center">
  Made with ❤️ for EU compliance
</p>
