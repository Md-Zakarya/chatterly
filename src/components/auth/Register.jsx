import { Controller } from "react-hook-form";
import { useRegisterViewModel } from "../../hooks/useRegisterViewModel";
import AuthLayout from "../AuthLayout";

export default function Register() {
  const { handleSubmit, control, errors, onSubmit, isLoading } = useRegisterViewModel();

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Or"
      ctaHref="/login"
      ctaText="sign in to your existing account"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-5">
          <div>
            <label htmlFor="username" className="mono-label">
              Username
            </label>
            <Controller
              name="username"
              control={control}
              defaultValue=""
              rules={{
                required: "Username is required",
                minLength: { value: 3, message: "Username must be at least 3 characters" },
                maxLength: { value: 30, message: "Username must be less than 30 characters" }
              }}
              render={({ field }) => (
                <input
                  {...field}
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  className="mono-input font-mono"
                />
              )}
            />
            {errors.username && (
              <p className="error-text">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="mono-label">
              Email
            </label>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              }}
              render={({ field }) => (
                <input
                  {...field}
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="mono-input font-mono"
                />
              )}
            />
            {errors.email && (
              <p className="error-text">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="displayName" className="mono-label">
              Display Name (Optional)
            </label>
            <Controller
              name="displayName"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <input
                  {...field}
                  id="displayName"
                  type="text"
                  placeholder="Your display name"
                  className="mono-input font-mono"
                />
              )}
            />
          </div>

          <div>
            <label htmlFor="password" className="mono-label">
              Password
            </label>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" }
              }}
              render={({ field }) => (
                <input
                  {...field}
                  id="password"
                  type="password"
                  placeholder="Choose a password"
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

        <button
          type="submit"
          disabled={isLoading}
          className="mono-btn w-full"
        >
          {isLoading ? "Creating account..." : "Create account"}
        </button>
      </form>
    </AuthLayout>
  );
}