/**
 * Shared motion primitives (Framer Motion, loaded via LazyMotion in App.jsx).
 * Every effect respects the visitor's "reduce motion" setting through
 * <MotionConfig reducedMotion="user"> plus explicit checks for parallax/marquee.
 */
import { Children, createElement, useRef } from 'react';
import { m, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';

export const EASE = [0.22, 1, 0.36, 1];
const VIEW = { once: true, margin: '0px 0px -12% 0px' };

/** Fade + rise when scrolled into view. */
export function Reveal({ as = 'div', delay = 0, y = 26, className = '', children, ...rest }) {
  return createElement(
    m[as] || m.div,
    {
      initial: { opacity: 0, y },
      whileInView: { opacity: 1, y: 0 },
      viewport: VIEW,
      transition: { duration: 0.9, ease: EASE, delay },
      className,
      ...rest,
    },
    children,
  );
}

/** Children enter one after another. Wrap each child in <StaggerItem>. */
export function Stagger({ as = 'div', className = '', gap = 0.08, delay = 0, children, ...rest }) {
  return createElement(
    m[as] || m.div,
    {
      initial: 'hidden',
      whileInView: 'show',
      viewport: VIEW,
      variants: { hidden: {}, show: { transition: { staggerChildren: gap, delayChildren: delay } } },
      className,
      ...rest,
    },
    children,
  );
}

export function StaggerItem({ as = 'div', className = '', children, ...rest }) {
  return createElement(
    m[as] || m.div,
    {
      variants: {
        hidden: { opacity: 0, y: 22 },
        show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
      },
      className,
      ...rest,
    },
    children,
  );
}

/**
 * Heading whose words slide up from a mask, one after another.
 * Wrap words in *asterisks* to render them as the accent.
 */
export function SplitHeading({ as = 'h2', text, className = '', delay = 0, id, onLoad = false }) {
  const tokens = [];
  let accent = false;
  for (const raw of text.split(' ')) {
    let w = raw;
    const opens = w.startsWith('*');
    if (opens) w = w.slice(1);
    const closes = w.endsWith('*') || w.endsWith('*.') || w.endsWith('*,');
    if (closes) w = w.replace(/\*([.,]?)$/, '$1');
    if (opens) accent = true;
    tokens.push({ w, accent });
    if (closes) accent = false;
  }
  const plain = tokens.map((t) => t.w).join(' ');
  const trigger = onLoad ? { animate: { y: '0%' } } : { whileInView: { y: '0%' }, viewport: VIEW };

  return createElement(
    as,
    { id, className, 'aria-label': plain },
    tokens.map((t, i) => (
      <span key={i} aria-hidden="true" className="inline-block overflow-hidden pt-[0.06em] -mt-[0.06em] pb-[0.32em] -mb-[0.32em] align-bottom">
        <m.span
          className={`inline-block ${t.accent ? 'accent-italic' : ''}`}
          initial={{ y: '105%' }}
          {...trigger}
          transition={{ duration: 1, ease: EASE, delay: delay + i * 0.045 }}
        >
          {t.w}
          {i < tokens.length - 1 ? ' ' : ''}
        </m.span>
      </span>
    )),
  );
}

/** Image unveiled with a clipping wipe, then gently parallaxed while scrolling. */
export function ImageReveal({
  src,
  srcSet,
  sizes,
  alt,
  width,
  height,
  className = '',
  imgClassName = '',
  parallax = 7,
  priority = false,
  from = 'bottom',
}) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  // Trigger from the outer frame (stable box), not the clipped inner layer.
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${parallax}%`, `${parallax}%`]);
  const hidden = from === 'left' ? 'inset(0% 100% 0% 0%)' : 'inset(100% 0% 0% 0%)';
  const shown = priority || inView;

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <m.div
        className="absolute inset-0"
        initial={{ clipPath: hidden }}
        animate={shown ? { clipPath: 'inset(0% 0% 0% 0%)' } : undefined}
        transition={{ duration: 1.2, ease: EASE, delay: priority ? 0.2 : 0 }}
      >
        <m.img
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          {...(priority ? { fetchpriority: 'high' } : {})}
          style={{ y: reduce || !parallax ? 0 : y, scale: parallax && !reduce ? 1 + (parallax * 2.4) / 100 : 1 }}
          className={`h-full w-full object-cover ${imgClassName}`}
        />
      </m.div>
    </div>
  );
}

/** A hairline that draws itself from left to right (or top to bottom). */
export function DrawLine({ className = '', vertical = false, delay = 0 }) {
  return (
    <m.span
      aria-hidden="true"
      className={`block bg-current ${vertical ? 'origin-top' : 'origin-left'} ${className}`}
      initial={vertical ? { scaleY: 0 } : { scaleX: 0 }}
      whileInView={vertical ? { scaleY: 1 } : { scaleX: 1 }}
      viewport={VIEW}
      transition={{ duration: 1.4, ease: EASE, delay }}
    />
  );
}

/** Slow, continuous text band. Static when reduced motion is requested. */
export function Marquee({ items, className = '' }) {
  const reduce = useReducedMotion();
  const row = (
    <div className="flex shrink-0 items-center">
      {Children.toArray(
        items.map((it) => (
          <span className="flex items-center whitespace-nowrap">
            <span className="px-6 sm:px-10">{it}</span>
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ember" />
          </span>
        )),
      )}
    </div>
  );
  return (
    <div className={`overflow-hidden ${className}`} aria-label={items.join(', ')} role="marquee">
      <m.div
        aria-hidden="true"
        className="flex w-max"
        animate={reduce ? undefined : { x: ['0%', '-50%'] }}
        transition={{ duration: 48, ease: 'linear', repeat: Infinity }}
      >
        {row}
        {row}
      </m.div>
    </div>
  );
}

/** Text whose words brighten progressively as the block scrolls through the viewport. */
export function ScrollWords({ text, className = '' }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 45%'] });
  const words = text.split(' ');
  return (
    <p ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} reduce={reduce}>
          {w}
        </Word>
      ))}
    </p>
  );
}

function Word({ children, progress, range, reduce }) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <m.span aria-hidden="true" style={{ opacity: reduce ? 1 : opacity }} className="inline-block whitespace-pre">
      {children}{' '}
    </m.span>
  );
}
