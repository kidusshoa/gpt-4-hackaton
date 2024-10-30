// pages/login.tsx
import { signIn, signOut, useSession } from "next-auth/react";

const LoginPage = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <div>
        <p>Welcome, {session.user?.name}</p>
        <button onClick={() => signOut()}>Sign Out</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Login</h2>
      <button onClick={() => signIn()}>Sign In</button>
    </div>
  );
};

export default LoginPage;
