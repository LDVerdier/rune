# Rune

React SSR app built with [React Router 7](https://reactrouter.com/) (framework mode), Vite, TypeScript, and Tailwind CSS.

## Development

```sh
npm install
npm run dev
```

## Scripts

| Command            | Description                  |
| ------------------ | ---------------------------- |
| `npm run dev`      | Start development server     |
| `npm run build`    | Production build             |
| `npm run start`    | Serve production build       |
| `npm run lint`     | Run ESLint                   |
| `npm run typecheck`| Run TypeScript type checking |
| `npm test`         | Run tests                    |

## Docker

```sh
docker build -t rune .
docker run -p 3000:3000 rune
```
