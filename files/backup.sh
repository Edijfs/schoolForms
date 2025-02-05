#!/bin/bash

AWS_BUCKET="directusdb"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
TEMP_DIR="/tmp/directus_backup_$TIMESTAMP"
DIRECTUS_PATH="/home/ubuntu/Desktop/directus"

mkdir -p "$TEMP_DIR"

echo "Backing up database and files..."
cp -r "$DIRECTUS_PATH/database" "$TEMP_DIR/"
cp -r "$DIRECTUS_PATH/extensions" "$TEMP_DIR/"
cp -r "$DIRECTUS_PATH/uploads" "$TEMP_DIR/"
cp "$DIRECTUS_PATH/docker-compose.yml" "$TEMP_DIR/"

cd /tmp
tar -czf "directus_backup_$TIMESTAMP.tar.gz" "directus_backup_$TIMESTAMP"

echo "Uploading to S3..."
aws s3 cp "directus_backup_$TIMESTAMP.tar.gz" "s3://$AWS_BUCKET/backups/directus_backup_$TIMESTAMP.tar.gz"

rm -rf "$TEMP_DIR"
rm "directus_backup_$TIMESTAMP.tar.gz"

echo "Backup completed and uploaded to S3: directus_backup_$TIMESTAMP.tar.gz"