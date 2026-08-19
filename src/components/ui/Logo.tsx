import Image from "next/image";

type LogoProps = {
  inverted?: boolean;
  className?: string;
};

export function Logo({ inverted = false, className }: LogoProps) {
  return (
    <Image
      src="/kerur-dan-logo.png"
      alt="קירור דן - פתרונות קירור והקפאה"
      width={560}
      height={280}
      priority
      className={className}
      style={{
        width: "auto",
        filter: inverted ? "brightness(0) invert(1)" : undefined,
      }}
    />
  );
}
