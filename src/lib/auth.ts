import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// Helper function to safely access the database with error handling
async function getMongoDb() {
  try {
    const client = await clientPromise;
    return client.db();
  } catch (error) {
    console.error("Failed to connect to MongoDB in auth.ts:", error);
    throw new Error("Database connection failed. Please check your MongoDB Atlas settings.");
  }
}

// Export the NextAuth options to be reused across the app
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required");
          }

          const db = await getMongoDb();
          const user = await db
            .collection("users")
            .findOne({ email: credentials.email });

          if (!user) throw new Error("User not found");

          const isValid = await compare(credentials.password, user.password);
          if (!isValid) throw new Error("Invalid password");
          
          // Include the role in the returned user object
          return { 
            id: user._id.toString(), 
            email: user.email, 
            name: user.name,
            role: user.role || "user" // Make sure to include the role
          };
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown authentication error';
          console.error("Authentication error:", errorMessage);
          throw error;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        console.log("SignIn callback - user:", user.email);
        console.log("SignIn callback - provider:", account?.provider);
        
        const db = await getMongoDb();
        const users = db.collection("users");
        
        // For OAuth accounts (like Google)
        if (account && account.provider !== "credentials") {
          // Check if a user with this email already exists
          const existingUser = await users.findOne({ email: user.email });
          
          if (existingUser) {
            console.log("Found existing user:", existingUser._id.toString());
            
            // If user exists but doesn't have OAuth provider linked
            if (!existingUser.oauthProviders || !existingUser.oauthProviders.includes(account.provider)) {
              console.log("Linking OAuth provider to existing account");
              
              // Link this OAuth provider to the existing account
              await users.updateOne(
                { _id: existingUser._id },
                { 
                  $set: { 
                    // Update profile data with latest from OAuth
                    name: user.name || existingUser.name,
                    image: user.image || existingUser.image,
                    updatedAt: new Date(),
                  },
                  $addToSet: { 
                    oauthProviders: account.provider,
                    // Store OAuth account details for reference
                    linkedAccounts: {
                      provider: account.provider,
                      providerAccountId: account.providerAccountId,
                      linkedAt: new Date()
                    }
                  }
                }
              );
            }
            
            // Use the existing user's ID for the session
            user.id = existingUser._id.toString();
            user.role = existingUser.role || "user";
            return true;
          } else {
            console.log("Creating new user from OAuth");
            
            // Create a new user record for this OAuth login
            const result = await users.insertOne({
              name: user.name,
              email: user.email,
              image: user.image,
              role: "user", // Default role
              createdAt: new Date(),
              oauthProviders: [account.provider],
              linkedAccounts: [{
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                linkedAt: new Date()
              }]
            });
            
            // Set the user ID to the newly created record
            user.id = result.insertedId.toString();
            user.role = "user";
          }
        }
        
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false; // Reject sign in on database error
      }
    },
    
    async jwt({ token, user, account, trigger }) {
      try {
        // Initial sign in
        if (trigger === "signIn" || trigger === "signUp") {
          if (user) {
            console.log("JWT callback - setting user data in token");
            token.id = user.id;
            token.role = user.role || "user";
            
            // If this is an OAuth sign-in, we might need to update the token
            if (account && account.provider !== "credentials") {
              try {
                const db = await getMongoDb();
                
                // Get the most up-to-date user data
                const dbUser = await db.collection("users").findOne({ 
                  _id: new ObjectId(user.id) 
                });
                
                if (dbUser) {
                  // Update token with latest user data
                  token.name = dbUser.name;
                  token.email = dbUser.email;
                  token.picture = dbUser.image;
                  token.role = dbUser.role || "user";
                }
              } catch (error) {
                console.error("Error in jwt callback:", error);
                // Continue with existing token data
              }
            }
          }
        }
        return token;
      } catch (error) {
        console.error("Error in jwt callback:", error);
        return token;
      }
    },
    
    async session({ session, token }) {
      try {
        if (session.user && token) {
          session.user.id = token.id as string;
          session.user.role = token.role as string;
          
          // Optionally, update session with the latest user data from the database
          try {
            const db = await getMongoDb();
            
            const user = await db.collection("users").findOne({ 
              _id: new ObjectId(token.id as string) 
            });
            
            if (user) {
              session.user.name = user.name;
              session.user.email = user.email;
              session.user.image = user.image;
              session.user.role = user.role || "user";
            }
          } catch (error) {
            console.error("Error in session callback:", error);
            // Continue with existing session data
          }
        }
        return session;
      } catch (error) {
        console.error("Error in session callback:", error);
        return session;
      }
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      
      // Always redirect to dashboard after sign in
      if (url.includes('/api/auth/callback/')) {
        return `${baseUrl}/dashboard`;
      }
      
      return baseUrl;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login?error=database", // Redirect to login page with error on database issues
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // Refresh session every 24 hours
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production"
      }
    }
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
}; 