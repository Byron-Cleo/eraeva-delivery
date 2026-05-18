import Image from "next/image";
import { cn } from "@/lib/utils";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface UserAvatarProps {
  name: string | null | undefined;
  image?: string | null | undefined;
  className?: string;
}

const UserAvatar = ({ name, image, className }: UserAvatarProps) => {
  if (image) {
    return (
      <Image
        src={image}
        alt={name ?? "User avatar"}
        width={32}
        height={32}
        className={cn("rounded-full object-cover", className)}
      />
    );
  }

  const initials = getInitials(name ?? "U");

  return (
    <div
      className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 text-sm font-medium text-gray-600",
        className
      )}
    >
      {initials}
    </div>
  );
};

export default UserAvatar;
