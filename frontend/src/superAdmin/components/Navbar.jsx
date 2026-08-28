export default function Navbar({ onToggleSidebar }) {
  return (
    <nav className="bg-[#14213D] flex items-center px-6 py-3">
      <button
        type="button"
        onClick={onToggleSidebar}
        className="mr-4 inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/20 text-white transition hover:border-white/40 md:hidden"
      >
        <span className="text-xl">☰</span>
      </button>
      <h1 className="text-white text-xl font-semibold m-0">Celone Property</h1>
    </nav>
  );
}