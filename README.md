# Digital - Product - Passports .com

An open-source, self-hostable Digital Product Passport (DPP) generator for EU compliance. Supports wine e-labels, batteries, textiles, electronics, toys, and more product categories.

## Features

- 🍷 **Wine E-Labels**: Full EU Regulation 2021/2117 compliance with nutritional values, ingredients, and allergen display
- 🔋 **Battery Passports**: Carbon footprint, recycling info, and material composition
- 👕 **Textile Passports**: Care instructions, composition, and sustainability data
- 🤖 **AI-Powered Autofill**: Scan wine labels to automatically extract product data (optional)
- 📱 **QR Codes**: Generate scannable QR codes linking to digital passports
- 🌍 **Multi-language**: Support for EU language requirements
- 🔒 **Self-Hostable**: Full data sovereignty with your own infrastructure

---

## 🚀 Quick Start (Self-Hosting)

### Prerequisites

- **Node.js** 18+ or **Bun** 1.0+
- **Supabase CLI** installed (`npm install -g supabase`)
- **Git** installed

---

### Step 1: Clone & Install

```bash
git clone https://github.com/cypheme/dpp-platform.git
cd dpp-platform
npm install
```

### Step 2: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click **"New Project"** → Choose a name → Set database password
3. Wait for provisioning (~2 minutes)

### Step 3: Get Your Credentials

In your Supabase dashboard → **Settings** → **API**, copy:
- **Project URL** (e.g., `https://xxxxx.supabase.co`)
- **anon/public key** (starts with `eyJ...`)
- **Project ID** (the `xxxxx` part from the URL)

### Step 4: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your values:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
VITE_SUPABASE_PROJECT_ID=your-project-id
```

### Step 5: Set Up Database

```bash
# Login to Supabase CLI
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_ID

# Push all migrations (creates tables, RLS policies, functions)
supabase db push
```

### Step 6: Deploy Edge Functions

```bash
# Deploy all edge functions
supabase functions deploy save-resend-key
supabase functions deploy save-lovable-key
supabase functions deploy send-counterfeit-request
supabase functions deploy wine-label-ocr
```

### Step 7: Run Locally

```bash
npm run dev
```

Visit `http://localhost:5173` and complete the setup wizard.

---

## 🌐 Production Deployment

### Option A: Vercel (Recommended)

```bash
npm run build
npx vercel --prod
```

Set environment variables in Vercel dashboard → Project Settings → Environment Variables.

### Option B: Netlify

```bash
npm run build
npx netlify deploy --prod --dir=dist
```

### Option C: Docker

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf`:
```nginx
events { worker_connections 1024; }
http {
    include /etc/nginx/mime.types;
    server {
        listen 80;
        root /usr/share/nginx/html;
        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
```

Build and run:
```bash
docker build -t dpp-platform .
docker run -p 80:80 dpp-platform
```

---

## ⚙️ Initial Setup Wizard

After first deployment, you'll be redirected to `/setup` where you configure:

| Setting | Required | Description |
|---------|----------|-------------|
| Company Name | ✅ | Displayed in legal mentions |
| Company Address | ✅ | Full legal address for EU compliance |
| Privacy Policy URL | | Link to your privacy policy |
| Terms URL | | Link to your terms of service |
| Resend API Key | | For password reset emails (get from [resend.com](https://resend.com)) |
| Sender Email | | Must be from a verified Resend domain |
| Lovable API Key | | For AI features (only if self-hosting, not on Lovable Cloud) |
| Enable AI | | Toggle AI features on/off |

---

## 🤖 AI Features (Optional)

The platform includes AI-powered features:
- **Wine Label Scanner**: Upload a photo to auto-extract product data
- **Document Parser**: Extract data from PDF/Word technical sheets

### For Self-Hosted Instances

1. Obtain a Lovable API key from [lovable.dev](https://lovable.dev)
2. During setup, enter the key in the "Lovable API Key" field
3. Or set it as an edge function secret:
   ```bash
   supabase secrets set LOVABLE_API_KEY=your-key
   ```

### Disabling AI

Simply uncheck "Enable AI features" during setup. The AI autofill buttons will be hidden from the interface.

---

## 🔒 Security

### Row Level Security (RLS)

All tables have RLS enabled:
- Users can only access their own passports
- Public passports are accessible via the `passports_public` view (excludes user_id)
- API keys in site_config are only readable by edge functions (service role)

### Best Practices

1. ✅ Use HTTPS in production
2. ✅ Set strong Supabase database passwords
3. ✅ Enable email confirmation for production
4. ✅ Regularly backup your database
5. ✅ Keep dependencies updated
6. ✅ Verify your Resend sending domain

---

## 🗄️ Database Schema

### Tables

| Table | Description |
|-------|-------------|
| `passports` | All digital product passports |
| `profiles` | User profile information |
| `site_config` | Instance configuration (company info, API keys) |

### Views

| View | Description |
|------|-------------|
| `passports_public` | Public view of passports (excludes user_id for privacy) |

---

## 🧪 Development

```bash
# Run development server
npm run dev

# Run tests
npm run test

# Type checking
npm run typecheck

# Build for production
npm run build
```

---

## 📝 License

This project is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.

See [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

---

## 📞 Support

- **GitHub Issues**: Report bugs and feature requests
- **Discussions**: Ask questions and share ideas
