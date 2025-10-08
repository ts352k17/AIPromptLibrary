export const generateThumbnail = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'A server error occurred.');
    }

    const data = await response.json();
    if (!data.imageUrl) {
        throw new Error("Invalid response from server - no imageUrl found.");
    }
    return data.imageUrl;
  } catch (error) {
    console.error("Error generating thumbnail via backend service:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the image.");
  }
};
