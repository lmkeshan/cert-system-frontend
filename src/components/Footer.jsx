export default function Footer() {
  return (
    <footer id="contact" className="bg-[var(--color-primary-violet)] text-white py-6 px-4 text-center">
      <div className="space-y-2">
        <h3 className="text-base font-semibold">CertiChain</h3>
        <p className="font-semibold text-sm">Secure Blockchain-Based Certificate Verification Platform</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xs md:text-sm">
          <a href="#verify" className="hover:underline">Verify Certificate</a>
          <a href="#" className="hover:underline">Institute Log in</a>
          <a href="#" className="hover:underline">Student Log in</a>
        </div>

        <p className="text-xs md:text-sm">Powered by Polygon Blockchain &amp; Metamask wallet</p>
        <p className="text-xs md:text-sm">© 2025 CertiChain. All rights reserved.</p>

        <div className="flex items-center justify-center gap-2 text-xs md:text-sm">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <span>|</span>
          <a href="#" className="hover:underline">Terms of Service</a>
        </div>
      </div>
    </footer>
  )
}
