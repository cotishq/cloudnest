import { DialogClose, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { AppFile } from "./FileList";
import { Dialog, DialogFooter, DialogHeader } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";


interface RenameDialogProps{
    file : AppFile | null;
    newName : string;
    setNewName : (val : string) => void;
    onRename : (id: string , newName : string) => void;
    onClose : () => void;
    
}

export const RenameDialog =  ({file , newName , setNewName , onRename , onClose} : RenameDialogProps) => {
    return (
        <Dialog open={!!file} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Rename{file?.name}"</DialogTitle>
                </DialogHeader>

                <Input 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter New name"
                />

                <DialogFooter className="mt-4">
                    <DialogClose asChild>
                        <Button variant="ghost">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button 
                    onClick={() => {
                        if(file) onRename(file.id , newName);
                        onClose();
                    }}
                    >
                        Rename
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )

}
    