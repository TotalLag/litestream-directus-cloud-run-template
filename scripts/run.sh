#!/bin/bash
set -e

# Restore the database if it does not already exist.
if [ -f /directus/database/database.sqlite ]; then
  echo "Database already exists, skipping restore"
else
  echo "No database found, restoring from replica if exists"
  litestream restore -v -parallelism 64 -if-replica-exists -o /directus/database/database.sqlite "/directus/database/database.sqlite"
fi

npx directus bootstrap

if [[ -z "${SNAPSHOT_URL}" || ! -f ./snapshot.yml ]]; then

  if [ -f /etc/snapshot.yml ]; then
    echo "Snapshot file found on disk, attempting to apply..."
    npx directus schema apply --yes /etc/snapshot.yml
  fi

else

  echo "Snapshot URL found, attempting to download and apply..."
  wget -O ./snapshot.yml "${SNAPSHOT_URL}"
  npx directus schema apply --yes ./snapshot.yml

fi

ls -alh .

# Run litestream with your app as the subprocess.
exec litestream replicate -exec "npx directus start"
