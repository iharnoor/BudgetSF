"use client";

import { useState } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
import { Place } from "@/lib/types";

interface VoteButtonProps {
  place: Place;
}

export default function VoteButton({ place }: VoteButtonProps) {
  const { isSignedIn } = useUser();
  const [voted, setVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(place.vote_count);
  const progress = Math.min((voteCount / place.votes_needed) * 100, 100);
  const isApproved = voteCount >= place.votes_needed;

  const handleVote = async () => {
    if (voted || isApproved) return;
    setVoted(true);
    setVoteCount((prev) => prev + 1);

    // TODO: call API to persist vote
    // await fetch(`/api/places/${place.id}/vote`, { method: 'POST' });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        {!isSignedIn ? (
          <SignInButton>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-accent text-white hover:bg-accent-dark active:scale-95 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              Sign in to vote
            </button>
          </SignInButton>
        ) : (
          <button
            onClick={handleVote}
            disabled={voted || isApproved}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isApproved
                ? "bg-accent text-white"
                : voted
                  ? "bg-gray-100 text-muted cursor-default"
                  : "bg-accent text-white hover:bg-accent-dark active:scale-95"
            }`}
          >
            {isApproved ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Approved!
              </>
            ) : voted ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Voted
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                Approve
              </>
            )}
          </button>
        )}
        <span className="text-sm text-muted">
          {voteCount}/{place.votes_needed}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 vote-progress-fill ${
            isApproved ? "bg-accent" : "bg-pending"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
