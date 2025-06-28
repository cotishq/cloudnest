import { Archive, FileText, Image, Music, Video , File as GenericFile} from "lucide-react";



export default function FileIcon({type} : {type : string}){
    if(type.startsWith("image/png")) return <Image className="w-4 h-4 text-blue-500" />;
    if(type.startsWith("/video")) return <Video className="w-4 h-4 text-purple-500" /> ;
    if(type.startsWith("/audio")) return <Music className="w-4 h-4 text-pink-500" />;
    if(type == "application/pdf") return <FileText className="w-4 h-4 text-red-500" />;
    if(type == "/application/zip" || type == "/application/x-zip-compressed"){
         return <Archive className="w-4 h-4 text-yellow-500" />

    }


    return <GenericFile className="w-4 h-4 text-gray-500" />;


}