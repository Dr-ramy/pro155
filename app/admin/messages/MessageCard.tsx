// app/admin/messages/MessageCard.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type MessageCardProps = {
  message: {
    _id: string;
    username: string;
    content: string;
    createdAt: Date;
  };
};

export default function MessageCard({ message }: MessageCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {message.username}
          <Badge variant="outline">
            {new Date(message.createdAt).toLocaleString()}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-gray-700 whitespace-pre-wrap">{message.content}</p>
      </CardContent>
    </Card>
  );
}
