import Link from "next/link";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const styles = {
    primary:
      "bg-du-purple text-white hover:bg-du-purple-deep disabled:bg-du-muted",
    secondary:
      "border border-du-purple text-du-purple bg-du-paper hover:bg-du-purple-soft disabled:opacity-50",
    ghost: "text-du-purple hover:underline disabled:opacity-50",
  }[variant];

  return (
    <button
      className={`inline-flex h-11 items-center justify-center px-5 text-sm font-semibold tracking-wide rounded-sm ${styles} ${className}`}
      {...props}
    />
  );
}

export function TextLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="text-du-purple font-semibold underline-offset-2 hover:underline">
      {children}
    </Link>
  );
}

export function Field({
  label,
  hint,
  error,
  badge,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  badge?: "filled" | "required";
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="flex flex-wrap items-center gap-2 text-sm font-medium text-du-ink">
        {label}
        {badge === "filled" ? (
          <span className="text-[10px] font-semibold uppercase tracking-wider text-du-gold-deep">
            Auto-filled
          </span>
        ) : null}
        {badge === "required" ? (
          <span className="text-[10px] font-semibold uppercase tracking-wider text-du-red">
            Fill in
          </span>
        ) : null}
      </span>
      {children}
      {hint && !error ? <span className="block text-xs text-du-muted">{hint}</span> : null}
      {error ? <span className="block text-xs text-du-red">{error}</span> : null}
    </label>
  );
}

const inputClass =
  "h-11 w-full border border-du-line bg-du-paper px-3 text-sm text-du-ink rounded-sm placeholder:text-du-muted/70 read-only:bg-[#f4f6f8]";

export function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${inputClass} ${className}`} {...props} />;
}

export function Select({ className = "", ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={`${inputClass} ${className}`} {...props} />;
}

export function Textarea({ className = "", ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${inputClass} h-24 py-2 ${className}`} {...props} />;
}

export function Alert({
  tone = "info",
  title,
  children,
}: {
  tone?: "info" | "warning" | "danger" | "success";
  title?: string;
  children: React.ReactNode;
}) {
  const border = {
    info: "border-du-purple",
    warning: "border-du-gold-deep",
    danger: "border-du-red",
    success: "border-du-gold-deep",
  }[tone];

  return (
    <div className={`border-l-4 ${border} bg-du-paper px-4 py-3 text-sm text-du-ink`}>
      {title ? <p className="font-semibold mb-1">{title}</p> : null}
      <div className="text-du-muted">{children}</div>
    </div>
  );
}

export function PageIntro({
  kicker,
  title,
  description,
}: {
  kicker?: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="mb-6 space-y-2">
      {kicker ? (
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-du-gold-deep">
          {kicker}
        </p>
      ) : null}
      <h1 className="text-2xl text-du-purple-deep sm:text-3xl">{title}</h1>
      {description ? <p className="text-sm leading-6 text-du-muted max-w-prose">{description}</p> : null}
    </header>
  );
}
