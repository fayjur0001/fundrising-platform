// server/src/modules/auth/google.strategy.ts
//
// Passport Google OAuth 2.0 strategy।
// এই file-এ শুধু strategy register করা হয়।
// index.ts-এ `import './modules/auth/google.strategy'` দিয়ে load করতে হবে।

import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { prisma } from '@/config/database'
import { env } from '@/config/env'

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${env.SERVER_URL}/api/v1/auth/google/callback`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value

        if (!email) {
          return done(new Error('No email from Google'), undefined)
        }

        // Upsert: আগে থেকে থাকলে update করো, না থাকলে create করো
        const user = await prisma.user.upsert({
          where: { email },
          update: {
            // Avatar আপডেট করো (Google ছবি নতুন হতে পারে)
            avatar: profile.photos?.[0]?.value ?? undefined,
            // Email verified Google-এর মাধ্যমে
            isVerified: true,
          },
          create: {
            email,
            name: profile.displayName || email.split('@')[0],
            password: '', // OAuth user-এর password দরকার নেই
            role: 'DONOR', // default role
            isVerified: true, // Google verify করেছে
            avatar: profile.photos?.[0]?.value ?? null,
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

// Passport serialize/deserialize — stateless JWT flow-এ এটা শুধু ফর্মালিটি
passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user as Express.User))
