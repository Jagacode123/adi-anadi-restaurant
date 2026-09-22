import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'

export default function ConfirmModal({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirm', danger = false }) {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" />
        </Transition.Child>
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
            leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
              <Dialog.Title className="text-lg font-semibold text-gray-900 mb-2">{title}</Dialog.Title>
              <p className="text-sm text-gray-600 mb-6">{message}</p>
              <div className="flex gap-3 justify-end">
                <button onClick={onClose} className="btn-secondary py-2 px-4 text-sm">Cancel</button>
                <button
                  onClick={() => { onConfirm(); onClose() }}
                  className={`${danger ? 'btn-danger' : 'btn-primary'} py-2 px-4 text-sm`}
                >
                  {confirmLabel}
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
