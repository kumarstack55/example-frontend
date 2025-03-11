# example-frontend

## Install

```bash
npm install
```

## Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Build image

```bash
docker buildx build -t example-frontend .

# or

docker compose build
```

## Run container

```bash
docker run -p 3000:3000 example-frontend

# or

docker compose up
```

## Run tests

```bash
npm test
```

## LICENSE

MIT