'use client';

import { useState } from 'react';

interface JournalProps {
  contracts: any;
}

export function Journal({ contracts }: JournalProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Please write something in your journal');
      return;
    }

    if (content.length < 10) {
      setError('Journal entry must be at least 10 characters');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await contracts.submitJournal(content);
      setSuccess(true);
      setContent('');
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit journal');
    } finally {
      setLoading(false);
    }
  };

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const charCount = content.length;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Daily Journal</h2>
          <p className="text-gray-500">
            Express yourself and earn <span className="font-semibold text-blue-600">20 points</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Journal Textarea */}
          <div>
            <textarea
              id="journal-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="How was your day? What are you grateful for?"
              rows={12}
              className="w-full bg-gray-50 border-0 rounded-2xl px-6 py-4 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none resize-none text-lg"
            />
            <div className="flex justify-between mt-2 px-2 text-sm text-gray-400">
              <span>{wordCount} words</span>
              <span>{charCount} characters</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-center">
              <p className="text-sm text-blue-600 font-medium">
                ✓ Journal saved! +20 points & streak extended
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="w-full bg-blue-600 text-white rounded-2xl px-6 py-4 font-semibold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {loading ? 'Saving...' : 'Save Journal Entry'}
          </button>
        </form>

        {/* Writing Prompts - Collapsible */}
        <details className="mt-6 group">
          <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-2">
            <span>💡</span>
            <span>Need inspiration? Click for writing prompts</span>
            <span className="ml-auto group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <ul className="mt-3 text-sm text-gray-600 space-y-2 pl-6">
            <li>• What made you smile today?</li>
            <li>• What challenge did you overcome?</li>
            <li>• What are you grateful for right now?</li>
            <li>• How did you take care of yourself today?</li>
            <li>• What's one thing you learned about yourself?</li>
          </ul>
        </details>
      </div>
    </div>
  );
}
