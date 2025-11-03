This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

``` install node_module
npm install
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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Render

The easiest way to deploy your Next.js app is to use the [Render](https://render.com/) platform.

### Steps to Deploy

1. Push your code to GitHub, GitLab, or Bitbucket.
2. Log in to your [Render Dashboard](https://dashboard.render.com/).
3. Click **"New +"** → **"Web Service"**.
4. Connect your repository.
5. Fill in the settings:

   - **Environment**: Node
   - **Build Command**:
     ```bash
     npm install && npm run build
     ```
   - **Start Command**:
     ```bash
     npm run start
     ```
   - **Environment Variables**: Add any required variables.

- **Custom Domain**:  
  After deployment, you can configure a custom domain through the Render dashboard.

### Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Render Documentation](https://render.com/docs)
- [Deploying Next.js to Render Guide](https://render.com/docs/deploy-nextjs)

