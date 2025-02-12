# EduScreen

A modern classroom management tool that helps teachers and students stay organized and focused.

## Features

- Timer widget for time management
- Calculator for quick calculations
- Notes widget for important reminders
- Document management system
- Classroom state persistence
- Google Sign-in integration
- YouTube integration for educational content

## Prerequisites

- Node.js 18+ and npm
- Supabase CLI
- Vercel CLI (optional for deployment)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
YOUTUBE_API_KEY=your_youtube_api_key
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up Supabase:
   ```bash
   ./scripts/supabase-setup.sh
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Migrations

The project uses Supabase for database management. Migrations are stored in `supabase/migrations/`.

To apply migrations:
```bash
supabase db reset
```

## Deployment

### Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

### Supabase

1. Create a new project on [Supabase](https://app.supabase.io)
2. Get your project URL and keys from the project settings
3. Update your environment variables in Vercel with the production Supabase credentials
4. Run migrations on your production database:
   ```bash
   supabase db push --db-url your_production_db_url
   ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
