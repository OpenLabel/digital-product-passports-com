# Digital Product Passports

An open-source, self-hostable Digital Product Passport (DPP) generator for EU compliance.

Supports wine e-labels, batteries, textiles, electronics, toys, and more product categories.

---

## 🌐 Just Want to Create a DPP?

**No setup required!** Use our free hosted service:

👉 **[digital-product-passports.com](https://www.digital-product-passports.com/)**

Create compliant Digital Product Passports in minutes, no installation needed.

---

## 🖥️ Self-Hosting Guide

Want to run your own instance? Follow the steps below.

### Prerequisites

Create free accounts on these services first:

1. **[Supabase](https://supabase.com)** — Database & Authentication
2. **[Resend](https://resend.com)** — Email notifications (100 free emails/day)

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

## 📋 Manual Setup (Alternative)

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

## 🖥️ Deployment Options

After setup, deploy the `dist` folder using any of these options:

### Vercel (Recommended)

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
