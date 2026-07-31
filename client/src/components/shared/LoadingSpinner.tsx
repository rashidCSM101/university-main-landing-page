export const LoadingSpinner = ({ label = 'Loading Climate Application...' }: { label?: string }) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
      <div className="w-12 h-12 border-4 border-[#00C8C8] border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-sm font-semibold text-gray-400 font-heading tracking-wide">{label}</p>
    </div>
  );
};

export default LoadingSpinner;
