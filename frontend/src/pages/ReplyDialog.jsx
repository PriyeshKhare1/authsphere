import { useState, useRef } from 'react';
import { Send, ImagePlus, X, FileText } from 'lucide-react';

export function ReplyDialog({ taskId, onSubmit, onCancel }) {
  const [replyText, setReplyText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handlePdfSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedPdf(file);
    } else {
      setError('Please select a valid PDF file');
    }
  };

  const handleSubmit = () => {
    if (!replyText.trim()) {
      setError('You need to reply first');
      return;
    }

    onSubmit(taskId, replyText, selectedImage, selectedPdf);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-xl">Reply to Task</h3>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4">
          {/* Text Section (Mandatory) */}
          <div>
            <label className="text-sm mb-2 block text-slate-700">
              Reply Text <span className="text-red-500">*</span>
            </label>
            <textarea
              value={replyText}
              onChange={(e) => {
                setReplyText(e.target.value);
                setError('');
              }}
              placeholder="Enter your reply..."
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Image Upload Section (Optional) */}
          <div>
            <label className="text-sm mb-2 block text-slate-700">
              Upload Image (Optional)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-slate-300 rounded-xl px-4 py-6 text-sm hover:bg-slate-50 hover:border-blue-400 transition-all flex flex-col items-center gap-2"
            >
              <ImagePlus className="w-8 h-8 text-slate-400" />
              <span className="text-slate-600">
                {selectedImage ? selectedImage.name : 'Click to choose an image'}
              </span>
            </button>
            {selectedImage && (
              <div className="mt-3 relative">
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-xl border-2 border-slate-200"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-lg hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* PDF Upload Section (Optional) */}
          <div>
            <label className="text-sm mb-2 block text-slate-700">
              Upload PDF (Optional)
            </label>
            <input
              ref={pdfInputRef}
              type="file"
              accept=".pdf"
              onChange={handlePdfSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => pdfInputRef.current?.click()}
              className="w-full border-2 border-dashed border-slate-300 rounded-xl px-4 py-6 text-sm hover:bg-slate-50 hover:border-red-400 transition-all flex flex-col items-center gap-2"
            >
              <FileText className="w-8 h-8 text-slate-400" />
              <span className="text-slate-600">
                {selectedPdf ? selectedPdf.name : 'Click to choose a PDF'}
              </span>
            </button>
            {selectedPdf && (
              <div className="mt-3 p-3 bg-red-50 border-2 border-red-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-red-500" />
                  <span className="text-sm text-slate-700">{selectedPdf.name}</span>
                </div>
                <button
                  onClick={() => setSelectedPdf(null)}
                  className="bg-red-500 text-white p-1 rounded-lg hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border-2 border-red-300 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 text-sm border-2 border-slate-300 rounded-xl hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 text-sm bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/50 transition-all flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Submit Reply
          </button>
        </div>
      </div>
    </div>
  );
}
