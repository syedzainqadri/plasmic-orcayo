#!/bin/bash

set -o errexit -o nounset

PGPASSWORD="SEKRET"
cat > ~/.pgpass << EOF
localhost:5432:*:wab:$PGPASSWORD
localhost:5432:*:cypress:$PGPASSWORD
localhost:5432:*:superwab:$PGPASSWORD
localhost:5432:*:supertdbwab:$PGPASSWORD
EOF
chmod 600 ~/.pgpass

# The wab user and database are already created via environment variables
# So we only need to create additional users and setup extensions

# Connect using the POSTGRES_USER (wab) which has superuser privileges in this context
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER cypress WITH PASSWORD '$PGPASSWORD';
    CREATE USER superwab WITH PASSWORD '$PGPASSWORD' CREATEDB CREATEROLE IN ROLE wab;
    CREATE USER supertdbwab WITH PASSWORD '$PGPASSWORD' CREATEDB CREATEROLE IN ROLE wab;
    GRANT ALL PRIVILEGES ON DATABASE wab TO wab;
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
EOSQL
