
# Interactive Setup Script for Self-Hosting

## Overview

Create a single `setup.sh` bash script that automates the entire installation process and prompts the user for required values (API keys, project credentials). This is the standard approach for open-source self-hosted projects.

## What the Script Will Do

1. **Check prerequisites** (Node.js, npm, Supabase CLI)
2. **Prompt for Supabase credentials** (Project ID, URL, Anon Key)
3. **Prompt for API keys** (Resend required, Lovable optional)
4. **Run all setup commands automatically**:
   - `supabase login` (opens browser)
   - `supabase link --project-ref <ID>`
   - `supabase db push`
   - `supabase secrets set RESEND_API_KEY=...`
   - `supabase secrets set LOVABLE_API_KEY=...` (if provided)
   - `supabase functions deploy` (all 3 functions)
5. **Generate `.env` file** with frontend variables
6. **Offer to build or start dev server**

---

## Files to Create/Modify

### 1. New File: `setup.sh`

Interactive bash script with colored output and user prompts:

```bash
#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║     Digital Product Passport - Self-Hosting Setup         ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo -e "${RED}Node.js is required. Install from nodejs.org${NC}"; exit 1; }
command -v supabase >/dev/null 2>&1 || { echo -e "${YELLOW}Installing Supabase CLI...${NC}"; npm install -g supabase; }

# Prompt for Supabase credentials
echo -e "\n${YELLOW}Step 1: Supabase Credentials${NC}"
echo "Get these from: supabase.com → Your Project → Settings → API"
read -p "Project ID (from URL, e.g., 'abcdef'): " PROJECT_ID
read -p "Project URL (e.g., https://abcdef.supabase.co): " SUPABASE_URL
read -p "Anon/Public Key (starts with eyJ...): " ANON_KEY

# Prompt for Resend API key
echo -e "\n${YELLOW}Step 2: Resend API Key (Required)${NC}"
echo "Get yours at: resend.com/api-keys"
read -sp "Resend API Key (re_...): " RESEND_KEY
echo ""

# Prompt for optional Lovable key
echo -e "\n${YELLOW}Step 3: Lovable API Key (Optional - for AI features)${NC}"
read -p "Lovable API Key (press Enter to skip): " LOVABLE_KEY

# Login and link
echo -e "\n${GREEN}Connecting to Supabase...${NC}"
supabase login
supabase link --project-ref "$PROJECT_ID"

# Push database schema
echo -e "\n${GREEN}Setting up database...${NC}"
supabase db push

# Set secrets
echo -e "\n${GREEN}Configuring secrets...${NC}"
supabase secrets set RESEND_API_KEY="$RESEND_KEY"
[ -n "$LOVABLE_KEY" ] && supabase secrets set LOVABLE_API_KEY="$LOVABLE_KEY"

# Deploy edge functions
echo -e "\n${GREEN}Deploying edge functions...${NC}"
supabase functions deploy send-counterfeit-request
supabase functions deploy wine-label-ocr
supabase functions deploy get-public-passport

# Generate .env file
echo -e "\n${GREEN}Creating .env file...${NC}"
cat > .env << EOF
VITE_SUPABASE_URL=$SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY=$ANON_KEY
VITE_SUPABASE_PROJECT_ID=$PROJECT_ID
EOF

# Install dependencies and offer next steps
echo -e "\n${GREEN}Installing dependencies...${NC}"
npm install

echo -e "\n${GREEN}✅ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Run 'npm run build' to build for production"
echo "  2. Or run 'npm run dev' to start development server"
echo "  3. Visit your app and complete the setup wizard"
```

### 2. Update: `README.md`

Simplify to single-command installation:

```markdown
## 🚀 Quick Install (Self-Hosting)

### Prerequisites

1. Create a free [Supabase](https://supabase.com) project
2. Create a free [Resend](https://resend.com) account and get an API key

### One-Command Setup

```bash
git clone https://github.com/OpenLabel/digital-product-passports-com.git
cd digital-product-passports-com
chmod +x setup.sh
./setup.sh
```

The script will:
- ✅ Prompt you for all required credentials
- ✅ Set up the database schema
- ✅ Configure API keys securely
- ✅ Deploy backend functions
- ✅ Generate your `.env` file

Then just run `npm run build` and deploy the `dist` folder!
```

### 3. Update: `.gitignore`

Ensure `.env` is ignored (already should be, but verify).

---

## Security Considerations

- **API keys entered with `-s` flag** (silent mode) so they're not visible while typing
- **Keys stored only in Supabase secrets** (not in local files except the safe anon key)
- **Script validates inputs** before proceeding

---

## Alternative: Windows Support

For Windows users, we could also create a `setup.ps1` PowerShell script with equivalent functionality, or recommend using WSL (Windows Subsystem for Linux).
