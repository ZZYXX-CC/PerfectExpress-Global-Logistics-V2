#!/bin/bash

# Configuration
REPO_URL="https://github.com/ZZYXX-CC/perfectexpress-courier.git"
REPO_DIR="perfectexpress-courier"
BRANCH_NAME="feature/frontend-v2"
TARGET_DIR="frontend-v2"

echo "🚀 Starting PerfectExpress V2 Integration..."

# 1. Clone the existing repository
if [ -d "$REPO_DIR" ]; then
    echo "⚠️  Directory '$REPO_DIR' already exists. Using existing directory."
else
    echo "📦 Cloning repository..."
    git clone $REPO_URL
fi

# 2. Enter Repo and Setup Branch
cd $REPO_DIR || { echo "❌ Failed to enter directory"; exit 1; }

echo "🌿 Setting up branch '$BRANCH_NAME'..."
# Try to switch to branch, if not exists, create it
git checkout $BRANCH_NAME 2>/dev/null || git checkout -b $BRANCH_NAME

# 3. Create Target Directory
echo "📂 Creating '$TARGET_DIR' directory..."
mkdir -p $TARGET_DIR

# 4. Copy Files
echo "cwd: $(pwd)"
echo "📋 Copying files from parent directory..."

# We are inside perfectexpress-courier, so source files are in ../
cp ../index.html $TARGET_DIR/
cp ../index.tsx $TARGET_DIR/
cp ../types.ts $TARGET_DIR/
cp ../metadata.json $TARGET_DIR/
cp ../README.md $TARGET_DIR/
cp ../INTEGRATION_GUIDE.md $TARGET_DIR/ 2>/dev/null

# Copy directories
mkdir -p $TARGET_DIR/components
cp -r ../components/* $TARGET_DIR/components/

mkdir -p $TARGET_DIR/services
cp -r ../services/* $TARGET_DIR/services/

# 5. Git Status
echo ""
echo "✅ Integration successful. Here is the status:"
git status

echo ""
echo "🎉 READY TO PUSH!"
echo "Run the following commands to finish:"
echo "-------------------------------------"
echo "cd $REPO_DIR"
echo "git add $TARGET_DIR"
echo "git commit -m 'feat: integrate v2 frontend'"
echo "git push origin $BRANCH_NAME"
echo "-------------------------------------"
