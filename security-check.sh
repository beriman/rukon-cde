grep -rnw 'apps/api/src' -e '@Controller' | while read -r line; do
  file=$(echo "$line" | cut -d: -f1)
  has_guard=$(grep -c "UseGuards(JwtAuthGuard)" "$file")
  has_authguard=$(grep -c "UseGuards(AuthGuard('jwt'))" "$file")
  if [ "$has_guard" -eq 0 ] && [ "$has_authguard" -eq 0 ]; then
    echo "NO AUTH GUARD: $file"
  else
    if grep -q "// @UseGuards(JwtAuthGuard)" "$file" || grep -q "// @UseGuards(AuthGuard('jwt'))" "$file"; then
      echo "COMMENTED OUT GUARD: $file"
    fi
  fi
done
