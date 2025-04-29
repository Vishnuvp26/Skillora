const NoResultsFound = () => {
    return (
        <div className="px-6 py-16 sm:p-24 mt-10 flex flex-col items-center text-center bg-white dark:bg-gray-950 rounded-xl shadow-sm">
            <p className="text-lg sm:text-xl font-medium text-gray-800 dark:text-gray-200">
                No Results Found
            </p>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
                Try adjusting your search or filter criteria
            </p>
        </div>
    )
};

export default NoResultsFound;