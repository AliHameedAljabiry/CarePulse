import Link from "next/link";

 export const getStatusIcon = (status: string) => {
        switch (status) {
            case 'SCHEDULED':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'PENDING':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'CANCELLED':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                );
        }
    };


export const getStatusColor = (status: string) => {
        switch (status) {
            case 'SCHEDULED':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'PENDING': 
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            case 'COMPLETED':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            default:
                return 'bg-slate-100 text-slate-800 dark:bg-green-900/30 dark:text-slate-300';
        }
    };


export const linkAnimation = (text: string, iconSrc: string, href: string) => {
    return (
        <Link
            href={`../update-patient`} 
            className="relative bg-blue-50 w-full h-full dark:bg-blue-900/20 rounded-lg px-4 py-2 group overflow-hidden hover:scale-105 transition-transform duration-900"
            >
            <div className="absolute inset-0 rounded-lg overflow-hidden">
                <div className="absolute w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-border-train opacity-100 transition-opacity duration-900 shadow-lg"></div>
            </div>
            <div className="absolute inset-0 rounded-lg overflow-hidden">
                <div className="absolute w-2 h-2 bg-gradient-to-r from-blue-500 to-lime-500 rounded-full animate-border-train1 opacity-100 transition-opacity duration-900 shadow-lg"></div>
            </div>
            <div className="absolute inset-0 rounded-lg overflow-hidden">
                <div className="absolute w-2 h-2 bg-gradient-to-r from-blue-500 to-amber-400 rounded-full animate-border-train2 opacity-100 transition-opacity duration-900 shadow-lg"></div>
            </div>
            
            <span className="relative text-sm text-blue-600 dark:text-blue-300 font-medium flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconSrc} />
                </svg>
                {text}
            </span>
        </Link>
    )
}

    