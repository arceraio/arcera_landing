#!/usr/bin/env python3
"""Test Facebook API posting"""

import os
import json
from pathlib import Path

# Load .env manually
env_path = Path(__file__).parent / ".env"
if env_path.exists():
    for line in env_path.read_text().strip().split('\n'):
        if line and not line.startswith('#') and '=' in line:
            key, val = line.split('=', 1)
            os.environ[key.strip()] = val.strip()

PAGE_ID = os.environ.get("FACEBOOK_PAGE_ID")
ACCESS_TOKEN = os.environ.get("FACEBOOK_ACCESS_TOKEN")

# Test post content
message = """🏠 Homeowners: This is why I document everything now.

A client in Pacific Palisades had $80k in wine collection damage. Insurance offered $12k.

Why? No documentation. No proof. No fight.

She eventually got $80k — but it took 8 months of battles.

Don't be her. Document your home today.

🔗 arcera-digital.netlify.app

#Homeowners #InsuranceClaims #LAHomeowners #ProtectYourHome"""

# Post to Facebook
import urllib.request
import urllib.parse

url = f"https://graph.facebook.com/v18.0/{PAGE_ID}/feed"
data = {"message": message, "access_token": ACCESS_TOKEN}
encoded_data = urllib.parse.urlencode(data).encode()

req = urllib.request.Request(url, data=encoded_data, method="POST")

try:
    with urllib.request.urlopen(req) as response:
        result = json.loads(response.read().decode())
        print("✅ Post successful!")
        print(f"Post ID: {result.get('id')}")
except urllib.error.HTTPError as e:
    print(f"❌ Error: {e.code}")
    print(e.read().decode())