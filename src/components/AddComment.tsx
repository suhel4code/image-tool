import { Box, Button, Paper, TextField } from "@mui/material";
import { NewCommentInterface } from "./ImagePreviewPage";

interface AddCommentProps {
  newCommentBox: NewCommentInterface;
  setNewCommentBox: (val: NewCommentInterface | null) => void;
  handleAddNewComment: () => void;
}

export default function AddComment(props: AddCommentProps) {
  const { newCommentBox, setNewCommentBox, handleAddNewComment } = props;
  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <TextField
        fullWidth
        multiline
        placeholder="Add comment..."
        rows={3}
        value={newCommentBox.text}
        onChange={(e) =>
          setNewCommentBox({ ...newCommentBox, text: e.target.value })
        }
      />
      <Box mt={1} display="flex" justifyContent="space-between">
        <Button onClick={() => setNewCommentBox(null)}>Cancel</Button>
        <Button
          variant="contained"
          disabled={!newCommentBox.text.trim()}
          onClick={handleAddNewComment}
        >
          Save
        </Button>
      </Box>
    </Paper>
  );
}
