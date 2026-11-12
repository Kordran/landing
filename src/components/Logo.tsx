import { logos } from "@/lib/logos";

type LogoProps = {
  variant?: "full" | "name" | "icon";
  /** Page surface behind the mark. Dark uses the light-ink logo. */
  surface?: "light" | "dark";
  className?: string;
  priority?: boolean;
};

const sources = {
  full: {
    light: { src: logos.fullColorLight, width: 807, height: 187 },
    dark: { src: logos.fullColorDark, width: 807, height: 187 },
  },
  name: {
    light: { src: logos.nameLight, width: 620, height: 187 },
    dark: { src: logos.nameLight, width: 620, height: 187 },
  },
  icon: {
    light: { src: logos.iconColor, width: 187, height: 187 },
    dark: { src: logos.iconColor, width: 187, height: 187 },
  },
} as const;

export default function Logo({
  variant = "full",
  surface = "light",
  className = "",
  priority = false,
}: LogoProps) {
  const { src, width, height } = sources[variant][surface];

  return (
    <img
      src={src}
      alt="Kordran"
      width={width}
      height={height}
      className={className}
      decoding="async"
      {...(priority
        ? { fetchPriority: "high" as const }
        : { loading: "lazy" as const })}
    />
  );
}
