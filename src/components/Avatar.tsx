interface AvatarProps {
  name: string;
  surname: string;
  size?: "sm" | "md" | "lg";
}

const SIZE_CLASSES: Record<string, string> = {
  sm: "avatar-sm",
  md: "avatar-md",
  lg: "avatar-lg",
};

export default function Avatar({ name, surname, size = "md" }: AvatarProps) {
  const initials = `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
  const sizeClass = SIZE_CLASSES[size] ?? "avatar-md";

  return <span className={sizeClass}>{initials}</span>;
}
