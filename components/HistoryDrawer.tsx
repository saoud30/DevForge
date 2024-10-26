import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHistory } from "@/hooks/use-history";

export default function HistoryDrawer() {
  const { history, clearHistory } = useHistory();

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days === 1 ? '' : 's'} ago`;
    if (hours > 0) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    if (minutes > 0) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    return `${seconds} second${seconds === 1 ? '' : 's'} ago`;
  };

  const downloadHistory = (content: string, type: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${type}-${Date.now()}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="ml-2">
          <History className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex justify-between items-center">
            <span>Generation History</span>
            <Button variant="destructive" size="sm" onClick={clearHistory}>
              Clear History
            </Button>
          </SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          {history.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatTimeAgo(item.timestamp)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadHistory(item.content, item.type)}
                >
                  Download
                </Button>
              </div>
              <pre className="text-sm bg-muted p-2 rounded-md overflow-x-auto">
                {item.content.slice(0, 100)}...
              </pre>
            </div>
          ))}
          {history.length === 0 && (
            <p className="text-center text-muted-foreground">No history yet</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}