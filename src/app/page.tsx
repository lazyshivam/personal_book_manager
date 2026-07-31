import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50 font-sans px-4">
     
      <main className="flex w-full max-w-3xl flex-col items-center text-center py-20 px-8 sm:py-32 sm:px-16 bg-white rounded-3xl shadow-sm border border-gray-100">
        
        {/* Minimalist Icon Accent */}
        <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
          <span className="text-3xl">📖</span>
        </div>

        
        <h1 className="text-4xl sm:text-5xl font-serif text-gray-900 tracking-tight mb-6">
          The Personal Book Manager
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mb-12 leading-relaxed">
          A quiet space for readers. Log your books, reflect on your habits, 
          and rediscover your favorite authors without the noise. 
          Simple, elegant, and made just for you.
        </p>

        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link 
            href="/register"
            className="flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-gray-900 border border-transparent rounded-xl shadow-sm hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
          >
            Start your collection
          </Link>
          <Link 
            href="/login"
            className="flex items-center justify-center px-8 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
          >
            Sign in
          </Link>
        </div>
        
      </main>
    </div>
  );
}