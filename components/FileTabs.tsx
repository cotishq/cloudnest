import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

interface FileTabsProps{
    activeTab : string;
    onTabChange : (tab : string) => void;
}

export default function FileTabs({activeTab , onTabChange} : FileTabsProps){
    return (
        <Tabs defaultValue={activeTab} onValueChange={onTabChange}>
            <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="starred">Starred</TabsTrigger>
                <TabsTrigger value="trash">Trash</TabsTrigger>
            </TabsList>
        </Tabs>
        
    );

}