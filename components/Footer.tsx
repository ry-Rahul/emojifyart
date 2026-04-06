export function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-gray-50 py-8">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 text-sm text-gray-600 md:grid-cols-3">
          <div>
            <p className="font-semibold text-gray-900">Emoji Mosaic Generator</p>
            <p className="mt-2">
              Create beautiful emoji mosaics from your photos directly in your browser.
            </p>
            <p className="mt-2">© 2025 Emoji Mosaic Generator. All rights reserved.</p>
          </div>

          <div>
            <p className="font-semibold text-gray-900">About</p>
            <p className="mt-2">
              This tool helps students, creators, and casual users turn images into playful
              emoji-based artwork with adjustable quality and easy downloads.
            </p>
            <div className="mt-3 flex flex-col gap-2">
              <a href="#about" className="hover:text-gray-900 transition-colors">
                Read more
              </a>
              <a href="/terms" className="hover:text-gray-900 transition-colors">
                Terms of use
              </a>
            </div>
          </div>

          <div>
            <p className="font-semibold text-gray-900">Contact</p>
            <p className="mt-2">For feedback, bugs, or collaboration, connect on LinkedIn.</p>
            <a
              href="https://www.linkedin.com/in/rahul-yadav-482156223/"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block hover:text-gray-900 transition-colors"
            >
              Rahul Yadav on LinkedIn
            </a>
            <div className="mt-2">
              <a href="#contact" className="hover:text-gray-900 transition-colors">
                Contact section
              </a>
            </div>
            <div className="mt-2">
              <a href="/privacy" className="hover:text-gray-900 transition-colors">
                Privacy policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
