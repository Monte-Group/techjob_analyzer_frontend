# Frontend

Next.js App Router frontend для landing, login и dashboard аналитики IT-рынка.

## Стек

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Recharts
- Axios

## Структура

```text
frontend/
├── app/         # route entrypoints
├── views/       # page-level compositions
├── widgets/     # крупные UI-секции
├── features/    # прикладные интерактивные блоки
├── entities/    # domain-level types/helpers
├── shared/      # shared UI and utilities
└── lib/api.ts   # основной клиент backend API
```

## Переменные окружения

Опционально:

```env
NEXT_PUBLIC_API_URL=/api-proxy
BACKEND_URL=http://localhost:8000
```

По умолчанию frontend использует локальный route handler `/api-proxy`, который проксирует запросы к backend и корректно передаёт SSE/cookies.

## Запуск

```bash
cd frontend
yarn install
yarn dev
```

## Проверки

```bash
cd frontend
yarn lint
yarn build
```

## Важные замечания

- Аутентификация теперь опирается на `HttpOnly` cookie, а не на `localStorage` как основной источник истины.
- Не добавляй raw `fetch`/`axios` вызовы в компоненты без причины: сначала расширяй `lib/api.ts`.
- Для backend SSE-запросов используй `/api-proxy`, а не прямой `localhost:8000`.
