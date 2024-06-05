import { AlojamientoContext } from "../cases/AlojamientoContext";
import { useContext } from "react";
import { IoCloseSharp } from "react-icons/io5";

const Modal = () => {
  const { messageModal } = useContext(AlojamientoContext);

  return (
    <div dir="rtl">
      <div
        id="popup-modal"
        className="hidden overflow-y-auto overflow-x-hidden absolute z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow ">
            <button
              type="button"
              onClick={() => {
                document.getElementById("popup-modal").classList.add("hidden");
              }}
              className="absolute top-3 end mr-3 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <IoCloseSharp className="text-3xl" />
              <span className="sr-only">Close modal</span>
            </button>
            <div className="p-4 md:p-5 text-center">
              <h3 className="mb-5 mt-10 text-lg font-normal text-gray-500 dark:text-gray-400">
                {messageModal}
              </h3>
              <button
                data-modal-hide="popup-modal"
                type="button"
                onClick={() => {
                  document
                    .getElementById("popup-modal")
                    .classList.add("hidden");
                }}
                className="text-white bg-pink-600 hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
