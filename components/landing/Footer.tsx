

import { Github, Linkedin, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="w-full border-t border-muted bg-background text-muted-foreground">
      <div className="container max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-muted-foreground"> CloudNest</h2>
          <p className="text-sm">
            Upload. Organize. Share. All in one secure place.
          </p>
          <div className="flex gap-4">
            <a href="https://github.com/cotishq " target="_blank">
              <Button size="icon" variant="ghost">
                <Github className="h-4 w-4" />
              </Button>
            </a>
            <a href="https://twitter.com/tanishqstwt" target="_blank">
              <Button size="icon" variant="ghost">
                <Twitter className="h-4 w-4" />
              </Button>
            </a>
            <a href="https://linkedin.com/in/yourhandle" target="_blank">
              <Button size="icon" variant="ghost">
                <Linkedin className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>

        
        <div>
          <h3 className="font-semibold mb-2 text-white">Resources</h3>
          <ul className="space-y-1 text-sm">
            <li><a href="#" className="hover:underline">Docs</a></li>
            <li><a href="#" className="hover:underline">Pricing</a></li>
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
          </ul>
        </div>

        
        <div>
          <h3 className="font-semibold mb-2 text-white">Company</h3>
          <ul className="space-y-1 text-sm">
            <li><a href="#" className="hover:underline">About</a></li>
            <li><a href="#" className="hover:underline">Contact</a></li>
            <li><a href="#" className="hover:underline">Careers</a></li>
          </ul>
        </div>
      </div>

      
      <div className="border-t border-muted py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} CloudNest. All rights reserved.
      </div>
    </footer>
  )
}
