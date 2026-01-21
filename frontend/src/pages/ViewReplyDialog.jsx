import { X, MessageCircle, ImageIcon } from 'lucide-react';

export function ViewReplyDialog({ reply, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl">User Reply Details</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-6 overflow-y-auto flex-1">
          {/* Reply Text */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle className="w-4 h-4 text-blue-600" />
              <label className="text-sm font-medium text-slate-700">Reply Message:</label>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-sm min-h-[120px] whitespace-pre-wrap">
              {reply.text}
            </div>
          </div>

          {/* Image Section */}
          {reply.image ? (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ImageIcon className="w-4 h-4 text-blue-600" />
                <label className="text-sm font-medium text-slate-700">Attached Image:</label>
              </div>
              <div className="bg-slate-100 rounded-xl p-4 border-2 border-slate-200">
                <img
                  src={reply.image}
                  alt="Reply attachment"
                  className="w-full max-h-[400px] object-contain rounded-lg"
                />
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ImageIcon className="w-4 h-4 text-slate-400" />
                <label className="text-sm font-medium text-slate-500">Attached Image:</label>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-8 text-center text-slate-400 text-sm">
                No image attached
              </div>
            </div>
          )}

          {/* Timestamp */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <span className="text-xs text-slate-400">Submission Details</span>
            <span className="text-sm text-slate-600 font-medium">
              {reply.timestamp}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
