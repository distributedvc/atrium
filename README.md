# :mushroom: Atrium

> GraphQL URL shortener for [Distributed](https://distributed.sh) applications.

# Quickstart

- [Yarn](https://yarnpkg.com/lang/en/docs/install/#mac-tab)
- [Node.js 14.x](https://nodejs.org/en/) (Or LTS)

```bash
# ensure you have the prerequisites
# install
brew install node && brew install yarn

# OR update
brew update && brew upgrade && brew install yarn

# install dependencies
yarn

# Docker compose
docker-compose up -d

# serve with file watch at localhost:4000
yarn dev

# run all tests
yarn test
```

---

#### .env configuration

```bash
# PostgresURL Endpoint
POSTGRES_URL="postgresql://postgres:prisma@localhost:5432/prisma?connection_limit=1"

# Segment Key
SEGMENT_ANALYTICS_KEY=""
```
