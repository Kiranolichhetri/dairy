# Khairawang Dairy

Farm Fresh Dairy Products – Modern web app for ordering, tracking, and learning about dairy products.

## Features

- Product catalog, blog, and order tracking
- Supabase integration for authentication, data, and admin
- Email notifications for orders and invoices
- SEO optimized (robots.txt, sitemap.xml, alt/title attributes)
- Responsive UI with shadcn-ui and Tailwind CSS
- Custom favicon matching the site logo

## Technologies Used

- React + Vite
- TypeScript
- Supabase
- shadcn-ui
- Tailwind CSS
- Cypress (testing)

## Getting Started

Clone the repository and install dependencies:
```sh
git clone <YOUR_GIT_URL>
cd dairy
npm install
npm run dev
```

## Favicon

The favicon is a circular gradient Milk icon matching the Navbar logo. You can update `public/favicon.svg` to customize it.

## Deployment

You can deploy for free on Vercel, Netlify, or Cloudflare Pages. These platforms support custom domains (after you register one).

### Steps for Vercel/Netlify:
1. Push your code to GitHub.
2. Import your repo into Vercel/Netlify.
3. Set environment variables in the dashboard.
4. Deploy and connect your custom domain (optional).

## SEO

- robots.txt and sitemap.xml are included in `public/`.
- All images and links have descriptive alt/title attributes.
- Proper heading structure for accessibility and SEO.

## Testing

Run Cypress tests:
```sh
npx cypress open
```

## License

MIT
