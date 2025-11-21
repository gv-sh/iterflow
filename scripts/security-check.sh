#!/bin/bash
# Security check script for iterflow
# Run this before committing or releasing

set -e

echo "🔒 Running Security Checks for IterFlow..."
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track if any checks fail
FAILED=0

# Function to print colored output
print_status() {
  if [ $1 -eq 0 ]; then
    echo -e "${GREEN}✓${NC} $2"
  else
    echo -e "${RED}✗${NC} $2"
    FAILED=1
  fi
}

print_warning() {
  echo -e "${YELLOW}⚠${NC} $1"
}

# Check if npm is installed
if ! command -v npm &> /dev/null; then
  echo -e "${RED}Error: npm is not installed${NC}"
  exit 1
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Checking for dependency vulnerabilities..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Run npm audit for all dependencies
if npm audit --audit-level=moderate &> /dev/null; then
  print_status 0 "npm audit (all dependencies)"
else
  print_status 1 "npm audit found vulnerabilities (moderate or higher)"
  echo ""
  npm audit --audit-level=moderate
  echo ""
fi

# Check production dependencies specifically (should have zero)
echo ""
echo "Checking production dependencies (should be zero)..."
PROD_DEPS=$(npm audit --production --json 2>/dev/null | grep -o '"total":[0-9]*' | head -1 | grep -o '[0-9]*')
if [ "$PROD_DEPS" = "0" ]; then
  print_status 0 "Production dependencies have no vulnerabilities"
else
  print_status 1 "Production dependencies have vulnerabilities"
  npm audit --production
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2. Checking for outdated dependencies..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if npm outdated; then
  print_warning "Some dependencies are outdated (see above)"
else
  print_status 0 "All dependencies are up to date"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3. Validating package.json..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if npm pkg fix --dry-run &> /dev/null; then
  print_status 0 "package.json is valid"
else
  print_status 1 "package.json has issues"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4. Checking package-lock.json integrity..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Save current package-lock.json
cp package-lock.json package-lock.json.bak 2>/dev/null || true

# Run npm install to check integrity
if npm install --package-lock-only &> /dev/null; then
  if diff package-lock.json package-lock.json.bak &> /dev/null; then
    print_status 0 "package-lock.json is in sync"
  else
    print_status 1 "package-lock.json is out of sync"
    print_warning "Run 'npm install' to update package-lock.json"
  fi
else
  print_status 1 "Failed to validate package-lock.json"
fi

# Restore backup
mv package-lock.json.bak package-lock.json 2>/dev/null || true

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5. Checking for sensitive files..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# List of sensitive file patterns
SENSITIVE_FILES=(
  ".env"
  ".env.*"
  "*.key"
  "*.pem"
  "*.p12"
  "*secret*"
  "*credential*"
  ".npmrc"
  ".yarnrc"
)

FOUND_SENSITIVE=0
for pattern in "${SENSITIVE_FILES[@]}"; do
  if find . -type f -name "$pattern" -not -path "*/node_modules/*" -not -path "*/.git/*" | grep -q .; then
    FOUND_SENSITIVE=1
    echo -e "${RED}Found sensitive file matching: $pattern${NC}"
    find . -type f -name "$pattern" -not -path "*/node_modules/*" -not -path "*/.git/*"
  fi
done

if [ $FOUND_SENSITIVE -eq 0 ]; then
  print_status 0 "No sensitive files found"
else
  print_status 1 "Sensitive files found - ensure they are in .gitignore"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "6. Checking TypeScript compilation..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if npm run build &> /dev/null; then
  print_status 0 "TypeScript compilation successful"
else
  print_status 1 "TypeScript compilation failed"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "7. Running tests..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if npm test &> /dev/null; then
  print_status 0 "All tests passed"
else
  print_status 1 "Some tests failed"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "8. Checking for production dependencies..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check that dependencies object is empty or not present
DEPS_COUNT=$(node -p "Object.keys(require('./package.json').dependencies || {}).length" 2>/dev/null || echo "0")
if [ "$DEPS_COUNT" = "0" ]; then
  print_status 0 "Zero production dependencies (as expected)"
else
  print_status 1 "Found $DEPS_COUNT production dependencies (should be zero)"
  print_warning "IterFlow should have zero production dependencies"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Security Check Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✓ All security checks passed!${NC}"
  exit 0
else
  echo -e "${RED}✗ Some security checks failed${NC}"
  echo ""
  echo "Please fix the issues above before committing or releasing."
  exit 1
fi
