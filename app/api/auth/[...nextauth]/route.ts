import NextAuth from "next-auth";

export const authOptions = {
  // configure providers here
  providers: [],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
