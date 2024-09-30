"use client";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-30">
      <div className="bg-primary-light p-4 rounded shadow-lg w-2/3 mx-auto flex flex-col justify-center">
        <button onClick={onClose} className="text-red-500 self-end">
          Close
        </button>
        <div className="mt-1 mb-4 mx-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
