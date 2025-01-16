// components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-4">About Devmira</h3>
            <p className="text-sm text-muted-foreground">
              Digital marketing solutions for local sellers to grow their business.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary">Dashboard</Link></li>
              <li><Link href="/products" className="text-sm text-muted-foreground hover:text-primary">Products</Link></li>
              <li><Link href="/sales" className="text-sm text-muted-foreground hover:text-primary">Sales</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/help" className="text-sm text-muted-foreground hover:text-primary">Help Center</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Devmira. All rights reserved.
        </div>
      </div>
    </footer>
  );
}