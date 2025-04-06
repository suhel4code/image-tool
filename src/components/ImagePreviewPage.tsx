import { useState, useRef, useEffect } from "react";
import { Box } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Users from "./Users";
import { nanoid } from "nanoid";
import AddComment from "./AddComment";
import ShowComment from "./ShowComment";

type UploadedImage = {
  id: string;
  dataUrl: string;
};

export interface Comment {
  id: string;
  imageId: string;
  user: string;
  x: number;
  y: number;
  text: string;
  parentId?: string;
  createdAt?: string;
}

const LOCAL_STORAGE_KEY = "uploaded_images";
const COMMENTS_STORAGE_KEY = "image_comments";
const values = ["Alice", "Bob", "Charlie", "David"];

export interface NewCommentInterface {
  x: number;
  y: number;
  text: string;
  position?: {
    horizontal: "left" | "right";
    vertical: "top" | "bottom";
  };
}

export default function ImagePreviewPage() {
  const [selectedUser, setSelectedUser] = useState(values[0]);
  const [image, setImage] = useState<UploadedImage | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentBox, setNewCommentBox] =
    useState<NewCommentInterface | null>(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const commentBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedImages = localStorage.getItem(LOCAL_STORAGE_KEY);
    const storedComments = localStorage.getItem(COMMENTS_STORAGE_KEY);

    if (storedImages) {
      const images: UploadedImage[] = JSON.parse(storedImages);
      const found = images.find((img) => img.id === id);
      if (found) setImage(found);
      else navigate("/");
    }

    if (storedComments && id) {
      const allComments: Comment[] = JSON.parse(storedComments);
      setComments(allComments.filter((c) => c.imageId === id));
    }
  }, [id, navigate]);

  function handleContainerClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current) return;

    const isInsideNewBox = commentBoxRef.current?.contains(e.target as Node);
    const isMarker = (e.target as HTMLElement).dataset.marker === "true";
    const isInsideComment = (e.target as HTMLElement).closest(
      "[data-comment-box]"
    );

    if (isInsideNewBox || isMarker || isInsideComment) return;

    const rect = containerRef.current.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    // Dimensions
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    const commentBoxWidth = 300;
    const commentBoxHeight = 150; // Approximate height
    const margin = 20;

    // Calculate available space
    const spaceOnRight = containerWidth - x;
    const spaceOnLeft = x;
    const spaceOnBottom = containerHeight - y;
    const spaceOnTop = y;

    // Determine horizontal position
    const horizontalPos =
      spaceOnRight > commentBoxWidth + margin ? "right" : "left";

    // Determine vertical position
    const verticalPos =
      spaceOnBottom > commentBoxHeight + margin ? "bottom" : "top";

    // Adjust position if needed
    if (horizontalPos === "left" && spaceOnLeft < commentBoxWidth + margin) {
      x = commentBoxWidth + margin;
    }
    if (verticalPos === "top" && spaceOnTop < commentBoxHeight + margin) {
      y = commentBoxHeight + margin;
    }

    setNewCommentBox({
      x,
      y,
      text: "",
      position: {
        horizontal: horizontalPos,
        vertical: verticalPos,
      },
    });
  }

  function handleAddNewComment() {
    const newComment: Comment = {
      id: nanoid(),
      imageId: id!,
      user: selectedUser,
      x: newCommentBox?.x!,
      y: newCommentBox?.y!,
      text: newCommentBox?.text.trim()!,
      createdAt: new Date().toISOString(),
    };

    console.log("new comemnt", newCommentBox, newComment);
    const updated = [...comments, newComment];
    console.log("updated comments are", updated);
    saveComments(updated);
    setNewCommentBox(null);
  }

  const saveComments = (newCommentsForCurrentImage: Comment[]) => {
    const stored = localStorage.getItem(COMMENTS_STORAGE_KEY);
    const allComments: Comment[] = stored ? JSON.parse(stored) : [];

    const updatedAllComments = [
      // Keep comments from other images
      ...allComments.filter((c) => c.imageId !== id),
      // Add updated ones for this image
      ...newCommentsForCurrentImage,
    ];

    setComments(newCommentsForCurrentImage);
    localStorage.setItem(
      COMMENTS_STORAGE_KEY,
      JSON.stringify(updatedAllComments)
    );
  };

  return (
    <Box sx={{ pt: 2, maxWidth: "1100px", maxHeight: "800px" }}>
      <Users
        values={values}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />
      <Box
        ref={containerRef}
        sx={{
          position: "relative",
          borderRadius: 2,
          width: "100%",
          height: "100%",
        }}
        onClick={handleContainerClick}
      >
        {image && (
          <img
            src={image.dataUrl}
            alt="preview"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block",
              pointerEvents: "none",
            }}
          />
        )}
        {containerRef.current &&
          comments
            .filter((c) => !c.parentId) // Only top-level comments
            .map((comment) => (
              <ShowComment
                key={comment.id}
                comment={comment}
                allComments={comments}
                setComments={setComments}
                selectedUser={selectedUser}
                isRoot={true}
                saveComments={saveComments}
              />
            ))}

        {/* New Comment */}
        {newCommentBox && containerRef.current && (
          <Box
            ref={commentBoxRef}
            sx={{
              width: "300px",
              position: "absolute",
              zIndex: 20,
              // Horizontal positioning
              left:
                newCommentBox.position?.horizontal === "right"
                  ? `${newCommentBox.x + 10}px`
                  : "auto",
              right:
                newCommentBox.position?.horizontal === "left"
                  ? `${
                      containerRef.current.clientWidth - newCommentBox.x + 10
                    }px`
                  : "auto",
              // Vertical positioning
              top:
                newCommentBox.position?.vertical === "bottom"
                  ? `${newCommentBox.y}px`
                  : "auto",
              bottom:
                newCommentBox.position?.vertical === "top"
                  ? `${containerRef.current.clientHeight - newCommentBox.y}px`
                  : "auto",
              transform:
                newCommentBox.position?.vertical === "bottom"
                  ? "translateY(-50%)"
                  : "translateY(50%)",
              transition: "opacity 0.2s, transform 0.2s",
              animation: "fadeIn 0.2s forwards",
              "@keyframes fadeIn": {
                to: { opacity: 1 },
              },
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "red",
                position: "absolute",
                // Horizontal marker position
                left:
                  newCommentBox.position?.horizontal === "right"
                    ? "-10px"
                    : "auto",
                right:
                  newCommentBox.position?.horizontal === "left"
                    ? "-10px"
                    : "auto",
                // Vertical marker position
                top:
                  newCommentBox.position?.vertical === "bottom"
                    ? "50%"
                    : "auto",
                bottom:
                  newCommentBox.position?.vertical === "top" ? "50%" : "auto",
                transform: "translateY(-50%)",
              }}
            ></div>
            <AddComment
              handleAddNewComment={handleAddNewComment}
              newCommentBox={newCommentBox}
              setNewCommentBox={setNewCommentBox}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
