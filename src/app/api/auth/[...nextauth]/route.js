import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import ExecuteQuery from "../../../db/newPosgres"; // Adjust the import based on your structure

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "your username",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const query = `
          SELECT * FROM "bb_users" WHERE USER_NAME = $1 AND "PASSWORD" = $2
        `;
        const params = [credentials.username, credentials.password]; // Array of parameters

        try {
          const results = await ExecuteQuery(query, params);
          const user = results[0]; // PostgreSQL returns rows as an array

          if (user) {
            return {
              id: user.user_id,
              name: user.display_name,
              email: user.email,
            };
          }
          return null; // Return null if no matching user is found
        } catch (error) {
          console.error("Authorization error:", error);
          throw new Error("Error validating user");
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/user/login", // Custom sign-in page
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },
};

// Export the NextAuth handler as a default export
const handler = NextAuth(authOptions);

// Export the handler for GET and POST requests
export { handler as GET, handler as POST };
