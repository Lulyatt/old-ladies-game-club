import LoginForm from "@/components/login-form";

export const metadata = {
  title: "Login | The Old Ladies Game Club",
  description: "Sign in or create an account.",
};

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-md flex-1 snap-none px-6 py-16">
      <h1 className="text-3xl font-bold">Login</h1>
      <p className="mt-2 text-muted-foreground">
        Sign in or create an account to join the club.
      </p>
      <LoginForm />
    </main>
  );
}