import { LoadingState } from "@/components/LoadingState";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/router";

export default function Home() {
  const { accessToken, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return <LoadingState />;
  }

  if (!accessToken) {
    router.push('/');
    return <></>;
  }

  // Sidebar
  // Main content
  return (
    <div>
      <h1>Welcome Home!</h1>
    </div>
  );
}
