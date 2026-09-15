import Icon from "./Icon";

interface ProductImageProps {
  hue: number;
  icon: string;
  seed?: number;
  size?: number | string;
  rounded?: number;
}

export default function ProductImage({ hue, icon, seed = 0, size = "100%", rounded = 10 }: ProductImageProps) {
  const tilt = ((seed * 37) % 7) - 3;
  const bgA = `hsl(${hue}, 46%, 91%)`;
  const bgB = `hsl(${hue}, 40%, 80%)`;
  const ring = `hsl(${hue}, 38%, 68%)`;
  const fg = `hsl(${hue}, 32%, 30%)`;

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      role="img"
      aria-label="Product image placeholder"
      style={{ borderRadius: rounded, background: bgA }}
    >
      <defs>
        <linearGradient id={`grad-${hue}-${icon}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={bgA} />
          <stop offset="1" stopColor={bgB} />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill={`url(#grad-${hue}-${icon})`} />
      <g opacity="0.5" stroke={ring} strokeWidth="1">
        <line x1="0" y1="150" x2="200" y2="150" />
        <line x1="0" y1="164" x2="200" y2="164" />
      </g>
      <g transform={`translate(100 92) rotate(${tilt})`}>
        <circle r="46" fill="none" stroke={ring} strokeWidth="1.5" opacity="0.55" />
        <circle r="34" fill="#fff" opacity="0.55" />
        <g transform="translate(-16 -16)" color={fg}>
          <Icon name={icon} size={32} strokeWidth={1.5} />
        </g>
      </g>
    </svg>
  );
}
