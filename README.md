This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
## FE-07: AI Tool Integration

Pixora AI includes a server-side tool that analyzes photography concepts and returns structured data that is rendered as a dedicated UI component.

### Tool Contract

**Tool Name:** `analyzePhotographyIdea`

**Purpose:**  
Analyzes a photography idea and returns a structured evaluation.

**Input Schema:**
- `idea`: string
- Minimum length: 10 characters

**Return Shape:**
- `score`: number
- `wordCount`: number
- `category`: string
- `findings`: string array

### Tool UI States

The interface handles four tool lifecycle states:

- `input-streaming` — displays a preparation/loading state
- `input-available` — displays the photography idea being analyzed
- `output-available` — renders the structured result as a Photography Analysis card
- `output-error` — displays a designed error card without crashing the application

### Error Handling

For demonstration and testing, tool execution can intentionally fail when the input contains the word `fail`. The failure is rendered through the tool's designed error state.