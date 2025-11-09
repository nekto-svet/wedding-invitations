# Setting Up Multiple GitHub Accounts on One Machine

## Method 1: SSH Keys with SSH Config (Recommended)

### Step 1: Generate SSH keys for each account

```bash
# For account 1 (personal)
ssh-keygen -t ed25519 -C "your-personal-email@example.com" -f ~/.ssh/id_ed25519_personal

# For account 2 (work/other)
ssh-keygen -t ed25519 -C "your-work-email@example.com" -f ~/.ssh/id_ed25519_work
```

### Step 2: Add SSH keys to SSH agent

```bash
# Start SSH agent
eval "$(ssh-agent -s)"

# Add keys
ssh-add ~/.ssh/id_ed25519_personal
ssh-add ~/.ssh/id_ed25519_work
```

### Step 3: Add public keys to GitHub

```bash
# Copy public keys
cat ~/.ssh/id_ed25519_personal.pub
cat ~/.ssh/id_ed25519_work.pub
```

Add each public key to the corresponding GitHub account:
- GitHub → Settings → SSH and GPG keys → New SSH key

### Step 4: Configure SSH config

Create/edit `~/.ssh/config`:

```
# Personal GitHub account
Host github.com-personal
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_personal

# Work GitHub account
Host github.com-work
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_work
```

### Step 5: Set up repository-specific Git config

For this project (if it's personal):
```bash
cd "/Users/sveta/My Projects/Invitations"
git config user.name "Your Personal Name"
git config user.email "your-personal-email@example.com"
```

For work projects:
```bash
cd "/path/to/work/project"
git config user.name "Your Work Name"
git config user.email "your-work-email@example.com"
```

### Step 6: Use correct host when cloning/pushing

When cloning or setting remote:
```bash
# For personal account
git remote add origin git@github.com-personal:username/repo.git

# For work account
git remote add origin git@github.com-work:username/repo.git
```

## Method 2: Per-Repository Git Config (Simpler)

If you don't want to set up SSH config, you can just set local Git config per repository:

```bash
# In this project
cd "/Users/sveta/My Projects/Invitations"
git config user.name "Your Name"
git config user.email "your-email@example.com"
```

Then use HTTPS with GitHub CLI or personal access tokens for authentication.

## Quick Setup for This Project

1. Check current config:
```bash
git config --list
```

2. Set local config for this repo:
```bash
git config user.name "Your Name"
git config user.email "your-email@example.com"
```

3. Initialize and push:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin git@github.com:YOUR_USERNAME/invitations.git
git push -u origin main
```

