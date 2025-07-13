interface StorageBarProps {
    usedMB: number;
    maxMB: number;
}

export const StorageBar = ({ usedMB, maxMB }: StorageBarProps) => {
    const percent = Math.min((usedMB / maxMB) * 100, 100);
    const percentFormatted = percent.toFixed(1);
    
    
    const getStorageColor = (percentage: number) => {
        if (percentage >= 90) return 'bg-red-500';
        if (percentage >= 75) return 'bg-orange-500';
        if (percentage >= 50) return 'bg-yellow-500';
        return 'bg-blue-500';
    };
    
    const getStorageGradient = (percentage: number) => {
        if (percentage >= 90) return 'from-red-400 to-red-600';
        if (percentage >= 75) return 'from-orange-400 to-orange-600';
        if (percentage >= 50) return 'from-yellow-400 to-yellow-600';
        return 'from-blue-400 to-blue-600';
    };

    return (
        <div className="w-full max-w-md space-y-2 text-sm text-slate-400 mt-4">
            
            <div className="flex items-center justify-between">
                <span className="text-slate-300">
                    Storage used: <span className="font-medium text-white">{usedMB.toFixed(2)} MB</span>
                </span>
                <span className="text-slate-400">
                    {maxMB} MB ({percentFormatted}%)
                </span>
            </div>
            
            
            <div className="relative">
                <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden shadow-inner">
                    <div 
                        className={`h-full bg-gradient-to-r ${getStorageGradient(percent)} transition-all duration-700 ease-out rounded-full relative`}
                        style={{ width: `${percent}%` }}
                    >
                        
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                        
                        
                        {percent >= 75 && (
                            <div className={`absolute inset-0 ${getStorageColor(percent)} opacity-30 blur-sm animate-pulse`}></div>
                        )}
                    </div>
                </div>
                
                
                {percent > 0 && (
                    <div 
                        className="absolute top-0 h-2 w-1 bg-white/60 rounded-full transform -translate-x-1/2 transition-all duration-700 ease-out"
                        style={{ left: `${Math.min(percent, 98)}%` }}
                    />
                )}
            </div>
            
            
            {percent >= 90 && (
                <div className="flex items-center gap-1 text-red-400 text-xs animate-pulse">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Storage almost full
                </div>
            )}
            
            {percent >= 100 && (
                <div className="flex items-center gap-1 text-red-500 text-xs font-medium">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Storage full - upgrade needed
                </div>
            )}
        </div>
    );
};