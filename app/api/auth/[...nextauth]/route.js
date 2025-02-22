import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { connectToDB } from "@utils/database";
import User from "@models/user";
// Ensure that environment variables are set
if (!process.env.GOOGLE_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error("Missing Google credentials in environment variables");
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async session({ session }) {
      // You can add custom session logic here, e.g., add user data to the session
      // For now, this just returns the default session object.

      const sessionUser = await User.findOne({
        email: session.user.email,
      });

      session.user.id = sessionUser._id.toString();
      return session;
    },
    async signIn({ profile }) {
      try {
        await connectToDB();
        // check if a user already exits
        const userExits = await User.findOne({
          email: profile.email,
        });
        //if not, create a new user

        if (!userExits) {
          await User.create({
            email: profile.email,
            username: profile.name.replace(" ", "").toLowerCase(),
            image: profile.picture,
          });
        }
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
