import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 gold-gradient rounded-md flex items-center justify-center mb-6">
        <span className="text-navy-dark font-serif font-bold text-2xl">OTI</span>
      </div>
      <h1 className="font-serif text-6xl font-bold gold-text mb-4">404</h1>
      <p className="text-muted-foreground text-lg mb-8">Page not found</p>
      <Link
        to="/"
        className="px-6 py-3 gold-gradient text-navy-dark font-bold rounded hover:opacity-90 transition-opacity"
      >
        Return Home
      </Link>
    </div>
  );
}
