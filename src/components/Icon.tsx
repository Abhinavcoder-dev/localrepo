interface IconProps {
  name: string;
  size?: number;
  className?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}

const paths: Record<string, string> = {
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-4.3-4.3",
  cart: "M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 8H6M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM18 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
  "chevron-down": "M6 9l6 6 6-6",
  "chevron-left": "M15 18l-6-6 6-6",
  "chevron-right": "M9 6l6 6-6 6",
  trash: "M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  check: "M5 12.5l4.5 4.5L19 7",
  truck: "M2 6h11v9H2zM13 10h4l4 3v2h-8zM6 19a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2zM17.5 19a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2z",
  shield: "M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z",
  "arrow-right": "M4 12h16M14 6l6 6-6 6",
  x: "M6 6l12 12M18 6L6 18",
  menu: "M4 7h16M4 12h16M4 17h16",
  star: "M12 3.5l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17.3 6.6 20.4l1-6.1-4.4-4.3 6.1-.9z",
  headphones: "M4 13a8 8 0 0 1 16 0v5a2 2 0 0 1-2 2h-1v-6h3M4 18v-5h3v6H6a2 2 0 0 1-2-2z",
  kettle: "M6 10h9a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3H8a4 4 0 0 1-4-4v-3zM8 10V6a2 2 0 0 1 2-2h1M18 12h2",
  book: "M4 5.5A2.5 2.5 0 0 1 6.5 3H12v17H6.5A2.5 2.5 0 0 1 4 17.5zM12 3h5.5A2.5 2.5 0 0 1 20 5.5v12a2.5 2.5 0 0 1-2.5 2.5H12",
  droplet: "M12 3s6 6.5 6 11a6 6 0 1 1-12 0c0-4.5 6-11 6-11z",
  block: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  dumbbell: "M6 8v8M4 10v4M20 10v4M18 8v8M8 12h8",
  basket: "M4 9h16l-1.5 9a2 2 0 0 1-2 1.7H7.5a2 2 0 0 1-2-1.7zM8 9l1-5h6l1 5M9 12v4M12 12v4M15 12v4",
  hanger: "M12 3a2 2 0 1 0-2 2M12 5l9 7H3zM3 19h18",
  pencil: "M4 20l1-4.5L15.5 5 19 8.5 8.5 19zM13.5 6.5l3.5 3.5",
  paw: "M8 7a1.6 2 0 1 0 0-4 1.6 2 0 0 0 0 4zM16 7a1.6 2 0 1 0 0-4 1.6 2 0 0 0 0 4zM4.5 11a1.6 2 0 1 0 0-4 1.6 2 0 0 0 0 4zM19.5 11a1.6 2 0 1 0 0-4 1.6 2 0 0 0 0 4zM12 20c-3 0-5.5-1.7-5.5-4.5S9 12 12 12s5.5 1 5.5 3.5S15 20 12 20z",
  wrench: "M14.7 6.3a4 4 0 1 0-5.6 5.6L4 17l3 3 5.1-5.1a4 4 0 0 0 5.6-5.6l-2.5 2.5-2-2z",
  car: "M4 16V11l2-4h12l2 4v5M4 16h16M4 16a1.6 1.6 0 1 0 3.2 0M16.8 16a1.6 1.6 0 1 0 3.2 0M7 11h10",
  box: "M4 8l8-4 8 4-8 4-8-4zM4 8v8l8 4M20 8v8l-8 4M12 12v8",
  package: "M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8",
};

export default function Icon({ name, size = 20, className, strokeWidth = 1.7, style }: IconProps) {
  const d = paths[name] ?? paths.box;
  return (
    <svg
      className={["icon", className].filter(Boolean).join(" ")}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={style}
    >
      <path d={d} />
    </svg>
  );
}
