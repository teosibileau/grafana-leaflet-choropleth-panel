#!/bin/bash
# Seed InfluxDB with 1 year of hourly data for 13 Rio Negro departamentos.
# Runs automatically on first container start via /docker-entrypoint-initdb.d/.

set -e

SEED_FILE="/tmp/seed.txt"
DB="rio_negro"
HOURS_IN_YEAR=8760

# 13 departamentos with base values for variation
DEPTS=(
  "CONESA:40"
  "VALCHETA:75"
  "SAN\ ANTONIO:13"
  "9\ DE\ JULIO:60"
  "ÑORQUINCO:30"
  "25\ DE\ MAYO:90"
  "EL\ CUY:55"
  "PILCANIYEU:34"
  "PICHI\ MAHUIDA:88"
  "ADOLFO\ ALSINA:46"
  "BARILOCHE:99"
  "AVELLANEDA:65"
  "GENERAL\ ROCA:76"
)

echo "Generating seed data..."

# Write import header
cat > "$SEED_FILE" <<EOF
# DDL
CREATE DATABASE ${DB}

# DML
# CONTEXT-DATABASE: ${DB}

EOF

NOW=$(date +%s)
START=$((NOW - HOURS_IN_YEAR * 3600))

for entry in "${DEPTS[@]}"; do
  # Split name:base_value
  DEPT_LP="${entry%%:*}"
  BASE="${entry##*:}"

  for ((i = 0; i < HOURS_IN_YEAR; i++)); do
    TS=$((START + i * 3600))
    # Deterministic pseudo-random offset: use modular arithmetic for variation
    OFFSET=$(( (i * 7 + ${#DEPT_LP} * 13) % 41 - 20 ))
    VALUE=$((BASE + OFFSET))
    # Ensure non-negative
    if [ "$VALUE" -lt 0 ]; then
      VALUE=0
    fi
    echo "metric,departamento=${DEPT_LP} value=${VALUE}i ${TS}" >> "$SEED_FILE"
  done
done

LINES=$(wc -l < "$SEED_FILE")
echo "Seed file ready: ${LINES} lines"

echo "Importing into InfluxDB..."
influx -import -path="$SEED_FILE" -precision=s

echo "Seed complete."
