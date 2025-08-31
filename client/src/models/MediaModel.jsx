import { useEffect, useState, useRef, useCallback } from "react";
import {
    X,
    Maximize,
    Download,
    ZoomIn,
    ZoomOut,
    RotateCw,
    Play,
    Pause,
    Volume2,
    VolumeX,
    Maximize2,
    Minimize2,
} from "lucide-react";

const MediaModal = ({ src, type, onClose, title, alt }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const mediaRef = useRef(null);
    const containerRef = useRef(null);
    const modalRef = useRef(null);

    // Reset transformations when src changes
    useEffect(() => {
        setZoom(1);
        setRotation(0);
        setPosition({ x: 0, y: 0 });
        setIsLoading(true);
        setError(false);
    }, [src]);

    // Handle media load
    const handleMediaLoad = useCallback(() => {
        setIsLoading(false);
        setError(false);
        if (type === "video" && mediaRef.current) {
            setDuration(mediaRef.current.duration);
            setIsPlaying(!mediaRef.current.paused);
        }
    }, [type]);

    // Handle media error
    const handleMediaError = useCallback(() => {
        setIsLoading(false);
        setError(true);
    }, []);

    // Handle backdrop click to close
    const handleBackdropClick = useCallback(
        (e) => {
            if (e.target === e.currentTarget) {
                onClose();
            }
        },
        [onClose]
    );

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.target.tagName === "INPUT") return; // Don't interfere with input fields

            switch (e.key) {
                case "Escape":
                    onClose();
                    break;
                case "=":
                case "+":
                    e.preventDefault();
                    setZoom((prev) => Math.min(prev + 0.25, 5));
                    break;
                case "-":
                    e.preventDefault();
                    setZoom((prev) => Math.max(prev - 0.25, 0.25));
                    break;
                case "r":
                case "R":
                    e.preventDefault();
                    setRotation((prev) => prev + 90);
                    break;
                case "0":
                    e.preventDefault();
                    setZoom(1);
                    setRotation(0);
                    setPosition({ x: 0, y: 0 });
                    break;
                case " ":
                    if (type === "video") {
                        e.preventDefault();
                        togglePlayPause();
                    }
                    break;
                case "m":
                case "M":
                    if (type === "video") {
                        e.preventDefault();
                        toggleMute();
                    }
                    break;
                case "f":
                case "F":
                    e.preventDefault();
                    toggleFullscreen();
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose, type]);

    // Mouse wheel zoom
    const handleWheel = useCallback(
        (e) => {
            if (type === "image") {
                e.preventDefault();
                const delta = e.deltaY > 0 ? -0.1 : 0.1;
                setZoom((prev) => Math.max(0.25, Math.min(5, prev + delta)));
            }
        },
        [type]
    );

    // Drag functionality for images
    const handleMouseDown = useCallback(
        (e) => {
            if (type === "image" && zoom > 1) {
                setIsDragging(true);
                setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
            }
        },
        [type, zoom, position]
    );

    const handleMouseMove = useCallback(
        (e) => {
            if (isDragging && type === "image") {
                setPosition({
                    x: e.clientX - dragStart.x,
                    y: e.clientY - dragStart.y,
                });
            }
        },
        [isDragging, type, dragStart]
    );

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
            return () => {
                window.removeEventListener("mousemove", handleMouseMove);
                window.removeEventListener("mouseup", handleMouseUp);
            };
        }
    }, [isDragging, handleMouseMove, handleMouseUp]);

    // Video controls
    const togglePlayPause = useCallback(() => {
        if (mediaRef.current) {
            if (isPlaying) {
                mediaRef.current.pause();
            } else {
                mediaRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    }, [isPlaying]);

    const toggleMute = useCallback(() => {
        if (mediaRef.current) {
            mediaRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    }, [isMuted]);

    const handleVolumeChange = useCallback((e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (mediaRef.current) {
            mediaRef.current.volume = newVolume;
            setIsMuted(newVolume === 0);
        }
    }, []);

    const handleTimeUpdate = useCallback(() => {
        if (mediaRef.current) {
            setCurrentTime(mediaRef.current.currentTime);
        }
    }, []);

    const handleSeek = useCallback(
        (e) => {
            if (mediaRef.current && duration) {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const newTime = (clickX / rect.width) * duration;
                mediaRef.current.currentTime = newTime;
                setCurrentTime(newTime);
            }
        },
        [duration]
    );

    // Fullscreen functionality
    const toggleFullscreen = useCallback(async () => {
        if (!document.fullscreenElement) {
            try {
                await modalRef.current?.requestFullscreen();
                setIsFullscreen(true);
            } catch (err) {
                console.log("Fullscreen not supported");
            }
        } else {
            try {
                await document.exitFullscreen();
                setIsFullscreen(false);
            } catch (err) {
                console.log("Exit fullscreen failed");
            }
        }
    }, []);

    // Listen for fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    // Format time for display
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    // Download functionality
    const handleDownload = useCallback(async () => {
        try {
            const response = await fetch(src);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.style.display = "none";
            a.href = url;
            a.download = title || `media.${type === "image" ? "jpg" : "mp4"}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            // Fallback to simple download
            const a = document.createElement("a");
            a.href = src;
            a.download = title || `media.${type === "image" ? "jpg" : "mp4"}`;
            a.click();
        }
    }, [src, type, title]);

    return (
        <div
            ref={modalRef}
            onClick={handleBackdropClick}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[1000] animate-in fade-in-0 duration-300"
            onWheel={handleWheel}
        >
            {/* Loading spinner */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-2 border-white border-t-transparent"></div>
                </div>
            )}

            {/* Error state */}
            {error && (
                <div className="text-white text-center">
                    <div className="text-6xl mb-4">⚠️</div>
                    <p className="text-xl">Failed to load media</p>
                    <p className="text-sm text-gray-300 mt-2">The file might be corrupted or unavailable</p>
                </div>
            )}

            <div
                className={`relative max-w-[95vw] max-h-[95vh] flex flex-col transition-all duration-300 ${
                    isFullscreen ? "max-w-full max-h-full" : ""
                }`}
            >
                {/* Header with controls */}
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-black/60 to-black/40 backdrop-blur-md rounded-t-xl border-b border-white/10">
                    <div className="flex items-center gap-2 text-white text-sm truncate flex-1">
                        {title && <span className="font-medium truncate">{title}</span>}
                        {type === "image" && (
                            <span className="text-xs text-gray-300 ml-2">
                                {Math.round(zoom * 100)}% • {rotation}°
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-1">
                        {/* Image controls */}
                        {type === "image" && (
                            <>
                                <button
                                    onClick={() => setZoom((prev) => Math.min(prev + 0.25, 5))}
                                    className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                                    title="Zoom in (+)"
                                >
                                    <ZoomIn size={18} />
                                </button>
                                <button
                                    onClick={() => setZoom((prev) => Math.max(prev - 0.25, 0.25))}
                                    className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                                    title="Zoom out (-)"
                                >
                                    <ZoomOut size={18} />
                                </button>
                                <button
                                    onClick={() => setRotation((prev) => prev + 90)}
                                    className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                                    title="Rotate (R)"
                                >
                                    <RotateCw size={18} />
                                </button>
                            </>
                        )}

                        {/* Universal controls */}
                        <button
                            onClick={handleDownload}
                            className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                            title="Download"
                        >
                            <Download size={18} />
                        </button>
                        <a
                            href={src}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                            title="Open in new tab"
                        >
                            <Maximize size={18} />
                        </a>
                        <button
                            onClick={toggleFullscreen}
                            className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                            title="Fullscreen (F)"
                        >
                            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-white hover:bg-red-500/30 rounded-lg transition-colors"
                            title="Close (Esc)"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Media container */}
                <div
                    ref={containerRef}
                    className="relative flex-1 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-b-xl overflow-hidden"
                    style={{ minHeight: "400px" }}
                >
                    {type === "image" ? (
                        <img
                            ref={mediaRef}
                            src={src}
                            alt={alt || "Enlarged view"}
                            className={`max-w-full max-h-full object-contain transition-transform duration-200 ${
                                isDragging ? "cursor-grabbing" : zoom > 1 ? "cursor-grab" : "cursor-default"
                            }`}
                            style={{
                                transform: `scale(${zoom}) rotate(${rotation}deg) translate(${position.x}px, ${position.y}px)`,
                            }}
                            onLoad={handleMediaLoad}
                            onError={handleMediaError}
                            onMouseDown={handleMouseDown}
                            draggable={false}
                        />
                    ) : (
                        <div className="relative w-full h-full flex items-center justify-center">
                            <video
                                ref={mediaRef}
                                src={src}
                                className="max-w-full max-h-full object-contain rounded-lg"
                                onLoadedData={handleMediaLoad}
                                onError={handleMediaError}
                                onTimeUpdate={handleTimeUpdate}
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                                autoPlay
                                preload="metadata"
                            />

                            {/* Video controls overlay */}
                            <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md rounded-xl p-4">
                                {/* Progress bar */}
                                <div
                                    className="w-full h-2 bg-white/20 rounded-full mb-3 cursor-pointer relative overflow-hidden"
                                    onClick={handleSeek}
                                >
                                    <div
                                        className="h-full bg-white rounded-full transition-all"
                                        style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                                    />
                                </div>

                                {/* Control buttons and info */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={togglePlayPause}
                                            className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                                            title={isPlaying ? "Pause (Space)" : "Play (Space)"}
                                        >
                                            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                                        </button>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={toggleMute}
                                                className="p-1 text-white hover:bg-white/20 rounded transition-colors"
                                                title={isMuted ? "Unmute (M)" : "Mute (M)"}
                                            >
                                                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                                            </button>
                                            <input
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.1"
                                                value={isMuted ? 0 : volume}
                                                onChange={handleVolumeChange}
                                                className="w-20 accent-white"
                                                title="Volume"
                                            />
                                        </div>
                                    </div>

                                    <div className="text-white text-sm">
                                        {formatTime(currentTime)} / {formatTime(duration)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Keyboard shortcuts help */}
                <div className="absolute top-16 right-4 bg-black/80 backdrop-blur-md rounded-lg p-3 text-xs text-white/70 max-w-48 opacity-0 hover:opacity-100 transition-opacity">
                    <div className="font-semibold mb-2">Shortcuts:</div>
                    <div>ESC - Close</div>
                    <div>+/- - Zoom</div>
                    <div>R - Rotate</div>
                    <div>0 - Reset</div>
                    {type === "video" && (
                        <>
                            <div>Space - Play/Pause</div>
                            <div>M - Mute</div>
                        </>
                    )}
                    <div>F - Fullscreen</div>
                </div>
            </div>
        </div>
    );
};

export default MediaModal;
