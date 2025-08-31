import { memo, useState, useMemo } from "react";
import { Play, FileText as FileIcon, Download } from "lucide-react";
import AudioPlayer from "./AudioPlayer"; // since we already extracted it

const FileAttachment = memo(({ file, onMediaClick }) => {
    const [imageError, setImageError] = useState(false);
    const [videoError, setVideoError] = useState(false);

    const renderFileContent = useMemo(() => {
        if (!file) {
            console.warn("FileAttachment: No file provided");
            return null;
        }

        // Image handling
        if (file.match(/\.(jpeg|png|gif|jpg|webp|svg)$/i)) {
            return (
                <button
                    onClick={() => onMediaClick(file, "image")}
                    className="block w-full max-w-[280px] rounded-lg overflow-hidden cursor-pointer group relative shadow-md hover:shadow-lg transition-all duration-300"
                >
                    {imageError ? (
                        <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                            <FileIcon className="w-8 h-8 text-gray-400" />
                            <span className="text-sm text-gray-500 ml-2">Image failed to load</span>
                        </div>
                    ) : (
                        <img
                            src={file}
                            alt="Image attachment"
                            className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-300"
                            loading="lazy"
                            onError={() => setImageError(true)}
                            onLoad={() => setImageError(false)}
                        />
                    )}
                </button>
            );
        }

        // Video handling
        if (file.match(/\.(mp4|webm|ogg|mov|avi)$/i)) {
            return (
                <button
                    onClick={() => onMediaClick(file, "video")}
                    className="w-full max-w-[280px] rounded-lg overflow-hidden relative group shadow-md hover:shadow-lg cursor-pointer transition-all duration-300"
                >
                    {videoError ? (
                        <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                            <FileIcon className="w-8 h-8 text-gray-400" />
                            <span className="text-sm text-gray-500 ml-2">Video failed to load</span>
                        </div>
                    ) : (
                        <>
                            <video
                                className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-300"
                                preload="metadata"
                                src={`${file}#t=0.1`}
                                onError={() => setVideoError(true)}
                                onLoadedData={() => setVideoError(false)}
                            >
                                <source src={file} />
                                Your browser does not support the video tag.
                            </video>
                            {/* Play overlay */}
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors duration-300">
                                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                                    <Play size={20} className="text-gray-700 ml-1" />
                                </div>
                            </div>
                        </>
                    )}
                </button>
            );
        }

        // Audio handling
        if (file.match(/\.(mp3|wav|ogg|m4a|aac|flac)$/i)) {
            return <AudioPlayer src={file} />;
        }

        // Other file types
        const fileName = file.split("/").pop() || "Unknown File";
        const fileExtension = fileName.split(".").pop()?.toUpperCase() || "";

        return (
            <a
                href={file}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg max-w-xs hover:bg-white/90 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
            >
                <div className="flex-shrink-0">
                    <FileIcon className="w-8 h-8 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-700 truncate" title={fileName}>
                        {fileName}
                    </p>
                    <p className="text-xs text-gray-500">{fileExtension} • Click to download</p>
                </div>
                <Download className="w-5 h-5 text-gray-400 flex-shrink-0" />
            </a>
        );
    }, [file, onMediaClick, imageError, videoError]);

    return renderFileContent;
});

FileAttachment.displayName = "FileAttachment";

export default FileAttachment;
