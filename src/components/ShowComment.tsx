import {
  Box,
  Tooltip,
  Typography,
  Button,
  TextField,
  Paper,
} from "@mui/material";
import { useState } from "react";
import { Comment } from "./ImagePreviewPage";
import { nanoid } from "nanoid";

interface ShowCommentProps {
  comment: Comment;
  allComments: Comment[];
  setComments: (c: Comment[]) => void;
  selectedUser: string;
  isRoot?: boolean;
  saveComments: (c: any) => void;
}

export default function ShowComment({
  comment,
  allComments,
  setComments,
  selectedUser,
  isRoot = false,
  saveComments,
}: ShowCommentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [text, setText] = useState(comment.text);
  const [replyText, setReplyText] = useState("");

  const replies = allComments.filter((c) => c.parentId === comment.id);

  const handleSaveEdit = () => {
    const updated = allComments.map((c) =>
      c.id === comment.id ? { ...c, text } : c
    );
    saveComments(updated);
    setIsEditing(false);
  };

  const handleDelete = () => {
    const toDelete = [comment.id];
    const collectReplies = (id: string) => {
      const children = allComments.filter((c) => c.parentId === id);
      children.forEach((child) => {
        toDelete.push(child.id);
        collectReplies(child.id);
      });
    };
    collectReplies(comment.id);

    const updated = allComments.filter((c) => !toDelete.includes(c.id));
    saveComments(updated);
  };

  const handleReply = () => {
    const newReply: Comment = {
      id: nanoid(),
      imageId: comment.imageId,
      user: selectedUser,
      x: comment.x,
      y: comment.y,
      text: replyText.trim(),
      parentId: comment.id,
      createdAt: new Date().toISOString(),
    };

    const updated = [...allComments, newReply];
    saveComments(updated);
    setReplyText("");
    setIsReplying(false);
  };

  return (
    <Box
      data-comment-box="true"
      sx={{
        ...(isRoot
          ? {
              position: "absolute",
              top: `${comment.y}px`,
              left: `${comment.x}px`,
              transform: "translateY(-50%)",
              zIndex: 10,
            }
          : {
              mt: 1,
              ml: 4, // indent replies
              //   maxWidth: "300px",
              //   height: "300px",
              //   overflow: "auto",
            }),
        // display: "flex",
        // flexDirection: "column",
        // alignItems: "flex-start",
      }}
    >
      {/* Marker only for root comment */}
      {isRoot && (
        <div
          data-marker="true"
          style={{
            position: "absolute",
            left: "0",
            top: "50%",
            transform: "translate(-100%, -50%)",
            width: "16px",
            height: "16px",
            backgroundColor: "blue",
            borderRadius: "50%",
            cursor: "pointer",
          }}
        />
      )}

      {/* Comment Box */}
      <Paper elevation={2} sx={{ p: 1, minWidth: 200 }}>
        <Typography variant="subtitle2">{comment.user}</Typography>

        {isEditing ? (
          <>
            <TextField
              multiline
              fullWidth
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={2}
            />
            <Box mt={1} display="flex" gap={1}>
              <Button size="small" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button
                size="small"
                variant="contained"
                disabled={!text.trim()}
                onClick={handleSaveEdit}
              >
                Save
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Typography variant="body2">{comment.text}</Typography>
            <Box mt={1} display="flex" gap={1}>
              {comment.user === selectedUser && (
                <>
                  <Button size="small" onClick={() => setIsEditing(true)}>
                    Edit
                  </Button>
                  <Button size="small" onClick={handleDelete}>
                    Delete
                  </Button>
                </>
              )}
              <Button
                size="small"
                onClick={() => setIsReplying((prev) => !prev)}
              >
                {isReplying ? "Cancel" : "Reply"}
              </Button>
            </Box>
          </>
        )}

        {isReplying && (
          <Box mt={1}>
            <TextField
              multiline
              fullWidth
              rows={2}
              placeholder="Write a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <Box mt={1} display="flex" justifyContent="flex-end">
              <Button
                size="small"
                variant="contained"
                disabled={!replyText.trim()}
                onClick={handleReply}
              >
                Reply
              </Button>
            </Box>
          </Box>
        )}
      </Paper>

      {/* Nested Replies */}
      <Box mt={1}>
        {replies.map((reply) => (
          <ShowComment
            key={reply.id}
            comment={reply}
            allComments={allComments}
            setComments={setComments}
            selectedUser={selectedUser}
            saveComments={saveComments}
          />
        ))}
      </Box>
    </Box>
  );
}
