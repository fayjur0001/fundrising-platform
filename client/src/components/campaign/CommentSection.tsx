// src/components/campaign/CommentSection.tsx
'use client'

import React, { useState } from 'react'
import type { Comment } from '@/lib/mockData'
import { mockComments } from '@/lib/mockData'
import { timeAgo } from '@/lib/utils'
import Button from '@/components/ui/button'
import EmptyState from '@/components/common/EmptyState'
import { MessageCircle } from 'lucide-react'

interface CommentSectionProps {
  campaignId: string
  comments?: Comment[]
}

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

const COLORS = [
  'bg-emerald-100 text-emerald-700',
  'bg-blue-100 text-blue-700',
  'bg-violet-100 text-violet-700',
  'bg-amber-100 text-amber-700',
]

export default function CommentSection({ campaignId, comments: commentsProp }: CommentSectionProps) {
  const baseComments = commentsProp ?? mockComments.filter((c) => c.campaignId === campaignId)
  const [comments, setComments] = useState<Comment[]>(baseComments)
  const [text, setText] = useState('')
  const [isPosting, setIsPosting] = useState(false)

  async function handlePost() {
    if (!text.trim()) return
    setIsPosting(true)
    await new Promise((res) => setTimeout(res, 600))
    const newComment: Comment = {
      id: `comment-new-${Date.now()}`,
      userId: 'user-004',
      userName: 'Nusrat Jahan',
      campaignId,
      content: text.trim(),
      createdAt: new Date().toISOString(),
    }
    setComments((prev) => [newComment, ...prev])
    setText('')
    setIsPosting(false)
  }

  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-base font-semibold text-slate-900">
        Comments <span className="text-slate-400 font-normal text-sm">({comments.length})</span>
      </h3>

      {/* Add comment */}
      <div className="flex flex-col gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment of support..."
          rows={3}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none w-full"
        />
        <div className="flex justify-end">
          <Button
            variant="primary"
            size="sm"
            isLoading={isPosting}
            disabled={!text.trim()}
            onClick={handlePost}
          >
            Post Comment
          </Button>
        </div>
      </div>

      {/* Comment list */}
      {comments.length === 0 ? (
        <EmptyState
          icon={<MessageCircle size={40} />}
          title="No comments yet"
          description="Be the first to leave a message of support!"
        />
      ) : (
        <div className="flex flex-col gap-4">
          {comments.map((comment, i) => (
            <div key={comment.id} className="flex gap-3">
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold ${
                  COLORS[i % COLORS.length]
                }`}
              >
                {getInitials(comment.userName)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-slate-900">{comment.userName}</span>
                  <span className="text-xs text-slate-400">{timeAgo(comment.createdAt)}</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}