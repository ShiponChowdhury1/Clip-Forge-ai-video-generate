import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-black text-white flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2 mb-12">
          <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-lg font-semibold">Clipforge</span>
        </Link>

        {/* 404 Number */}
        <div className="text-[150px] md:text-[200px] font-bold text-cyan-500 leading-none mb-4">
          404
        </div>
        
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Page Not Found
        </h1>
        
        {/* Description */}
        <p className="text-gray-400 text-base mb-8 leading-relaxed">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-cyan-500 hover:bg-cyan-400 text-white font-semibold px-6 py-3 rounded-lg transition text-sm"
          >
            Go Back Home
          </Link>
          <Link
            href="/#faq"
            className="bg-transparent border border-gray-700 hover:border-gray-500 text-white font-medium px-6 py-3 rounded-lg transition text-sm"
          >
            View FAQ
          </Link>
        </div>
      </div>
    </div>
  );
}
