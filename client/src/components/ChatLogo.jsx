const ChatLogo = ({ size = "regular", className = "", onClick = null }) => {
    // Size configurations
    const sizeConfig = {
        small: { width: "40px", height: "40px", borderRadius: "10px" },
        regular: { width: "60px", height: "60px", borderRadius: "15px" },
        large: { width: "80px", height: "80px", borderRadius: "20px" },
    };

    const bubbleConfig = {
        small: {
            container: { width: "20px", height: "16px" },
            bubble1: { width: "12px", height: "9px" },
            bubble2: { width: "10px", height: "8px" },
            dot: { width: "1.5px", height: "1.5px" },
        },
        regular: {
            container: { width: "30px", height: "25px" },
            bubble1: { width: "18px", height: "14px" },
            bubble2: { width: "15px", height: "12px" },
            dot: { width: "2px", height: "2px" },
        },
        large: {
            container: { width: "40px", height: "32px" },
            bubble1: { width: "24px", height: "18px" },
            bubble2: { width: "20px", height: "16px" },
            dot: { width: "3px", height: "3px" },
        },
    };

    const currentSize = sizeConfig[size];
    const currentBubble = bubbleConfig[size];

    const logoStyle = {
        width: currentSize.width,
        height: currentSize.height,
        background: "linear-gradient(145deg, #00d4ff, #0099cc)",
        borderRadius: currentSize.borderRadius,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2), inset 0 1px 5px rgba(255, 255, 255, 0.3)",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.3s ease",
        position: "relative",
    };

    const hoverStyle = onClick
        ? {
              ":hover": {
                  transform: "translateY(-2px) scale(1.02)",
                  boxShadow: "0 12px 24px rgba(0, 0, 0, 0.3), inset 0 2px 8px rgba(255, 255, 255, 0.4)",
              },
          }
        : {};

    return (
        <>
            <style>
                {`
          .chat-logo:hover {
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3), inset 0 2px 8px rgba(255, 255, 255, 0.4);
          }
          
          .bubble {
            position: absolute;
            background: white;
            borderRadius: 50%;
            boxShadow: 0 1px 4px rgba(0, 0, 0, 0.1);
          }
          
          .bubble-1 {
            animation: pulse1 2s ease-in-out infinite;
          }
          
          .bubble-1::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 4px;
            width: 4px;
            height: 4px;
            background: white;
            borderRadius: 50% 0;
            transform: rotate(-45deg);
          }
          
          .bubble-2 {
            background: rgba(255, 255, 255, 0.9);
            animation: pulse2 2s ease-in-out infinite 0.5s;
          }
          
          .bubble-2::after {
            content: '';
            position: absolute;
            bottom: -2px;
            right: 3px;
            width: 3px;
            height: 3px;
            background: rgba(255, 255, 255, 0.9);
            borderRadius: 50% 0;
            transform: rotate(135deg);
          }
          
          .dot {
            background: #0099cc;
            borderRadius: 50%;
            animation: typing 1.5s ease-in-out infinite;
          }
          
          .dot:nth-child(2) { animation-delay: 0.2s; }
          .dot:nth-child(3) { animation-delay: 0.4s; }
          
          @keyframes pulse1 {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.9; }
          }
          
          @keyframes pulse2 {
            0%, 100% { transform: scale(1); opacity: 0.9; }
            50% { transform: scale(1.05); opacity: 1; }
          }
          
          @keyframes typing {
            0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
            30% { transform: translateY(-${
                size === "small" ? "3px" : size === "regular" ? "4px" : "5px"
            }); opacity: 1; }
          }
        `}
            </style>

            <div className={`chat-logo ${className}`} style={logoStyle} onClick={onClick}>
                <div
                    style={{
                        position: "relative",
                        width: currentBubble.container.width,
                        height: currentBubble.container.height,
                    }}
                >
                    {/* First bubble with typing dots */}
                    <div
                        className="bubble bubble-1"
                        style={{
                            ...currentBubble.bubble1,
                            top: 0,
                            left: 0,
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
                            <div className="dot" style={currentBubble.dot}></div>
                            <div className="dot" style={currentBubble.dot}></div>
                            <div className="dot" style={currentBubble.dot}></div>
                        </div>
                    </div>

                    {/* Second bubble */}
                    <div
                        className="bubble bubble-2"
                        style={{
                            ...currentBubble.bubble2,
                            bottom: 0,
                            right: 0,
                            borderRadius: "10px",
                        }}
                    ></div>
                </div>
            </div>
        </>
    );
};

export default ChatLogo;
