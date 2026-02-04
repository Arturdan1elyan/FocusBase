
export const dynamic = "force-dynamic";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <LoginForm />
    </main>
  );
}