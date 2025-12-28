import Loading from "../../assets/loading/Loading2.gif";

function LoadingOverlay() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4">
                <img
                    src={Loading}
                    alt="Loading..."
                    className="w-24 h-24 sm:w-36 sm:h-36"
                />
                <span className="text-xl sm:text-3xl font-frankfurter text-gray-700 text-center sm:text-left">
                    wait for seconds ...
                </span>
            </div>
        </div>
    );
}

export default LoadingOverlay;
