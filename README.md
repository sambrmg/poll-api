# Docker Compose Nodejs and MySQL example

## Run the System

We can easily run the whole with only a single command:

```bash
docker-compose up
```

Docker will pull the MySQL and Node.js images (if our machine does not have it before).

## Run migrations

```bash
npx sequelize-cli db:migrate
```
