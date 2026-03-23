# Arcera Digital Marketing Pipeline

## Overview
This pipeline manages the full lifecycle of Arcera Digital marketing campaigns from content creation to posting and analytics.

## Pipeline Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Strategy      │───▶│  Create         │───▶│  QA             │
│  (Deepseek)    │    │  (Internal)     │    │  (Opus/qwen)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                      │
                                                      ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │  Report         │◀───│  Post           │
                       │  (Summary)      │    │  (Platform)     │
                       └─────────────────┘    └─────────────────┘
```

## Directory Structure

```
arcera_landing/
├── marketing/
│   ├── facebook/
│   │   ├── post-variations.md    # Copy templates (source)
│   │   ├── poster-concepts.md    # Visual concepts
│   │   ├── scheduler.md          # Posting calendar
│   │   ├── poster_script.py      # Posting CLI tool
│   │   └── pipeline-config.yaml  # Factory config
│   ├── emails/
│   │   ├── email-signup.html     # Signup form component
│   │   └── welcome-sequence.md  # Drip campaign
│   └── README.md                 # This file
```

## Usage

### Quick Start
1. Review post variations in `facebook/post-variations.md`
2. Customize for your campaign
3. Use poster_script.py to create and schedule

### Running the Agent Factory
```bash
# Full pipeline
python3 marketing/facebook/poster_script.py create --variation=1 --schedule="2026-03-25 10:00"

# List scheduled posts
python3 marketing/facebook/poster_script.py list

# Check pending posts
python3 marketing/facebook/poster_script.py pending
```

## Post Variations (Ready to Use)

| # | Type | Best For |
|---|------|----------|
| 1 | Pain Point Hook | Cold traffic, awareness |
| 2 | Simple & Direct | Conversion, retargeting |
| 3 | Fear/Empowerment | High intent users |
| 4 | Social Proof | Trust building |
| 5 | New Homeowner | Lookalike audiences |
| 6 | Question | Engagement, comments |

## Metrics to Track

- **Impressions:** Reach of posts
- **Engagement Rate:** (Likes + Comments + Shares) / Impressions
- **Click-Through Rate:** Clicks / Impressions
- **Cost Per Click:** Spend / Clicks
- **Conversion Rate:** Signups / Clicks
- **Cost Per Acquisition:** Spend / Signups

## Integration Points

### Netlify (Landing Page)
- Links in posts point to arcera.io
- Track with UTM parameters

### Email
- Capture: email-signup.html component
- Integration: Send to email service (Mailchimp, etc.)

### Analytics
- Facebook Pixel for conversion tracking
- UTM parameters for source attribution