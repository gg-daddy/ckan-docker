# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Docker Compose setup for CKAN (Comprehensive Knowledge Archive Network) - an open-source data portal platform. The repository provides both production and development configurations with six core services: CKAN, NGINX (reverse proxy with SSL), PostgreSQL, Solr (search), Redis (caching), and DataPusher.

## Common Commands

### Production Mode
```bash
cp .env.example .env    # Configure environment
docker compose build    # Build containers
docker compose up       # Start services (HTTPS on port 8443)
```

### Development Mode
```bash
bin/compose build       # Build dev containers
bin/install_src         # Install extensions from src/
bin/compose up          # Start dev mode (HTTP on port 5000)
```

### Helper Scripts (bin/)
| Script | Purpose |
|--------|---------|
| `bin/ckan` | Execute CKAN CLI commands in container |
| `bin/compose` | Docker compose wrapper for dev mode |
| `bin/generate_extension` | Scaffold new CKAN extension in src/ |
| `bin/install_src` | Install all extensions from src/ |
| `bin/reload` | Reload CKAN without container restart |
| `bin/restart` | Restart ckan-dev container |
| `bin/shell` | Open bash shell in container |

### User Management
```bash
bin/ckan user add admin email=admin@example.com
bin/ckan sysadmin add admin
bin/ckan user list
```

## Architecture

### Docker Services
- **ckan**: Main application (production: ckan-base:2.11, dev: ckan-dev:2.11)
- **nginx**: Reverse proxy with self-signed SSL, proxies to ckan:5000
- **db**: PostgreSQL 16-alpine with CKAN DB, DataStore DB, and test DBs
- **solr**: ckan/ckan-solr:2.10-solr9 for search indexing
- **redis**: Redis 6 for caching and task queues
- **datapusher**: Automatic resource upload to DataStore

### Network Segregation
- `webnet`: External NGINX network
- `ckannet`: CKAN internal network
- `dbnet`: Database network (internal only)
- `solrnet`, `redisnet`: Service-specific networks

### Key Volumes
- `ckan_storage`: File uploads (/var/lib/ckan)
- `pg_data`: PostgreSQL persistence
- `solr_data`: Search index
- `./src:/srv/app/src_extensions`: Development extension mounting

## Configuration

### Environment Variables
Configuration uses `ckanext-envvars` format:
- Replace periods with double underscores
- All uppercase, prepend CKAN or CKANEXT
- Example: `ckan.plugins` → `CKAN__PLUGINS`

Key variables in `.env`:
- `CKAN__PLUGINS`: Enabled plugins list
- `CKAN_SYSADMIN_*`: Default admin credentials
- `CKAN_SITE_URL`: Public URL (must match actual access URL)

### Extension Development
1. Create extension: `bin/generate_extension`
2. Extension appears in `src/ckanext-myextension/`
3. Install: `bin/install_src`
4. Add to `CKAN__PLUGINS` in `.env`
5. Reload: `bin/reload`

### Patches System
Place patches in `ckan/patches/<package-name>/` (e.g., `ckan/patches/ckan/`). Applied alphabetically during build.

## Startup Flow

1. PostgreSQL init scripts create databases (CKAN, DataStore, test DBs)
2. CKAN waits for DB/Solr connectivity (5 retries)
3. `prerun.py.override` initializes database and creates sysadmin
4. Scripts in `ckan/docker-entrypoint.d/` execute in order
5. uWSGI (production) or dev server with auto-reload (development)

## Development Options

### Remote Debugging
Set `USE_DEBUGPY_FOR_DEV=true` in `.env` for VS Code debugging.

### HTTPS in Development
Set `USE_HTTPS_FOR_DEV=true` in `.env`.

## Database Connections

- CKAN DB: `postgresql://ckandbuser:ckandbpassword@db/ckandb`
- DataStore Write: `postgresql://ckandbuser:ckandbpassword@db/datastore`
- DataStore Read: `postgresql://datastore_ro:datastore@db/datastore`
