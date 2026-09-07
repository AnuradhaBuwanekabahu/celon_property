const Loader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        
        <div className="flex items-end gap-1.5 h-10">
          <span className="h-3 w-2 rounded-full bg-[#FBBF24] animate-bounce [animation-delay:0ms]" />
          <span className="h-5 w-2 rounded-full bg-[#FBBF24] animate-bounce [animation-delay:100ms]" />
          <span className="h-7 w-2 rounded-full bg-[#FBBF24] animate-bounce [animation-delay:200ms]" />
          <span className="h-9 w-2 rounded-full bg-[#FBBF24] animate-bounce [animation-delay:300ms]" />
          <span className="h-7 w-2 rounded-full bg-[#FBBF24] animate-bounce [animation-delay:400ms]" />
          <span className="h-5 w-2 rounded-full bg-[#FBBF24] animate-bounce [animation-delay:500ms]" />
          <span className="h-3 w-2 rounded-full bg-[#FBBF24] animate-bounce [animation-delay:600ms]" />
        </div>

        <p className="text-sm font-medium text-[#14213D]">
          Loading...
        </p>

      </div>
    </div>
  )
}

export default Loader