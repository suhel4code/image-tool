import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import ImageUpload from "./ImageUpload";
import { Link } from "react-router-dom";
import { nanoid } from "nanoid";
import Grid from "@mui/material/Grid";

const LOCAL_STORAGE_KEY = "uploaded_images";

type UploadedImage = {
  id: string;
  dataUrl: string;
};

export default function ImageUploadGallery() {
  const [images, setImages] = useState<UploadedImage[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      setImages(JSON.parse(stored));
    }
  }, []);

  function handleImageUpload(dataUrl: string) {
    // console.log("data url is ", dataUrl);
    const newImage: UploadedImage = {
      id: nanoid(),
      dataUrl,
    };
    const newImages = [...images, newImage];
    setImages(newImages);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newImages));
  }

  return (
    <Box mx="auto">
      <Typography variant="h4" mb={3} textAlign="center">
        Image Gallery
      </Typography>

      <ImageUpload onImageUpload={handleImageUpload} />
      <Box sx={{ flexGrow: 1, mt: 2 }}>
        <Grid container spacing={2}>
          {images.map((img) => {
            return (
              <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3 }}>
                <Link to={`/preview/${img.id}`}>
                  <img
                    src={img.dataUrl}
                    alt={`uploaded-${img.id}`}
                    loading="lazy"
                    style={{
                      borderRadius: 8,
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                    onClick={() => console.log("image clicked")}
                  />
                </Link>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
}
