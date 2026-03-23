#!/usr/bin/env python3
"""
Facebook Poster Script for Arcera Digital Marketing
Part of the Agent Factory Pipeline

Usage:
    python3 scripts/facebook_poster.py create --variation 3 --schedule "2026-03-25 10:00"
    python3 scripts/facebook_poster.py post --post-id 1
    python3 scripts/facebook_poster.py schedule --variation 5 --datetime "2026-03-26 14:00"
"""

import json
import os
import sys
import urllib.request
import urllib.parse
from datetime import datetime
from pathlib import Path

# Configuration
MARKETING_DIR = Path(__file__).parent.resolve()
POSTS_FILE = MARKETING_DIR / "posts.json"
VARIATIONS_FILE = MARKETING_DIR / "post-variations.md"

def load_env():
    """Load credentials from .env file"""
    env_file = MARKETING_DIR / ".env"
    if env_file.exists():
        for line in env_file.read_text().strip().split('\n'):
            if line and not line.startswith('#') and '=' in line:
                k, v = line.split('=', 1)
                os.environ[k.strip()] = v.strip()

def get_page_token():
    """Get Facebook page access token"""
    load_env()
    user_token = os.environ.get("FACEBOOK_USER_TOKEN")
    page_id = os.environ.get("FACEBOOK_PAGE_ID")
    
    if not user_token or not page_id:
        return None
    
    url = f"https://graph.facebook.com/v18.0/{page_id}?fields=access_token&access_token={user_token}"
    try:
        with urllib.request.urlopen(url) as r:
            return json.loads(r.read().decode())['access_token']
    except:
        return None

def post_to_facebook(message):
    """Post a message to Facebook page"""
    page_token = get_page_token()
    if not page_token:
        print("❌ No page token. Check .env file.")
        return None
    
    page_id = os.environ.get("FACEBOOK_PAGE_ID")
    url = f"https://graph.facebook.com/v18.0/{page_id}/feed"
    data = {"message": message, "access_token": page_token}
    
    req = urllib.request.Request(url, data=urllib.parse.urlencode(data).encode(), method="POST")
    try:
        with urllib.request.urlopen(req) as r:
            result = json.loads(r.read().decode())
            print(f"✅ Posted! ID: {result.get('id')}")
            return result.get('id')
    except urllib.error.HTTPError as e:
        print(f"❌ Error: {e.read().decode()}")
        return None

class FacebookPoster:
    def __init__(self):
        self.posts = self.load_posts()
    
    def load_posts(self):
        if POSTS_FILE.exists():
            with open(POSTS_FILE, 'r') as f:
                return json.load(f)
        return {"posts": [], "scheduled": []}
    
    def save_posts(self):
        with open(POSTS_FILE, 'w') as f:
            json.dump(self.posts, f, indent=2)
    
    def get_variation(self, variation_num):
        """Extract specific variation from post-variations.md"""
        if not VARIATIONS_FILE.exists():
            return None
        
        with open(VARIATIONS_FILE, 'r') as f:
            content = f.read()
        
        # Parse variations - look for "## Post Variation {num}:"
        lines = content.split('\n')
        in_variation = False
        variation_content = []
        current_num = None
        
        for line in lines:
            if line.strip().startswith('## Post Variation ') and ':' in line:
                num_part = line.split('## Post Variation ')[1].split(':')[0].strip()
                try:
                    current_num = int(num_part)
                except:
                    current_num = None
                
                if current_num == variation_num:
                    in_variation = True
                    variation_content.append(line)
                elif in_variation:
                    # Started new variation, stop collecting
                    break
            elif in_variation and line.strip().startswith('## '):
                # Hit next major section
                break
            elif in_variation:
                variation_content.append(line)
        
        if variation_content:
            return '\n'.join(variation_content)
        return None
    
    def create_post(self, variation_num, scheduled_datetime=None, platform='facebook'):
        """Create a new post from variation"""
        variation = self.get_variation(variation_num)
        
        if not variation:
            print(f"Error: Variation {variation_num} not found")
            return None
        
        post = {
            "id": len(self.posts["posts"]) + 1,
            "variation": variation_num,
            "platform": platform,
            "content": variation,
            "status": "scheduled" if scheduled_datetime else "draft",
            "scheduled_at": scheduled_datetime,
            "created_at": datetime.now().isoformat(),
            "metrics": {
                "impressions": 0,
                "engagements": 0,
                "clicks": 0,
                "ctr": 0
            }
        }
        
        self.posts["posts"].append(post)
        self.save_posts()
        
        print(f"Created post #{post['id']} from variation {variation_num}")
        return post
    
    def schedule_post(self, post_id, datetime_str):
        """Schedule a post for specific time"""
        for post in self.posts["posts"]:
            if post["id"] == post_id:
                post["scheduled_at"] = datetime_str
                post["status"] = "scheduled"
                self.save_posts()
                print(f"Scheduled post #{post_id} for {datetime_str}")
                return post
        print(f"Post #{post_id} not found")
        return None
    
    def list_posts(self, status=None):
        """List all posts, optionally filtered by status"""
        posts = self.posts["posts"]
        
        if status:
            posts = [p for p in posts if p["status"] == status]
        
        for post in posts:
            print(f"Post #{post['id']}: {post['status']} | Variation {post['variation']}")
            if post.get("scheduled_at"):
                print(f"  Scheduled: {post['scheduled_at']}")
    
    def get_pending_posts(self):
        """Get posts ready to be posted"""
        now = datetime.now()
        pending = []
        
        for post in self.posts["posts"]:
            if post["status"] == "scheduled" and post.get("scheduled_at"):
                scheduled = datetime.fromisoformat(post["scheduled_at"])
                if scheduled <= now:
                    pending.append(post)
        
        return pending


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return
    
    poster = FacebookPoster()
    command = sys.argv[1]
    
    if command == "create":
        variation = 1
        schedule = None
        for arg in sys.argv[2:]:
            if "--variation" in arg:
                variation = int(arg.split("=")[1]) if "=" in arg else int(arg.split("--variation")[1].strip("-"))
            elif "--schedule" in arg:
                schedule = arg.split("=")[1] if "=" in arg else sys.argv[sys.argv.index(arg)+1]
            elif arg.isdigit():
                variation = int(arg)
        poster.create_post(variation, schedule)
    
    elif command == "list":
        poster.list_posts()
    
    elif command == "schedule":
        post_id = int(sys.argv[2].split("=")[1]) if "--post-id" in sys.argv[2] else None
        datetime_str = sys.argv[3].split("=")[1] if "--datetime" in sys.argv[3] else None
        if post_id and datetime_str:
            poster.schedule_post(post_id, datetime_str)
    
    elif command == "post":
        # Get post ID from argument
        post_id = None
        for arg in sys.argv[2:]:
            if "--post-id" in arg:
                post_id = int(arg.split("=")[1]) if "=" in arg else int(arg.split("--post-id")[1].strip("-"))
            elif arg.isdigit():
                post_id = int(arg)
        
        if not post_id:
            print("Usage: python3 poster_script.py post <post_id>")
            return
        
        # Find the post
        for post in poster.posts["posts"]:
            if post["id"] == post_id:
                # Extract just the content (strip variation header)
                content = post.get("content", "")
                if content.startswith("## Post Variation"):
                    # Remove the header line
                    lines = content.split('\n')
                    content = '\n'.join(lines[2:])  # Skip first 2 lines (header + angle)
                
                # Post to Facebook
                fb_id = post_to_facebook(content)
                if fb_id:
                    post["status"] = "posted"
                    post["facebook_id"] = fb_id
                    post["posted_at"] = datetime.now().isoformat()
                    poster.save_posts()
                return
        
        print(f"Post #{post_id} not found")
    
    elif command == "post-all":
        # Post all draft posts
        for post in poster.posts["posts"]:
            if post["status"] == "draft":
                content = post.get("content", "")
                if content.startswith("## Post Variation"):
                    lines = content.split('\n')
                    content = '\n'.join(lines[2:])
                
                print(f"Posting #{post['id']}...", end=" ")
                fb_id = post_to_facebook(content)
                if fb_id:
                    post["status"] = "posted"
                    post["facebook_id"] = fb_id
                    post["posted_at"] = datetime.now().isoformat()
        
        poster.save_posts()
        print("Done!")
    
    else:
        print(__doc__)


if __name__ == "__main__":
    main()