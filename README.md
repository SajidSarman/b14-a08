# StudioSpace - B14-A08 - Frontend

StudioSpace is a marketplace for finding and booking creative studios, while
helping hosts showcase and manage their spaces.
Explore spaces for photography, music, podcasts, and other creative projects.

## Live Link
https://studiospace-b14-a08-s-sarman.vercel.app/

## Backend Repository
https://github.com/SajidSarman/b14-a08-server

## Tech Stack

**FrontEnd:** Next.js (App Router), React, TypeScript, Tailwind CSS, Base UI

**Authentication & Authorization:** Better Auth, MongoDB adapter, JWT

**BackEnd:** Express.js, MongoDB, JavaScript

## Key Features

- Browse studio listings by category and view studio details
- Create, update, and delete your own studio listings
- Add studio photos to listings
- Request bookings and view your bookings
- Manage booking requests and update their status as a host
- Sign in with email and password, or Google when configured

## Authentication Setup

Add the required environment variables to `.env.local` in the project root:

```env
MONGODB_URI=your-mongodb-connection-string
BETTER_AUTH_SECRET=replace-with-a-long-random-secret
BETTER_AUTH_URL=http://localhost:3000
IMGBB_API_KEY=your-imgbb-api-key
```

`MONGODB_URI` is used by Better Auth. Configure the backend's MongoDB
connection separately in the backend environment.

Studio images are uploaded from the Next.js app to ImgBB using
`IMGBB_API_KEY`; the key stays on the server and must not use a `NEXT_PUBLIC_`
prefix. To keep uploaded images with a listing, the backend's studio create and
update handlers must accept and save the `imageUrl` field in MongoDB. MongoDB
stores the ImgBB URL, not the image file. Set `IMGBB_API_KEY` in your deployment
environment as well as locally.

Google sign-in is optional. To enable it, add the OAuth client credentials:

```env
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
```
