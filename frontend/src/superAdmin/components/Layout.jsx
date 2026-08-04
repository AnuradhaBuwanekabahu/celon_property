import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Navbar from './Navbar';

export default function Layout({ children, title, eyebrow }) {
  return (
    <div className="flex min-h-screen bg-[#F6F1E6]">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden">
        <Navbar />
        <Topbar title={title} eyebrow={eyebrow} />
        <div className="px-8 pt-7 pb-[60px]">{children}</div>
      </main>
    </div>
  );
}