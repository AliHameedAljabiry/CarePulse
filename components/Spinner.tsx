import React from 'react'

const Spinner = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
        <span className="inline-block w-10 h-10 border-4 border-t-transparent border-gray-300 dark:border-gray-600 dark:border-t-transparent rounded-full animate-spin"></span>
    </div>
  
  )
}

export default Spinner