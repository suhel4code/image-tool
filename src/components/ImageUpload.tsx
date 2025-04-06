import { Box, Button } from "@mui/material";
import { ChangeEvent } from "react";

interface Props {
  onImageUpload: (imageUrl: string) => void;
}

export default function ImageUpload({ onImageUpload }: Props) {
  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const fileInput = e.target;
    const file = fileInput.files?.[0];

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = function () {
        if (reader.result) {
          onImageUpload(reader.result as string);
          fileInput.value = "";
        }
      };
      reader.readAsDataURL(file);
    } else {
      fileInput.value = "";
    }
  }

  return (
    <Box>
      <Button variant="contained" component="label">
        Upload New Image
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handleFileChange}
        />
      </Button>
    </Box>
  );
}
