const VARIANTS = {
  primary: 'bg-forest text-white hover:bg-forest-deep',
  accent: 'bg-ember text-forest-deep hover:bg-ember-hover',
  outline: 'border border-forest/30 bg-transparent text-forest hover:border-forest hover:bg-forest/5',
  light: 'bg-white text-forest-deep hover:bg-ivory',
  outlineLight: 'border border-white/35 text-white hover:border-white/70 hover:bg-white/5',
};

const SIZES = {
  sm: 'min-h-10 px-4 text-sm',
  md: 'min-h-12 px-5 text-[0.95rem]',
  lg: 'min-h-[3.25rem] px-6 text-[0.98rem]',
};

export function Button({ as = 'button', variant = 'primary', size = 'md', className = '', children, ...props }) {
  const Tag = as;
  const extra = Tag === 'button' && !props.type ? { type: 'button' } : {};
  return (
    <Tag
      className={`inline-flex items-center justify-center gap-2 rounded-md font-heading font-semibold tracking-[0.005em] transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-70 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...extra}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function SectionIntro({ kicker, title, lede, light = false, className = '', id }) {
  return (
    <div className={`max-w-2xl ${className}`}>
      {kicker && <p className={`kicker ${light ? 'kicker-light' : ''}`}>{kicker}</p>}
      <h2 id={id} className={`h-section mt-4 ${light ? '!text-white' : ''}`}>
        {title}
      </h2>
      {lede && <p className={`lede mt-4 ${light ? '!text-white/75' : ''}`}>{lede}</p>}
    </div>
  );
}

export function WhatsAppIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M3.6 20.4l1.25-4.15A8.4 8.4 0 1 1 7.9 19.3L3.6 20.4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path
        d="M9.1 8.2c.2-.45.45-.5.75-.5h.5c.2 0 .4.08.5.38l.62 1.5c.08.22.03.45-.1.6l-.5.6c-.1.13-.12.3-.02.47.6 1 1.42 1.8 2.42 2.4.17.1.34.08.47-.02l.6-.5c.15-.13.38-.18.6-.1l1.5.62c.3.1.38.3.38.5v.5c0 .3-.05.55-.5.75-.6.3-1.6.45-2.9-.1-1.6-.75-3-2.1-3.85-3.7-.6-1.2-.45-2.2-.12-2.9z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Small "needs clinic review" note, visible only in development builds. */
export function DevNote({ children }) {
  if (!import.meta.env.DEV) return null;
  return <p className="mt-3 rounded border border-dashed border-ember-ink/50 bg-ember/10 px-3 py-2 text-xs text-ember-ink">Dev note: {children}</p>;
}
