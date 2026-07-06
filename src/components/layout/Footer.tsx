export default function Footer() {
  return (
    <footer className="border-t border-gold/10 bg-navy-dark py-8 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 gold-gradient rounded-sm flex items-center justify-center">
            <span className="text-navy-dark font-serif font-bold">OTI</span>
          </div>
          <p className="text-muted-foreground text-sm">
            <span className="gold-text font-semibold">OTI</span> – One Time Invest Plan
          </p>
          {/* Nav links */}
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            <a href="/" className="text-muted-foreground hover:text-gold transition-colors">Home</a>
            <a href="/apply" className="text-muted-foreground hover:text-gold transition-colors">Apply Now</a>
            <a href="/register" className="text-muted-foreground hover:text-gold transition-colors">Register Numbers</a>
            <a href="/status" className="text-muted-foreground hover:text-gold transition-colors">Status Tracker</a>
            <a href="/#contact" className="text-muted-foreground hover:text-gold transition-colors">Contact</a>
            <a href="/welcome" className="text-muted-foreground hover:text-gold transition-colors">About OTI</a>
          </div>
          <p className="text-muted-foreground text-xs max-w-md text-center">
            This investment plan is managed by Co-Applicant Mr. Manoj. 
            All investments are made at the investor's own risk. 
            Subject to applicable terms and conditions.
          </p>
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} OTI One Time Invest Plan. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
