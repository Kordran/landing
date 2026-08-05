import { logos } from "@/lib/logos";

type LogoProps = {
  variant?: "full" | "name" | "icon";
  className?: string;
  priority?: boolean;
};

const sources = {
  full: { src: logos.fullColorLight, width: 807, height: 187 },
  name: { src: logos.nameLight, width: 620, height: 187 },
  icon: { src: logos.iconColor, width: 187, height: 187 },
} as const;

export default function Logo({
  variant = "full",
  className = "",
  priority = false,
}: LogoProps) {
  const { src, width, height } = sources[variant];

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
