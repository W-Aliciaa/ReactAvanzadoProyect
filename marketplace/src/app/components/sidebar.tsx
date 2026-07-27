import ClientShell from "./client-shell";
import UserProfile from "./user-profile";

export default function Sidebar() {
  return (
    <ClientShell>
      <UserProfile />
    </ClientShell>
  );
}
