export default function Footer() {
  return (
    <footer className="border-t border-black/5 dark:border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm flex flex-col md:flex-row items-center justify-between gap-2">
        <p className="text-foreground/70">
          © {new Date().getFullYear()} Panitia 17 Agustus. Merdeka!
        </p>
        <p className="text-foreground/60">Dibuat oleh Shandy</p>
      </div>
    </footer>
  );
}
