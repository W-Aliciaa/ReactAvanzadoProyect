"use client";

import { useOptimistic, useState, useTransition } from "react";
import { likeProject } from "../dashboard/actions";

type LikeButtonProps = {
  projectId: number;
  likes: number;
};

export function LikeButton({
  projectId,
  likes: initialLikes,
}: LikeButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    initialLikes, // Estado Real (Source of Truth)
    (state: number, newLike: number) => state + newLike, // Reducer
  );

  return (
    <div className="grid w-fit gap-1">
      <button
        disabled={isPending}
        onClick={() => {
          setMessage("");
          startTransition(async () => {
            addOptimisticLike(1);
            const result = await likeProject(projectId);

            if (!result.ok) {
              setMessage(`${result.code}: ${result.message}`);
            }
          });
        }}
        type="button"
      >
        ♥ {optimisticLikes}
      </button>
      <span aria-live="polite" className="text-xs text-muted-foreground">
        {message}
      </span>
    </div>
  );
}
