import Navbar from './Navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="gov-shell">
      <Navbar />
      <main className="gov-page">
        <div className="gov-main">{children}</div>
      </main>
    </div>
  );
}
