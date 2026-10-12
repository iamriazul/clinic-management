export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" id="loading-screen">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-pink-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-pink-500 animate-spin"></div>
        </div>
        <p className="text-gray-500 font-medium">Loading...</p>
      </div>
    </div>
  );
}
