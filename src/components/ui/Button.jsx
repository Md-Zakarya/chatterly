function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}

/**
 * Reusable Button
 * - Respects your theme via Tailwind and existing .mono-btn
 * - Variants: primary | secondary | ghost
 * - Can render as Link via `as={Link}` and `to="/path"`
 */
const Button = ({
  as,
  children,
  className,
  variant = 'primary',
  type = 'button',
  ...rest
}) => {
  const Component = as || 'button';

  const base =
    variant === 'primary'
      ? 'mono-btn'
      : 'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-white/30 disabled:cursor-not-allowed';

  const styles = {
    primary: 'mono-btn',
    secondary:
      'border border-[var(--border)] bg-transparent text-[var(--fg)] hover:bg-white/10',
    ghost:
      'bg-transparent text-[var(--fg)] hover:bg-white/10',
  };

  const computed = cx(base, styles[variant], className);

  return (
    <Component className={computed} type={Component === 'button' ? type : undefined} {...rest}>
      {children}
    </Component>
  );
};

export default Button;