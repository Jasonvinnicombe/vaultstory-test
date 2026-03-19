import { Card, CardContent } from "@/components/ui/card";

export function LoadingPanel({ lines = 3 }: { lines?: number }) {
  return (
    <Card className="border-white/60 bg-card/82">
      <CardContent className="space-y-4 p-7 animate-pulse">
        <div className="h-5 w-32 rounded-full bg-secondary" />
        <div className="h-10 w-3/4 rounded-full bg-secondary/90" />
        {Array.from({ length: lines }).map((_, index) => (
          <div key={index} className="h-4 rounded-full bg-secondary/75" style={{ width: `${100 - index * 12}%` }} />
        ))}
      </CardContent>
    </Card>
  );
}
