import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bookmark, MessageCircle } from "lucide-react";

type ProfileCardProps = {
  user: {
    avatarUrl: string;
    username: string;
    bio: string;
    height: string;
    branch: string;
    interests: string[];
  };
};

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <Card className="w-1/4 max-w-sm">
      <CardContent>
        <div className="flex items-center gap-4">
          <Avatar className="size-12">
            <AvatarImage src={user.avatarUrl} alt={user.username} />
            <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-semibold">{user.username}</p>
            <p className="text-sm text-muted-foreground">{user.branch} • {user.height}</p>
          </div>
        </div>

        <p className="mt-3 text-sm">
          {user.bio.length > 100 ? user.bio.substring(0, 100) + '...' : user.bio}
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          {user.interests.map((tag, index) => (
            <Badge key={index} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <CardFooter className="flex items-center gap-4 justify-end mt-5 p-4">
          <Button className="flex-grow">
            Connect
          </Button>
          <Button className="flex-shrink-0">
            <Bookmark className="size-4" />
          </Button>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
