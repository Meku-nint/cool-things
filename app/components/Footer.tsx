export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 text-sm text-zinc-600">
        <span>© {new Date().getFullYear()} Royal Smart Computer</span>
        <span>hey</span>
        <span className="inline-flex items-center gap-2"><i className="fa-solid fa-shield-halved"/> Smart sales, warranties, and analytics</span>
      </div>
    </footer>
  );
}
