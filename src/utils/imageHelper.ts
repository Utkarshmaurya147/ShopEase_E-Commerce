 // 1. Define your backend base URL (best kept in .env)
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  // 2. Helper function to fix the path
  export const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "/placeholder.jpg"; // Fallback
    if (imagePath.startsWith("http")) return imagePath; // If it's already a full URL
    const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    return `${BACKEND_URL}${cleanPath}`;
  };