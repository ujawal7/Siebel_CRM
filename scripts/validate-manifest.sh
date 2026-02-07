#!/bin/bash
# validate-manifest.sh
# Validates if the manifest.xml is well-formed XML.

if [ -z "$1" ]; then
  echo "Usage: ./validate-manifest.sh <path-to-manifest.xml>"
  exit 1
fi

if ! command -v xmllint &> /dev/null; then
  echo "Error: xmllint is not installed."
  exit 1
fi

xmllint --noout "$1"
if [ $? -eq 0 ]; then
  echo "✅ Manifest is valid XML."
else
  echo "❌ Manifest XML is invalid."
  exit 1
fi
