#!/bin/bash
set -e

# Restore the database if it does not already exist.
if [ -f /directus/database/database.sqlite ]; then
  echo "Database already exists, skipping restore"
else
  echo "No database found, restoring from replica if exists"
  litestream restore -v -parallelism 64 -if-replica-exists -o /directus/database/database.sqlite "/directus/database/database.sqlite"
fi

if [[ -z "${SNAPSHOT_URL}" ]]; then

    echo "No schema snapshot present."

else

  echo "Snapshot URL found, attempting to download and apply..."
  wget -O ./snapshot.yml "${SNAPSHOT_URL}" &&
  npx directus schema apply --yes ./snapshot.yml && rm -f ./snapshot.yml &&
  echo "Snapshot applied!"

fi

npx directus bootstrap &&

# Run litestream with your app as the subprocess.
exec litestream replicate -exec "npx directus start"
