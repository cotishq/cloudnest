interface StorageBarProps {
    usedMB : number;
    maxMB : number;
}

export const StorageBar = ({usedMB,maxMB}:StorageBarProps) => {
    const percent = Math.min((usedMB / maxMB) * 100 , 100).toFixed(1);

    return (
        <div className="w-full max-w-md space-y-1 text-sm text-muted-foreground mt-4">
            <div>
                Storage used : {usedMB.toFixed(2)} MB for {maxMB} MB ({percent} %)

            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div 
                className="h-full bg-primary tramsition-all duration-500"
                style={{width : `${percent}%`}}
                />

            </div>
        </div>
    );
};