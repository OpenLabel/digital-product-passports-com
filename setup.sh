#!/bin/bash

# =============================================================================
# Digital Product Passport - Self-Hosting Setup Script
# =============================================================================
# This script automates the entire installation process for self-hosting.
# It will prompt you for all required credentials and configure everything.
# =============================================================================

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Print header
echo -e "${GREEN}"
echo "╔═══════════════════════════════════════════════════════════════════════╗"
echo "║                                                                       ║"
echo "║        Digital Product Passport - Self-Hosting Setup                  ║"
echo "║                                                                       ║"
echo "║        Open Source EU Compliance Solution                             ║"
echo "║                                                                       ║"
echo "╚═══════════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# =============================================================================
# Step 0: Check Prerequisites
# =============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}Checking prerequisites...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js is not installed${NC}"
    echo -e "  Please install Node.js from: ${BLUE}https://nodejs.org${NC}"
    exit 1
else
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js ${NODE_VERSION}${NC}"
fi

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm is not installed${NC}"
    exit 1
else
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓ npm ${NPM_VERSION}${NC}"
fi

# Check/Install Supabase CLI
if ! command -v supabase &> /dev/null; then
    echo -e "${YELLOW}⚠ Supabase CLI not found. Installing...${NC}"
    npm install -g supabase
    if ! command -v supabase &> /dev/null; then
        echo -e "${RED}✗ Failed to install Supabase CLI${NC}"
        echo -e "  Try manually: ${BLUE}npm install -g supabase${NC}"
        exit 1
    fi
fi
SUPABASE_VERSION=$(supabase --version 2>/dev/null || echo "installed")
echo -e "${GREEN}✓ Supabase CLI ${SUPABASE_VERSION}${NC}"

echo ""

# =============================================================================
# Step 1: Supabase Credentials
# =============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}Step 1: Supabase Project Credentials${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "You need a Supabase project. If you don't have one yet:"
echo -e "  1. Go to ${BLUE}https://supabase.com${NC} and sign up (free)"
echo -e "  2. Click 'New Project' and create one"
echo -e "  3. Wait ~2 minutes for it to be ready"
echo ""
echo -e "Then find your credentials at: ${BLUE}Settings → API${NC}"
echo ""

# Project ID
echo -e "${YELLOW}Project ID${NC} (the subdomain from your project URL)"
echo -e "Example: If your URL is https://${BOLD}abcdefgh${NC}.supabase.co, enter: abcdefgh"
read -p "Enter Project ID: " PROJECT_ID

if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}✗ Project ID is required${NC}"
    exit 1
fi

# Project URL
echo ""
echo -e "${YELLOW}Project URL${NC} (your full Supabase URL)"
read -p "Enter Project URL (https://xxxxx.supabase.co): " SUPABASE_URL

if [ -z "$SUPABASE_URL" ]; then
    echo -e "${RED}✗ Project URL is required${NC}"
    exit 1
fi

# Anon Key
echo ""
echo -e "${YELLOW}Anon/Public Key${NC} (starts with eyJ...)"
echo -e "Found under 'Project API keys' → 'anon public'"
read -p "Enter Anon Key: " ANON_KEY

if [ -z "$ANON_KEY" ]; then
    echo -e "${RED}✗ Anon Key is required${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Supabase credentials collected${NC}"
echo ""

# =============================================================================
# Step 2: Resend API Key (Required)
# =============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}Step 2: Resend API Key (Required for email notifications)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "Resend is used to send counterfeit report emails."
echo -e "Free tier includes 100 emails/day."
echo ""
echo -e "To get your API key:"
echo -e "  1. Go to ${BLUE}https://resend.com${NC} and sign up (free)"
echo -e "  2. Go to ${BLUE}https://resend.com/api-keys${NC}"
echo -e "  3. Click 'Create API Key'"
echo -e "  4. Copy the key (starts with ${BOLD}re_${NC})"
echo ""
echo -e "${YELLOW}Note: For production, you must also verify your domain at:${NC}"
echo -e "      ${BLUE}https://resend.com/domains${NC}"
echo ""

read -sp "Enter Resend API Key (hidden): " RESEND_KEY
echo ""

if [ -z "$RESEND_KEY" ]; then
    echo -e "${RED}✗ Resend API Key is required${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Resend API key collected${NC}"
echo ""

# =============================================================================
# Step 3: Lovable API Key (Optional)
# =============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}Step 3: Lovable API Key (Optional - for AI features)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "The Lovable API enables AI-powered features like wine label scanning."
echo -e "This is optional - everything else works without it."
echo ""
echo -e "Get your key from: ${BLUE}https://lovable.dev${NC} (developer settings)"
echo ""

read -p "Enter Lovable API Key (or press Enter to skip): " LOVABLE_KEY

if [ -n "$LOVABLE_KEY" ]; then
    echo -e "${GREEN}✓ Lovable API key collected${NC}"
else
    echo -e "${YELLOW}⚠ Skipped - AI features will be disabled${NC}"
fi

echo ""

# =============================================================================
# Step 4: Connect to Supabase
# =============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}Step 4: Connecting to Supabase${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "This will open your browser to authenticate with Supabase..."
echo ""

supabase login

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Failed to login to Supabase${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Logged in to Supabase${NC}"
echo ""

echo -e "Linking to project ${BOLD}${PROJECT_ID}${NC}..."
supabase link --project-ref "$PROJECT_ID"

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Failed to link project${NC}"
    echo -e "  Make sure the Project ID is correct"
    exit 1
fi

echo -e "${GREEN}✓ Project linked${NC}"
echo ""

# =============================================================================
# Step 5: Push Database Schema
# =============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}Step 5: Setting up database schema${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

supabase db push

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Failed to push database schema${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Database schema applied${NC}"
echo ""

# =============================================================================
# Step 6: Set Secrets
# =============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}Step 6: Configuring API secrets${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

supabase secrets set RESEND_API_KEY="$RESEND_KEY"

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Failed to set Resend API key${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Resend API key configured${NC}"

if [ -n "$LOVABLE_KEY" ]; then
    supabase secrets set LOVABLE_API_KEY="$LOVABLE_KEY"
    
    if [ $? -ne 0 ]; then
        echo -e "${YELLOW}⚠ Failed to set Lovable API key (continuing anyway)${NC}"
    else
        echo -e "${GREEN}✓ Lovable API key configured${NC}"
    fi
fi

echo ""

# =============================================================================
# Step 7: Deploy Edge Functions
# =============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}Step 7: Deploying backend functions${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "Deploying send-counterfeit-request..."
supabase functions deploy send-counterfeit-request --no-verify-jwt

echo -e "Deploying wine-label-ocr..."
supabase functions deploy wine-label-ocr --no-verify-jwt

echo -e "Deploying get-public-passport..."
supabase functions deploy get-public-passport --no-verify-jwt

echo -e "${GREEN}✓ All functions deployed${NC}"
echo ""

# =============================================================================
# Step 8: Generate .env File
# =============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}Step 8: Creating environment file${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

cat > .env << EOF
# Generated by setup.sh on $(date)
# These are safe to store in this file (public/anon keys only)

VITE_SUPABASE_URL=$SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY=$ANON_KEY
VITE_SUPABASE_PROJECT_ID=$PROJECT_ID
EOF

echo -e "${GREEN}✓ .env file created${NC}"
echo ""

# =============================================================================
# Step 9: Install Dependencies
# =============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}Step 9: Installing dependencies${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Failed to install dependencies${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# =============================================================================
# Complete!
# =============================================================================
echo -e "${GREEN}"
echo "╔═══════════════════════════════════════════════════════════════════════╗"
echo "║                                                                       ║"
echo "║                    ✅ SETUP COMPLETE!                                 ║"
echo "║                                                                       ║"
echo "╚═══════════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${BOLD}What's next?${NC}"
echo ""
echo -e "  ${YELLOW}For development:${NC}"
echo -e "    npm run dev"
echo ""
echo -e "  ${YELLOW}For production:${NC}"
echo -e "    npm run build"
echo -e "    # Then deploy the 'dist' folder to your web server"
echo ""
echo -e "  ${YELLOW}Final step:${NC}"
echo -e "    Visit your app and complete the setup wizard"
echo -e "    (Enter your company details for EU compliance)"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Ask if user wants to start dev server
read -p "Would you like to start the development server now? (y/N): " START_DEV

if [[ "$START_DEV" =~ ^[Yy]$ ]]; then
    npm run dev
fi
