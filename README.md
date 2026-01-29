# EU Digital Product Passport Platform

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

## 🚀 Self-Hosting Guide

### Prerequisites

- **Node.js** 18+ or **Bun** 1.0+
- **Supabase** account (free tier works)
- **Git** installed
- A server or hosting platform (Vercel, Netlify, Docker, VPS, etc.)

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-org/dpp-platform.git
cd dpp-platform
```

### Step 2: Install Dependencies

Using npm:
```bash
npm install
```

Using Bun (faster):
```bash
bun install
```

### Step 3: Set Up Supabase

#### 3.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Click "New Project"
3. Choose a name and set a database password
4. Wait for the project to be provisioned (~2 minutes)

#### 3.2 Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **Project ID** (from the URL: `xxxxx` part)

#### 3.3 Run Database Migrations

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref YOUR_PROJECT_ID
   ```

4. Run migrations:
   ```bash
   supabase db push
   ```

This creates the following tables:
- `passports` - Stores all digital product passports
- `profiles` - User profile information
- `site_config` - Instance configuration (company name, legal info, etc.)

### Step 4: Configure Environment Variables

Create a `.env` file in the project root:

```env
# Required: Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_PROJECT_ID=your-project-id

# Optional: AI Features (for wine label scanning)
# Only needed if NOT using Lovable Cloud
# Get your key from Lovable developer settings
LOVABLE_API_KEY=your-lovable-api-key
```

### Step 5: Deploy Edge Functions (for AI Features)

If you want AI-powered label scanning:

```bash
supabase functions deploy wine-label-ocr
```

Set the API key as a secret:
```bash
supabase secrets set LOVABLE_API_KEY=your-lovable-api-key
```

### Step 6: Configure Authentication

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Enable **Email** provider
3. (Optional) Enable **Google**, **Apple**, or other OAuth providers
4. Go to **Authentication** → **Email Templates** and customize if needed

**Recommended Settings:**
- Enable "Confirm email" for production
- Disable "Confirm email" for development/testing

### Step 7: Build and Deploy

#### Option A: Static Hosting (Vercel, Netlify, Cloudflare Pages)

Build the project:
```bash
npm run build
```

The output will be in the `dist/` folder. Deploy this folder to your hosting provider.

**Vercel:**
```bash
npx vercel --prod
```

**Netlify:**
```bash
npx netlify deploy --prod --dir=dist
```

#### Option B: Docker

Create a `Dockerfile`:
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
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

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

#### Option C: VPS / Bare Metal

1. Build the project on your server:
   ```bash
   npm run build
   ```

2. Serve the `dist/` folder with Nginx, Apache, or Caddy

Example Nginx config:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/dpp-platform/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Step 8: Initial Setup

1. Visit your deployed application
2. You'll be redirected to the **Setup** page
3. Enter your organization details:
   - **Company Name** (required)
   - **Company Address** (required)
   - **Privacy Policy URL** (optional)
   - **Terms & Conditions URL** (optional)
   - **Enable/Disable AI Features**

4. Click "Complete Setup"

---

## 🔧 Configuration Options

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | Yes | Your Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Yes | Supabase anon/public key |
| `VITE_SUPABASE_PROJECT_ID` | Yes | Supabase project ID |
| `LOVABLE_API_KEY` | No* | Required for AI features if self-hosting |

*Not required if running on Lovable Cloud (auto-detected)

### Site Configuration (via Setup Page)

| Setting | Description |
|---------|-------------|
| Company Name | Displayed in legal mentions |
| Company Address | Full legal address |
| Privacy Policy URL | Link to your privacy policy |
| Terms & Conditions URL | Link to your T&C |
| AI Enabled | Toggle AI features on/off |

---

## 🤖 AI Features

The platform includes optional AI-powered features:

- **Wine Label Scanner**: Upload a photo of a wine label to automatically extract product information
- **Document Parser**: Extract data from PDF/Word technical sheets

### Enabling AI for Self-Hosted Instances

1. Obtain a Lovable API key from [lovable.dev](https://lovable.dev)
2. Set the `LOVABLE_API_KEY` environment variable
3. Deploy the edge function:
   ```bash
   supabase functions deploy wine-label-ocr
   supabase secrets set LOVABLE_API_KEY=your-key
   ```

### Disabling AI Features

If you don't want AI features:
1. During setup, uncheck "Enable AI features"
2. Or update the `ai_enabled` config in the database

---

## 🗄️ Database Schema

### Tables

**passports**
- `id` (UUID) - Primary key
- `user_id` (UUID) - Owner reference
- `name` (TEXT) - Product name
- `description` (TEXT) - Product description
- `category` (ENUM) - Product category
- `category_data` (JSONB) - Category-specific fields
- `image_url` (TEXT) - Product image
- `public_slug` (TEXT) - URL slug for public access
- `language` (TEXT) - Passport language

**profiles**
- `id` (UUID) - Primary key
- `user_id` (UUID) - Auth user reference
- `email` (TEXT) - User email
- `company_name` (TEXT) - User's company

**site_config**
- `key` (TEXT) - Configuration key
- `value` (TEXT) - Configuration value

---

## 🔒 Security

### Row Level Security (RLS)

All tables have RLS enabled:
- Users can only access their own passports
- Public passports are accessible via the `passports_public` view
- Site config is readable by all, writable by authenticated users

### Best Practices

1. Use HTTPS in production
2. Set strong Supabase database passwords
3. Enable email confirmation for production
4. Regularly backup your database
5. Keep dependencies updated

---

## 🧪 Development

### Running Locally

```bash
npm run dev
```

### Running Tests

```bash
npm run test
```

### Type Checking

```bash
npm run typecheck
```

---

## 📝 License

This project is open source. See LICENSE file for details.

---

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

---

## 📞 Support

- **GitHub Issues**: Report bugs and feature requests
- **Documentation**: [docs.example.com](https://docs.example.com)
- **Community**: Join our Discord server
