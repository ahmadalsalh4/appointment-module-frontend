interface AvatarProps {
  name: string;
  surname: string;
  size?: "sm" | "md" | "lg";
}

const SIZE_CLASSES: Record<"sm" | "md" | "lg", string> = {
  sm: "avatar-sm",
  md: "avatar-md",
  lg: "avatar-lg",
};

export default function Avatar({ name, surname, size = "md" }: AvatarProps) {
  const first = name?.charAt(0) ?? "";
  const last = surname?.charAt(0) ?? "";
  const initials = `${first}${last}`.toUpperCase() || "?";
  const sizeClass = SIZE_CLASSES[size] ?? "avatar-md";
  const label = `${name ?? ""} ${surname ?? ""}`.trim() || "Kullanıcı";

  // `aria-hidden` because the surrounding row already has the user's
  // name; the avatar is decorative. The aria-label is still set in case
  // the surrounding text is missing.
  return (
    <span className={sizeClass} role="img" aria-label={label}>
      {initials}
    </span>
  );
}
