import { useEffect, useRef, useCallback, useState } from "react";
import { Play, Pause, Volume2 } from "lucide-react";

const AudioPlayer = ({ src }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const audioRef = useRef(null);

    const togglePlayPause = useCallback(() => {
        if (error || !audioRef.current) return;

        try {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        } catch (err) {
            console.error("Audio playback error:", err);
            setError(true);
        }
    }, [isPlaying, error]);

    const handleSeek = useCallback(
        (e) => {
            if (!audioRef.current || !duration) return;

            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const newTime = (clickX / rect.width) * duration;
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        },
        [duration]
    );

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleLoadedData = () => {
            setDuration(audio.duration || 0);
            setIsLoading(false);
            setError(false);
        };

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime || 0);
        };

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleEnded = () => setIsPlaying(false);

        const handleError = (e) => {
            console.error("Audio loading error:", e);
            setError(true);
            setIsLoading(false);
        };

        // Add all event listeners
        audio.addEventListener("loadeddata", handleLoadedData);
        audio.addEventListener("loadedmetadata", handleLoadedData);
        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("play", handlePlay);
        audio.addEventListener("pause", handlePause);
        audio.addEventListener("ended", handleEnded);
        audio.addEventListener("error", handleError);

        return () => {
            audio.removeEventListener("loadeddata", handleLoadedData);
            audio.removeEventListener("loadedmetadata", handleLoadedData);
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("play", handlePlay);
            audio.removeEventListener("pause", handlePause);
            audio.removeEventListener("ended", handleEnded);
            audio.removeEventListener("error", handleError);
        };
    }, [src]);

    const formatTime = useCallback((time) => {
        if (!time || isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }, []);

    const getFileName = useCallback(() => {
        try {
            const urlParts = src.split("/");
            const fileName = urlParts[urlParts.length - 1];
            return fileName.split("?")[0] || "Audio File";
        } catch {
            return "Audio File";
        }
    }, [src]);

    if (error) {
        return (
            <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg max-w-sm">
                <Volume2 className="w-5 h-5 text-red-400" />
                <div>
                    <p className="text-sm text-red-600 font-medium">Audio Error</p>
                    <p className="text-xs text-red-500">Unable to load audio file</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2 p-3 bg-white/80 backdrop-blur-sm rounded-lg max-w-sm border border-gray-200 shadow-sm">
            {/* Audio info header */}
            <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-gray-500" />
                <span className="text-xs text-gray-600 font-medium truncate">{getFileName()}</span>
                <span className="text-xs text-gray-400 ml-auto">{formatTime(duration)}</span>
            </div>

            {/* Audio controls */}
            <div className="flex items-center gap-3">
                <audio ref={audioRef} src={src} preload="metadata" />

                <button
                    onClick={togglePlayPause}
                    disabled={isLoading}
                    className="flex items-center justify-center w-8 h-8 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-full transition-colors duration-200 shadow-sm"
                    title={isLoading ? "Loading..." : isPlaying ? "Pause" : "Play"}
                >
                    {isLoading ? (
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : isPlaying ? (
                        <Pause size={14} />
                    ) : (
                        <Play size={14} className="ml-0.5" />
                    )}
                </button>

                {/* Progress bar */}
                <div className="flex-1 flex items-center gap-2">
                    <div
                        className="flex-1 h-2 bg-gray-200 rounded-full cursor-pointer relative overflow-hidden"
                        onClick={handleSeek}
                        title="Click to seek"
                    >
                        <div
                            className="h-full bg-blue-500 rounded-full transition-all duration-100"
                            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                        />
                    </div>
                    <span className="text-xs text-gray-500 min-w-[35px] text-right">{formatTime(currentTime)}</span>
                </div>
            </div>
        </div>
    );
};

export default AudioPlayer;
