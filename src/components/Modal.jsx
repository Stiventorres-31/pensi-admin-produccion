import React, {useEffect} from 'react';

const Modal = ({ isOpen, onClose, title, children, modal, ancho = 'full max-w-6xl' }) => {


  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50" id={modal} data-modal-backdrop="static" tabIndex="-1"  >
      <div className={`relative p-4 w-${ancho}  max-h-full overflow-y-auto`}>
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide={modal}
              onClick={onClose}
              
            >
              <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-4 md:p-5 space-y-4">
            {children}
          </div>
          <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">

            <button
              type="button"
              onClick={onClose}
              className="py-2.5 w-full md:w-1/5 px-5 md:ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              
            >
              Cancel  
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
