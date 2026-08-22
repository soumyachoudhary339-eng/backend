import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import passport from "passport"
import dotenv from "dotenv";
dotenv.config();
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL
        },
        async (_, __, profile, done) => {
            return done(null, profile);
        }
    )

)

export default passport;
