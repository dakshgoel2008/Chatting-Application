const AuthImagePattern = () => {
    return (
        <div className="hidden lg:flex items-center justify-center bg-[#111B21] text-white px-10 py-12">
            <div className="bg-[#1E2A32] p-8 rounded-xl shadow-xl flex flex-col items-center space-y-6 max-w-sm w-full">
                {/* Title */}
                <h2 className="text-2xl font-semibold">To use WhatsUp on your computer:</h2>

                {/* Subtitle */}
                <ul className="text-sm text-gray-300 text-left list-disc pl-5 space-y-1">
                    <li>Open WhatsUp on your phone</li>
                    <li>
                        Tap <strong>Menu</strong> or <strong>Settings</strong> and select{" "}
                        <strong>Linked Devices</strong>
                    </li>
                    <li>Point your phone to this screen to capture the code</li>
                </ul>

                {/* QR Code */}
                <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://yourwebsite.com/login"
                    alt="QR Code"
                    className="rounded-md border border-white w-48 h-48"
                />

                {/* Optional note */}
                <p className="text-xs text-gray-400">The QR code is valid for 1 minute</p>
                <p className="text-red-500">
                    <span className="font-bold">BEWARE:</span> This QR Scanner functionality will be developed later.
                </p>
            </div>
        </div>
    );
};

export default AuthImagePattern;
