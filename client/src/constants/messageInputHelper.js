// messageInputHelper
export function getFileIcon(filename) {
    if (!filename) return "📄";

    const ext = filename.split(".").pop()?.toLowerCase();
    const iconMap = {
        pdf: "📕",
        doc: "📘",
        docx: "📘",
        ppt: "📙",
        pptx: "📙",
        xls: "📗",
        xlsx: "📗",
        txt: "📝",
        zip: "🗜️",
        rar: "🗜️",
        mp3: "🎵",
        wav: "🎵",
        flac: "🎵",
        mp4: "🎬",
        avi: "🎬",
        mov: "🎬",
        jpg: "🖼️",
        jpeg: "🖼️",
        png: "🖼️",
        gif: "🖼️",
    };

    return iconMap[ext] || "📄";
}
