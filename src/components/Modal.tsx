interface ModalProps {
  title: string;
  content: string;
  onClose: () => void;
}

export function Modal({ title, content, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-neutral-800 p-6 rounded-lg w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-400 hover:text-white"
        >
          ✖
        </button>
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <pre className="whitespace-pre-wrap text-gray-200 text-sm">
          {content}
        </pre>
      </div>
    </div>
  );
}
