"use client";

import { useActionState } from "react";
import { login, signup } from "./actions";

export default function LoginForm() {
  const [loginState, loginAction, loginPending] = useActionState(login, {});
  const [signupState, signupAction, signupPending] = useActionState(signup, {});
  const pending = loginPending || signupPending;
  const error = loginState.error || signupState.error;

  return (
    <form className="stack">
      <label>
        Email
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label>
        Password
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          minLength={6}
          required
        />
      </label>

      {error && <p role="alert" className="error">{error}</p>}
      {signupState.message && <p role="status">{signupState.message}</p>}

      <div className="row">
        <button formAction={loginAction} disabled={pending}>
          Log in
        </button>
        <button formAction={signupAction} disabled={pending} className="secondary">
          Sign up
        </button>
      </div>
    </form>
  );
}
