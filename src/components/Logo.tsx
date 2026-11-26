type LogoProps = {
  className?: string;
  priority?: boolean;
};

/** Full Kordran mark for light surfaces (footer only on the landing page). */
export default function Logo({ className = "", priority = false }: LogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logos/Full_Color_Light.svg"
      alt="Kordran"
      width={807}
      height={187}
      className={className}
      decoding="async"
      loading={priority ? "eager" : "lazy"}
    />
  );
}
