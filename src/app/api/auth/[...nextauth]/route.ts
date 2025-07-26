// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { compare } from "bcryptjs";
// import clientPromise from "@/lib/mongodb";
// import { JWT } from "next-auth/jwt";

// // Extend the built-in session types
// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string;
//       name?: string | null;
//       email?: string | null;
//       image?: string | null;
//     };
//   }

//   interface User {
//     id: string;
//     name?: string | null;
//     email?: string | null;
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     id: string;
//   }
// }

// const handler = NextAuth({
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" }
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           return null;
//         }

//         const client = await clientPromise;
//         const db = client.db();
//         const user = await db.collection("users").findOne({
//           email: credentials.email
//         });

//         if (!user || !user.password) {
//           return null;
//         }

//         const isPasswordValid = await compare(
//           credentials.password,
//           user.password
//         );

//         if (!isPasswordValid) {
//           return null;
//         }

//         return {
//           id: user._id.toString(),
//           email: user.email,
//           name: user.name
//         };
//       }
//     })
//   ],
//   session: {
//     strategy: "jwt"
//   },
//   pages: {
//     signIn: "/login"
//   },
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.id;
//       }
//       return session;
//     }
//   },
//   // Add a secret for JWT encryption
//   secret: "your-secret-key-here-change-in-production"
// });

// export { handler as GET, handler as POST };
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Export the NextAuth handler using the centralized auth options
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
