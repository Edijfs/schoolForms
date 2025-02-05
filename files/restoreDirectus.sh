#!/bin/bash

# Configuration
AWS_BUCKET="directusdb"
DIRECTUS_PATH="/home/ubuntu/Desktop/directus"
TEMP_DIR="/tmp/restore_temp"

echo "Starting Directus restore process..."

# Create temp directory
rm -rf $TEMP_DIR
mkdir -p $TEMP_DIR

# Get latest backup from S3
echo "Getting latest backup from S3..."
LATEST_BACKUP=$(aws s3 ls s3://$AWS_BUCKET/backups/ | sort | tail -n 1 | awk '{print $4}')
echo "Latest backup file: $LATEST_BACKUP"

# Download latest backup
echo "Downloading backup..."
aws s3 cp s3://$AWS_BUCKET/backups/$LATEST_BACKUP $TEMP_DIR/

# Extract backup
cd $TEMP_DIR
echo "Extracting backup..."
tar -xzf $LATEST_BACKUP

# Stop Directus
echo "Stopping Directus..."
cd $DIRECTUS_PATH
docker compose down

# Backup current state
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="${DIRECTUS_PATH}_old_${TIMESTAMP}"
echo "Backing up current files to $BACKUP_DIR"
mkdir -p $BACKUP_DIR
mv $DIRECTUS_PATH/* $BACKUP_DIR/

# Copy files from backup
echo "Restoring files from backup..."
EXTRACT_DIR=$(find $TEMP_DIR -type d -name "directus_backup_*")
cp -rv $EXTRACT_DIR/* $DIRECTUS_PATH/

# Start Directus
echo "Starting Directus..."
cd $DIRECTUS_PATH
docker compose up -d

# Cleanup
echo "Cleaning up..."
rm -rf $TEMP_DIR

echo "Restore completed!"
echo "Old files backed up to: $BACKUP_DIR"
echo "Check docker logs with: docker compose logs"