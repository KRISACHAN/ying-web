import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 px-4">
            <div className="text-center max-w-md">
                <h1 className="text-9xl font-bold text-blue-600">404</h1>

                <div className="w-full h-0.5 bg-gray-200 my-6"></div>

                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Page Not Found
                </h2>

                <p className="text-gray-600 mb-8">
                    Sorry, the page you are looking for doesn't exist or has
                    been removed. Please check the URL you entered or return to
                    the homepage to continue browsing.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg flex items-center justify-center"
                    >
                        <i className="fas fa-home mr-2"></i>
                        Back to Home
                    </Link>
                </div>
            </div>

            <div className="mt-16 text-gray-500 text-sm">
                <p>
                    © {new Date().getFullYear()} Kris Chen. All rights
                    reserved.
                </p>
            </div>
        </div>
    );
}
