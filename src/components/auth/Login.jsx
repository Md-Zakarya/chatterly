import { Controller } from "react-hook-form";
import { useLoginViewModel } from "../../hooks/useLoginViewModel";
import AuthLayout from "../AuthLayout";

export default function Login() {
  const { handleSubmit, control, errors, onSubmit, isLoading, successMessage } = useLoginViewModel();

  return (
    <AuthLayout
      title="Sign in to your account"
      subtitle="Or"
      ctaHref="/register"
      ctaText="create a new account"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {successMessage && (
          <div className="rounded-md border border-green-500/30 bg-green-950/30 p-4">
            <p className="text-sm text-green-300">{successMessage}</p>
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label htmlFor="username" className="mono-label">
              Username or Email
            </label>
            <Controller
              name="username"
              control={control}
              defaultValue=""
              rules={{ required: "Username or email is required" }}
              render={({ field }) => (
                <input
                  {...field}
                  id="username"
                  type="text"
                  placeholder="Enter your username or email"
                  className="mono-input font-mono"
                />
              )}
            />
            {errors.username && (
              <p className="error-text">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="mono-label">
              Password
            </label>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{ required: "Password is required" }}
              render={({ field }) => (
                <input
                  {...field}
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="mono-input font-mono"
                />
              )}
            />
            {errors.password && (
              <p className="error-text">{errors.password.message}</p>
            )}
          </div>
        </div>

        {errors.root && (
          <div className="rounded-md border border-red-500/30 bg-red-950/30 p-4">
            <p className="text-sm text-red-300">{errors.root.message}</p>
          </div>
        )}

        <button type="submit" disabled={isLoading} className="mono-btn w-full">
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </AuthLayout>
  );
}