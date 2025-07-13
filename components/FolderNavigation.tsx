import { ArrowUpFromLine, Home, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "./ui/dropdown-menu";


interface FolderNavigationProps {
  folderPath: Array<{ id: string; name: string }>;
  navigateUp: () => void;
  navigateToPathFolder: (index: number) => void;
  maxVisibleItems?: number;
  showBreadcrumbs?: boolean;
}

export default function FolderNavigation({
  folderPath,
  navigateUp,
  navigateToPathFolder,
  maxVisibleItems = 3,
  showBreadcrumbs = true
}: FolderNavigationProps) {
  const isAtRoot = folderPath.length === 0;
  const currentFolder = folderPath[folderPath.length - 1];
  
  
  const shouldCondense = folderPath.length > maxVisibleItems;
  const visiblePath = shouldCondense 
    ? folderPath.slice(-maxVisibleItems) 
    : folderPath;
  const hiddenPath = shouldCondense 
    ? folderPath.slice(0, folderPath.length - maxVisibleItems) 
    : [];

  const handleNavigateToRoot = () => {
    navigateToPathFolder(-1);
  };

  const handleNavigateUp = () => {
    if (!isAtRoot) {
      navigateUp();
    }
  };

  const formatFolderName = (name: string, maxLength: number = 20) => {
    return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
  };

  return (
    <div className="flex items-center gap-1 text-sm bg-muted/30 rounded-lg p-2 border">
     
      <div className="flex items-center gap-1 mr-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNavigateUp}
          disabled={isAtRoot}
          className="h-8 w-8 p-0 hover:bg-muted transition-colors"
          title="Go up one level"
        >
          <ArrowUpFromLine className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNavigateToRoot}
          className={`h-8 w-8 p-0 hover:bg-muted transition-colors ${
            isAtRoot ? "bg-muted text-primary" : ""
          }`}
          title="Go to root folder"
        >
          <Home className="w-4 h-4" />
        </Button>
      </div>

      
      {showBreadcrumbs && (
        <div className="flex items-center gap-1 overflow-hidden flex-1 min-w-0">
          
          <span className="text-muted-foreground font-medium">Root</span>
          
          
          {hiddenPath.length > 0 && (
            <>
              <ChevronRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-muted-foreground hover:bg-muted"
                  >
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {hiddenPath.map((folder, index) => (
                    <DropdownMenuItem
                      key={folder.id}
                      onClick={() => navigateToPathFolder(index)}
                      className="cursor-pointer"
                    >
                      <span className="truncate">{folder.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          
          
          {visiblePath.map((folder, index) => {
            const actualIndex = shouldCondense 
              ? hiddenPath.length + index 
              : index;
            const isLast = actualIndex === folderPath.length - 1;
            
            return (
              <div key={folder.id} className="flex items-center gap-1 min-w-0">
                <ChevronRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateToPathFolder(actualIndex)}
                  className={`h-6 px-2 min-w-0 text-left justify-start hover:bg-muted transition-colors ${
                    isLast ? "font-semibold text-foreground" : "text-muted-foreground"
                  }`}
                  title={folder.name}
                >
                  <span className="truncate">
                    {formatFolderName(folder.name, 15)}
                  </span>
                </Button>
              </div>
            );
          })}
        </div>
      )}

      
      <div className="flex items-center gap-2 ml-auto text-xs text-muted-foreground bg-background rounded px-2 py-1">
        <span>
          {isAtRoot ? "Root" : `${folderPath.length} level${folderPath.length > 1 ? "s" : ""} deep`}
        </span>
        {currentFolder && (
          <span className="text-foreground font-medium">
            {formatFolderName(currentFolder.name, 12)}
          </span>
        )}
      </div>
    </div>
  );
}