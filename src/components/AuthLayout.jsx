import { Link } from "react-router-dom";

export default function AuthLayout({ title, subtitle, ctaHref, ctaText, children }) {
  return (
     <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Subtle grid background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:20px_20px]"
       />
    
      {/* Glow accents */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="w-full max-w-md space-y-8 px-4"> 
        <div className="text-center">
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-sm text-[var(--muted)]">
              {subtitle}{" "}
              {ctaHref && ctaText && (
                <Link to={ctaHref} className="mono-link">
                  {ctaText}
                </Link>
              )}
            </p>
          )}
        </div>

        <div className="mono-card p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
