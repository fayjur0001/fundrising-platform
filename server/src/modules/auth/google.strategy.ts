// server/src/modules/auth/google.strategy.ts
//
// Passport Google OAuth 2.0 strategy।
// এই file-এ শুধু strategy register করা হয়।
// index.ts-এ `import './modules/auth/google.strategy'` দিয়ে load করতে হবে।

import passport from 'passport'
import { prisma } from '@/config/database'
import { env } from '@/config/env'

// GOOGLE_CLIENT_ID না থাকলে strategy register করা হবে না।
// তাহলে /auth/google route 500 এর বদলে সঠিক error দেবে।
if (!env.GOOGLE_CLIENT_ID) {
  console.warn('⚠️  Google OAuth not configured — GOOGLE_CLIENT_ID is missing. Google login disabled.')
} else {
  // Dynamic import to avoid crashing when credentials are missing
  const { Strategy: GoogleStrategy } = require('passport-google-oauth20')

  passport.use(
    new GoogleStrategy(
      {
        clientID:     env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL:  `${env.SERVER_URL}/api/v1/auth/google/callback`,
      },
      async (_accessToken: string, _refreshToken: string, profile: any, done: Function) => {
        try {
          const email = profile.emails?.[0]?.value

          if (!email) {
            return done(new Error('No email from Google'), undefined)
          }

          // Upsert: আগে থেকে থাকলে update করো, না থাকলে create করো
          const user = await prisma.user.upsert({
            where: { email },
            update: {
              avatar: profile.photos?.[0]?.value ?? undefined,
              isVerified: true,
            },
            create: {
              email,
              name:       profile.displayName || email.split('@')[0],
              password:   '', // OAuth user-এর password দরকার নেই
              role:       'DONOR',
              isVerified: true,
              avatar:     profile.photos?.[0]?.value ?? null,
            },
          })

          if (user.isBanned) {
            return done(new Error('Account suspended'), undefined)
          }

          return done(null, { id: user.id, email: user.email, role: user.role })
        } catch (err) {
          return done(err as Error, undefined)
        }
      }
    )
  )
}

// Passport serialize/deserialize — stateless JWT flow-এ এটা শুধু ফর্মালিটি
passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user as Express.User))