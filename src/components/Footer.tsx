import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background px-4 py-4 lg:px-6">
      <div className="flex flex-col items-center justify-between gap-2 text-center text-sm text-muted-foreground sm:flex-row">
        <p>&copy; {currentYear} E-Dash. All rights reserved.</p>
        <nav className="flex items-center gap-4">
          <Link href="#" className="transition-colors hover:text-foreground">
            Terms of Service
          </Link>
          <Link href="#" className="transition-colors hover:text-foreground">
            Privacy Policy
          </Link>
          <Link href="#" className="transition-colors hover:text-foreground">
            Support
          </Link>
        </nav>
      </div>
    </footer>
  );
}
