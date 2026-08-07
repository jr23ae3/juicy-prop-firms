import { signOutAction } from "@/actions/auth";

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className="arcade-btn arcade-btn--p2 min-w-0 px-3 text-[8px] sm:text-[9px]"
      >
        QUIT
      </button>
    </form>
  );
}
