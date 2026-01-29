#!/bin/bash

# =============================================================================
# Digital Product Passport - Self-Hosting Setup Script
# =============================================================================
# This script automates the entire installation process for self-hosting.
# It supports two modes:
#   1. Supabase Cloud (recommended) - Uses Supabase's free hosted service
#   2. Self-Hosted Supabase - Runs Supabase on your own infrastructure via Docker
# =============================================================================

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m' # No Color

# Print header
print_header() {
    echo ""
    echo -e "${GREEN}"
    echo "╔═══════════════════════════════════════════════════════════════════════╗"
    echo "║                                                                       ║"
    echo "║        Digital Product Passport - Self-Hosting Setup                  ║"
    echo "║                                                                       ║"
    echo "║        Open Source EU Compliance Solution (AGPL-3.0)                  ║"
    echo "║                                                                       ║"
    echo "╚═══════════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Print section header
section() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BOLD}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

# Print success message
success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Print warning message
warn() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Print error message
error() {
    echo -e "${RED}✗ $1${NC}"
}

# Print info message
info() {
    echo -e "${CYAN}ℹ $1${NC}"
}

# =============================================================================
# MAIN SCRIPT
# =============================================================================

print_header

# =============================================================================
# Step 0: Check Prerequisites
# =============================================================================
section "Step 1: Checking Prerequisites"

# Check Node.js
if ! command -v node &> /dev/null; then
    error "Node.js is not installed"
    echo -e "  Please install Node.js from: ${BLUE}https://nodejs.org${NC}"
    exit 1
else
    NODE_VERSION=$(node --version)
    success "Node.js ${NODE_VERSION}"
fi

# Check npm
if ! command -v npm &> /dev/null; then
    error "npm is not installed"
    exit 1
else
    NPM_VERSION=$(npm --version)
    success "npm ${NPM_VERSION}"
fi

# =============================================================================
# Step 1: Choose Backend Mode
# =============================================================================
section "Step 2: Choose Your Backend"

echo -e "${BOLD}How would you like to set up your backend?${NC}"
echo ""
echo -e "  ${GREEN}[1] Supabase Cloud ${BOLD}(Recommended)${NC}"
echo -e "      ${DIM}Free tier includes: 500MB database, 1GB file storage, 50K monthly active users${NC}"
echo -e "      ${DIM}Easiest setup - just need an account at supabase.com${NC}"
echo ""
echo -e "  ${YELLOW}[2] Self-Hosted Supabase (Docker)${NC}"
echo -e "      ${DIM}Full control, air-gapped deployments, requires Docker${NC}"
echo -e "      ${DIM}More complex - you manage your own infrastructure${NC}"
echo ""

while true; do
    read -p "Enter your choice [1/2] (default: 1): " BACKEND_CHOICE
    BACKEND_CHOICE=${BACKEND_CHOICE:-1}
    
    if [[ "$BACKEND_CHOICE" == "1" || "$BACKEND_CHOICE" == "2" ]]; then
        break
    else
        warn "Please enter 1 or 2"
    fi
done

if [[ "$BACKEND_CHOICE" == "1" ]]; then
    echo ""
    success "Using Supabase Cloud"
    USE_CLOUD=true
else
    echo ""
    success "Using Self-Hosted Supabase"
    USE_CLOUD=false
    
    # Check Docker for self-hosted
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed (required for self-hosted mode)"
        echo -e "  Please install Docker from: ${BLUE}https://docker.com${NC}"
        exit 1
    else
        DOCKER_VERSION=$(docker --version)
        success "Docker ${DOCKER_VERSION}"
    fi
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        error "Docker Compose is not installed"
        echo -e "  Please install Docker Compose: ${BLUE}https://docs.docker.com/compose/install/${NC}"
        exit 1
    else
        success "Docker Compose available"
    fi
fi

# =============================================================================
# CLOUD PATH
# =============================================================================
if [[ "$USE_CLOUD" == true ]]; then

    # Check/Install Supabase CLI
    if ! command -v supabase &> /dev/null; then
        warn "Supabase CLI not found. Installing..."
        npm install -g supabase
        if ! command -v supabase &> /dev/null; then
            error "Failed to install Supabase CLI"
            echo -e "  Try manually: ${BLUE}npm install -g supabase${NC}"
            exit 1
        fi
    fi
    SUPABASE_VERSION=$(supabase --version 2>/dev/null || echo "installed")
    success "Supabase CLI ${SUPABASE_VERSION}"

    # =============================================================================
    # Step: Supabase Cloud Credentials
    # =============================================================================
    section "Step 3: Supabase Cloud Credentials"
    
    echo -e "You need a Supabase project. If you don't have one yet:"
    echo -e "  1. Go to ${BLUE}https://supabase.com${NC} and sign up ${DIM}(free)${NC}"
    echo -e "  2. Click ${BOLD}'New Project'${NC} and create one"
    echo -e "  3. Wait ~2 minutes for it to be ready"
    echo ""
    echo -e "Then find your credentials at: ${BLUE}Settings → API${NC}"
    echo ""

    # Project ID
    echo -e "${YELLOW}Project ID${NC} ${DIM}(the subdomain from your project URL)${NC}"
    echo -e "Example: If your URL is https://${BOLD}abcdefgh${NC}.supabase.co, enter: abcdefgh"
    read -p "Enter Project ID: " PROJECT_ID

    if [ -z "$PROJECT_ID" ]; then
        error "Project ID is required"
        exit 1
    fi

    # Project URL
    echo ""
    echo -e "${YELLOW}Project URL${NC} ${DIM}(your full Supabase URL)${NC}"
    read -p "Enter Project URL (https://xxxxx.supabase.co): " SUPABASE_URL

    if [ -z "$SUPABASE_URL" ]; then
        error "Project URL is required"
        exit 1
    fi

    # Anon Key
    echo ""
    echo -e "${YELLOW}Anon/Public Key${NC} ${DIM}(starts with eyJ...)${NC}"
    echo -e "Found under 'Project API keys' → 'anon public'"
    read -p "Enter Anon Key: " ANON_KEY

    if [ -z "$ANON_KEY" ]; then
        error "Anon Key is required"
        exit 1
    fi

    success "Supabase credentials collected"

    # =============================================================================
    # Step: Resend API Key
    # =============================================================================
    section "Step 4: Resend API Key (Email Notifications)"
    
    echo -e "Resend is used to send counterfeit report emails."
    echo -e "Free tier includes 100 emails/day."
    echo ""
    echo -e "To get your API key:"
    echo -e "  1. Go to ${BLUE}https://resend.com${NC} and sign up ${DIM}(free)${NC}"
    echo -e "  2. Go to ${BLUE}https://resend.com/api-keys${NC}"
    echo -e "  3. Click 'Create API Key'"
    echo -e "  4. Copy the key (starts with ${BOLD}re_${NC})"
    echo ""
    echo -e "${DIM}Note: For production, verify your domain at https://resend.com/domains${NC}"
    echo ""

    read -sp "Enter Resend API Key (hidden): " RESEND_KEY
    echo ""

    if [ -z "$RESEND_KEY" ]; then
        error "Resend API Key is required"
        exit 1
    fi

    success "Resend API key collected"

    # =============================================================================
    # Step: Lovable API Key (Optional)
    # =============================================================================
    section "Step 5: Lovable API Key (Optional - AI Features)"
    
    echo -e "The Lovable API enables AI-powered features like wine label scanning."
    echo -e "This is ${BOLD}optional${NC} - everything else works without it."
    echo ""
    echo -e "Get your key from: ${BLUE}https://lovable.dev${NC} (developer settings)"
    echo ""

    read -p "Enter Lovable API Key (or press Enter to skip): " LOVABLE_KEY

    if [ -n "$LOVABLE_KEY" ]; then
        success "Lovable API key collected"
    else
        info "Skipped - AI features will be disabled"
    fi

    # =============================================================================
    # Step: Connect to Supabase
    # =============================================================================
    section "Step 6: Connecting to Supabase"
    
    echo -e "This will open your browser to authenticate with Supabase..."
    echo ""

    supabase login

    if [ $? -ne 0 ]; then
        error "Failed to login to Supabase"
        exit 1
    fi

    success "Logged in to Supabase"

    echo ""
    echo -e "Linking to project ${BOLD}${PROJECT_ID}${NC}..."
    supabase link --project-ref "$PROJECT_ID"

    if [ $? -ne 0 ]; then
        error "Failed to link project"
        echo -e "  Make sure the Project ID is correct"
        exit 1
    fi

    success "Project linked"

    # =============================================================================
    # Step: Push Database Schema
    # =============================================================================
    section "Step 7: Setting Up Database Schema"

    supabase db push

    if [ $? -ne 0 ]; then
        error "Failed to push database schema"
        exit 1
    fi

    success "Database schema applied"

    # =============================================================================
    # Step: Set Secrets
    # =============================================================================
    section "Step 8: Configuring API Secrets"

    supabase secrets set RESEND_API_KEY="$RESEND_KEY"

    if [ $? -ne 0 ]; then
        error "Failed to set Resend API key"
        exit 1
    fi

    success "Resend API key configured"

    if [ -n "$LOVABLE_KEY" ]; then
        supabase secrets set LOVABLE_API_KEY="$LOVABLE_KEY"
        
        if [ $? -ne 0 ]; then
            warn "Failed to set Lovable API key (continuing anyway)"
        else
            success "Lovable API key configured"
        fi
    fi

    # =============================================================================
    # Step: Deploy Edge Functions
    # =============================================================================
    section "Step 9: Deploying Backend Functions"

    echo -e "Deploying send-counterfeit-request..."
    supabase functions deploy send-counterfeit-request --no-verify-jwt

    echo -e "Deploying wine-label-ocr..."
    supabase functions deploy wine-label-ocr --no-verify-jwt

    echo -e "Deploying get-public-passport..."
    supabase functions deploy get-public-passport --no-verify-jwt

    success "All functions deployed"

    # =============================================================================
    # Step: Generate .env File
    # =============================================================================
    section "Step 10: Creating Environment File"

    cat > .env << EOF
# Generated by setup.sh on $(date)
# Backend: Supabase Cloud

VITE_SUPABASE_URL=$SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY=$ANON_KEY
VITE_SUPABASE_PROJECT_ID=$PROJECT_ID
EOF

    success ".env file created"

# =============================================================================
# SELF-HOSTED PATH
# =============================================================================
else

    section "Step 3: Self-Hosted Supabase Setup"
    
    echo -e "${YELLOW}Self-hosted mode requires running Supabase via Docker.${NC}"
    echo ""
    echo -e "This script will help you set up a local Supabase instance."
    echo -e "You'll need approximately ${BOLD}2-4GB of RAM${NC} available for Docker."
    echo ""
    
    # Check if supabase docker folder exists
    SUPABASE_DOCKER_DIR="./supabase-docker"
    
    if [ -d "$SUPABASE_DOCKER_DIR" ]; then
        echo -e "Found existing Supabase Docker setup at ${BOLD}$SUPABASE_DOCKER_DIR${NC}"
        read -p "Use existing setup? [Y/n]: " USE_EXISTING
        USE_EXISTING=${USE_EXISTING:-Y}
    else
        USE_EXISTING="n"
    fi
    
    if [[ ! "$USE_EXISTING" =~ ^[Yy]$ ]]; then
        echo ""
        echo -e "Cloning Supabase Docker setup..."
        
        git clone --depth 1 https://github.com/supabase/supabase "$SUPABASE_DOCKER_DIR"
        
        if [ $? -ne 0 ]; then
            error "Failed to clone Supabase repository"
            exit 1
        fi
        
        success "Supabase Docker files downloaded"
    fi
    
    cd "$SUPABASE_DOCKER_DIR/docker"
    
    # Generate secure credentials if .env doesn't exist
    if [ ! -f ".env" ]; then
        echo ""
        echo -e "Generating secure credentials..."
        
        cp .env.example .env
        
        # Generate secure values
        POSTGRES_PASSWORD=$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | head -c 32)
        JWT_SECRET=$(openssl rand -base64 32)
        
        # Update .env with secure values
        sed -i.bak "s/POSTGRES_PASSWORD=.*/POSTGRES_PASSWORD=$POSTGRES_PASSWORD/" .env
        sed -i.bak "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" .env
        
        success "Secure credentials generated"
        
        echo ""
        warn "IMPORTANT: Save these credentials securely!"
        echo -e "  PostgreSQL Password: ${BOLD}$POSTGRES_PASSWORD${NC}"
        echo -e "  JWT Secret: ${BOLD}$JWT_SECRET${NC}"
        echo ""
    fi
    
    # Extract values from .env
    source .env
    
    section "Step 4: Starting Supabase Services"
    
    echo -e "Starting Docker containers (this may take a few minutes on first run)..."
    echo ""
    
    docker compose up -d
    
    if [ $? -ne 0 ]; then
        error "Failed to start Supabase services"
        exit 1
    fi
    
    success "Supabase services started"
    
    # Wait for services to be ready
    echo ""
    echo -e "Waiting for services to be ready..."
    sleep 10
    
    # Get the local URL and keys
    SUPABASE_URL="http://localhost:8000"
    ANON_KEY=$(grep "ANON_KEY=" .env | cut -d '=' -f2)
    PROJECT_ID="self-hosted"
    
    success "Supabase is running at ${SUPABASE_URL}"
    info "Studio dashboard: http://localhost:3000"
    
    cd - > /dev/null
    
    # =============================================================================
    # Step: Resend API Key
    # =============================================================================
    section "Step 5: Resend API Key (Email Notifications)"
    
    echo -e "Resend is used to send counterfeit report emails."
    echo ""
    echo -e "To get your API key:"
    echo -e "  1. Go to ${BLUE}https://resend.com${NC} and sign up ${DIM}(free)${NC}"
    echo -e "  2. Go to ${BLUE}https://resend.com/api-keys${NC}"
    echo -e "  3. Create and copy the key (starts with ${BOLD}re_${NC})"
    echo ""

    read -sp "Enter Resend API Key (hidden): " RESEND_KEY
    echo ""

    if [ -z "$RESEND_KEY" ]; then
        error "Resend API Key is required"
        exit 1
    fi

    success "Resend API key collected"

    # =============================================================================
    # Step: Lovable API Key (Optional)
    # =============================================================================
    section "Step 6: Lovable API Key (Optional)"
    
    echo -e "For AI-powered wine label scanning (optional)."
    echo -e "Get your key from: ${BLUE}https://lovable.dev${NC}"
    echo ""

    read -p "Enter Lovable API Key (or press Enter to skip): " LOVABLE_KEY

    if [ -n "$LOVABLE_KEY" ]; then
        success "Lovable API key collected"
    else
        info "Skipped - AI features will be disabled"
    fi

    # =============================================================================
    # Step: Apply Database Schema
    # =============================================================================
    section "Step 7: Applying Database Schema"
    
    echo -e "Applying migrations to local PostgreSQL..."
    
    # Get postgres password from docker .env
    POSTGRES_PASSWORD=$(grep "POSTGRES_PASSWORD=" "$SUPABASE_DOCKER_DIR/docker/.env" | cut -d '=' -f2)
    
    # Apply each migration file
    for migration in supabase/migrations/*.sql; do
        if [ -f "$migration" ]; then
            echo -e "  Applying $(basename $migration)..."
            PGPASSWORD="$POSTGRES_PASSWORD" psql -h localhost -p 5432 -U postgres -d postgres -f "$migration" 2>/dev/null || \
            docker exec -i supabase-db psql -U postgres -d postgres < "$migration"
        fi
    done
    
    success "Database schema applied"

    # =============================================================================
    # Step: Configure Edge Functions Environment
    # =============================================================================
    section "Step 8: Configuring Edge Functions"
    
    # Create edge functions env file
    cat > "$SUPABASE_DOCKER_DIR/docker/volumes/functions/.env" << EOF
RESEND_API_KEY=$RESEND_KEY
LOVABLE_API_KEY=$LOVABLE_KEY
SUPABASE_URL=$SUPABASE_URL
SUPABASE_ANON_KEY=$ANON_KEY
EOF

    success "Edge function environment configured"
    
    info "Note: Edge functions run via Supabase Edge Runtime in Docker"

    # =============================================================================
    # Step: Generate .env File
    # =============================================================================
    section "Step 9: Creating Environment File"

    cd - > /dev/null 2>&1 || true
    
    cat > .env << EOF
# Generated by setup.sh on $(date)
# Backend: Self-Hosted Supabase (Docker)

VITE_SUPABASE_URL=$SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY=$ANON_KEY
VITE_SUPABASE_PROJECT_ID=$PROJECT_ID
EOF

    success ".env file created"

fi

# =============================================================================
# Step: Install Dependencies
# =============================================================================
section "Step $([ "$USE_CLOUD" == true ] && echo "11" || echo "10"): Installing Dependencies"

npm install

if [ $? -ne 0 ]; then
    error "Failed to install dependencies"
    exit 1
fi

success "Dependencies installed"

# =============================================================================
# Complete!
# =============================================================================
echo ""
echo -e "${GREEN}"
echo "╔═══════════════════════════════════════════════════════════════════════╗"
echo "║                                                                       ║"
echo "║                    ✅ SETUP COMPLETE!                                 ║"
echo "║                                                                       ║"
echo "╚═══════════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${BOLD}What's next?${NC}"
echo ""

if [[ "$USE_CLOUD" == true ]]; then
    echo -e "  ${YELLOW}For development:${NC}"
    echo -e "    npm run dev"
    echo ""
    echo -e "  ${YELLOW}For production:${NC}"
    echo -e "    npm run build"
    echo -e "    # Deploy the 'dist' folder to your web server"
else
    echo -e "  ${YELLOW}Supabase Dashboard:${NC}"
    echo -e "    Open ${BLUE}http://localhost:3000${NC} in your browser"
    echo ""
    echo -e "  ${YELLOW}For development:${NC}"
    echo -e "    npm run dev"
    echo ""
    echo -e "  ${YELLOW}For production:${NC}"
    echo -e "    npm run build"
    echo -e "    # Deploy the 'dist' folder to your web server"
    echo ""
    echo -e "  ${YELLOW}To stop Supabase:${NC}"
    echo -e "    cd supabase-docker/docker && docker compose down"
    echo ""
    echo -e "  ${YELLOW}To restart Supabase:${NC}"
    echo -e "    cd supabase-docker/docker && docker compose up -d"
fi

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
