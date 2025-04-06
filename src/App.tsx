import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ImageUploadGallery from "./components/ImageUploadGallery";
import ImagePreviewPage from "./components/ImagePreviewPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ImageUploadGallery />} />
        <Route path="/preview/:id" element={<ImagePreviewPage />} />
      </Routes>
    </Router>
  );
}
