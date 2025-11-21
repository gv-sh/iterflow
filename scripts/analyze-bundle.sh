#!/bin/bash

# Bundle Size Analysis Script
# Analyzes bundle sizes and provides optimization recommendations

set -e

echo "📦 Bundle Size Analysis"
echo "======================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Build first
echo "Building project..."
npm run build > /dev/null 2>&1

if [ ! -d "dist" ]; then
  echo "${RED}❌ Build failed or dist directory not found${NC}"
  exit 1
fi

echo "${GREEN}✅ Build successful${NC}"
echo ""

# Target sizes
TARGET_GZIP=15360  # 15KB in bytes
WARNING_GZIP=12288 # 12KB in bytes

echo "Bundle Sizes:"
echo "============="
echo ""

# Analyze each file
for file in dist/*.js dist/*.cjs; do
  if [ -f "$file" ]; then
    # Get file size
    size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
    size_kb=$(echo "scale=2; $size / 1024" | bc)

    # Get gzipped size
    gzip_size=$(gzip -c "$file" | wc -c | tr -d ' ')
    gzip_kb=$(echo "scale=2; $gzip_size / 1024" | bc)

    # Get brotli size if available
    if command -v brotli &> /dev/null; then
      brotli_size=$(brotli -c "$file" | wc -c | tr -d ' ')
      brotli_kb=$(echo "scale=2; $brotli_size / 1024" | bc)
    else
      brotli_size=0
      brotli_kb="N/A"
    fi

    filename=$(basename "$file")

    echo "📄 $filename"
    echo "   Raw:     ${size_kb} KB"
    echo "   Gzipped: ${gzip_kb} KB"
    if [ "$brotli_kb" != "N/A" ]; then
      echo "   Brotli:  ${brotli_kb} KB"
    fi

    # Check against targets
    if [ "$gzip_size" -gt "$TARGET_GZIP" ]; then
      echo "   ${RED}⚠️  Exceeds 15KB gzipped target${NC}"
    elif [ "$gzip_size" -gt "$WARNING_GZIP" ]; then
      echo "   ${YELLOW}⚠️  Approaching 15KB target${NC}"
    else
      echo "   ${GREEN}✅ Within target${NC}"
    fi
    echo ""
  fi
done

# Calculate total size
total_gzip=0
for file in dist/*.js dist/*.cjs; do
  if [ -f "$file" ]; then
    gzip_size=$(gzip -c "$file" | wc -c | tr -d ' ')
    total_gzip=$((total_gzip + gzip_size))
  fi
done

total_gzip_kb=$(echo "scale=2; $total_gzip / 1024" | bc)

echo "Total (all bundles): ${total_gzip_kb} KB gzipped"
echo ""

# Provide recommendations
echo "Optimization Recommendations:"
echo "============================"
echo ""

# Check if minification is enabled
if grep -q '"minify": false' tsup.config.ts 2>/dev/null; then
  echo "⚠️  Minification is disabled in tsup.config.ts"
  echo "   Consider enabling for production builds"
  echo ""
fi

# Check for source maps
if [ -f "dist/index.js.map" ]; then
  map_size=$(stat -f%z "dist/index.js.map" 2>/dev/null || stat -c%s "dist/index.js.map" 2>/dev/null)
  map_kb=$(echo "scale=2; $map_size / 1024" | bc)
  echo "ℹ️  Source maps: ${map_kb} KB (not shipped to users)"
  echo ""
fi

# Suggestions
echo "💡 Optimization Tips:"
echo ""
echo "1. Enable minification in tsup.config.ts for production"
echo "2. Use named exports for better tree-shaking"
echo "3. Avoid default exports"
echo "4. Keep zero runtime dependencies"
echo "5. Use generators for memory efficiency"
echo ""

# Tree-shaking verification
echo "Tree-Shaking Verification:"
echo "========================="
echo ""

# Check exports
if [ -f "src/index.ts" ]; then
  export_count=$(grep -c "^export" src/index.ts || true)
  default_export=$(grep -c "export default" src/index.ts || true)

  echo "Named exports: $export_count"
  echo "Default exports: $default_export"

  if [ "$default_export" -gt 0 ]; then
    echo "${YELLOW}⚠️  Default exports found - consider converting to named exports${NC}"
  else
    echo "${GREEN}✅ No default exports - good for tree-shaking${NC}"
  fi
  echo ""
fi

# Final status
echo "Final Status:"
echo "============="
echo ""

if [ "$total_gzip" -le "$TARGET_GZIP" ]; then
  echo "${GREEN}✅ Bundle size target met! (< 15KB gzipped)${NC}"
  exit 0
elif [ "$total_gzip" -le "$((TARGET_GZIP * 120 / 100))" ]; then
  echo "${YELLOW}⚠️  Bundle size slightly over target (< 20% over)${NC}"
  exit 0
else
  echo "${RED}❌ Bundle size exceeds target by >20%${NC}"
  echo "   Please review and optimize before release"
  exit 1
fi
