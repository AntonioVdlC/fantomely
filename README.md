# fantomely
> 👻 Privacy-first web analytics!

## Development

### Prerequisites
- Node
- PostgreSQL

### Dependencies
```sh
npm install
```

### Local
```sh
cp .env.sample .env
```

```sh
DATABASE_URL="postgresql://root:root@localhost:5432/analytics-service-db"
```

```sh
make up
```

```sh
npm run db:migrate
```

```sh
npm run dev
```
