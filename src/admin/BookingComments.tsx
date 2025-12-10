import { useState, useEffect } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAdminLang } from './AdminLanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface Comment {
  id: string;
  user_email: string;
  comment: string;
  created_at: string;
  updated_at: string;
}

interface BookingCommentsProps {
  bookingId: string;
}

export function BookingComments({ bookingId }: BookingCommentsProps) {
  const { t } = useAdminLang();
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [bookingId]);

  async function fetchComments() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('booking_comments')
        .select('*')
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handlePostComment(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setPosting(true);
    try {
      console.log('Posting comment with user:', {
        userId: user.id,
        email: user.email,
        bookingId
      });

      const { data, error } = await supabase.from('booking_comments').insert({
        booking_id: bookingId,
        user_id: user.id,
        user_email: user.email || 'unknown',
        comment: newComment.trim(),
      }).select();

      if (error) {
        console.error('Supabase error details:', error);
        alert(`Failed to post comment: ${error.message}\nCode: ${error.code}\nDetails: ${error.details}`);
        throw error;
      }

      console.log('Comment posted successfully:', data);
      setNewComment('');
      await fetchComments();
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setPosting(false);
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5 text-slate-600" />
        <h3 className="font-semibold text-slate-900">{t.comments}</h3>
        <span className="text-sm text-slate-500">({comments.length})</span>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-slate-500 text-center py-8">{t.noComments}</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-slate-50 rounded-lg p-4 border border-slate-200"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      {comment.user_email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {comment.user_email}
                    </p>
                    <p className="text-xs text-slate-500">{formatDate(comment.created_at)}</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-700 whitespace-pre-wrap">{comment.comment}</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handlePostComment} className="border-t border-slate-200 pt-4">
        <div className="flex gap-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={t.writeComment}
            rows={3}
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={posting}
          />
        </div>
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={posting || !newComment.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            {posting ? t.posting : t.postComment}
          </button>
        </div>
      </form>
    </div>
  );
}
