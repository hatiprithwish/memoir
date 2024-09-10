export const handleNotePublish = async (noteId, publishStatus) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}note?noteId=${noteId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isPublic: !publishStatus }),
      }
    );
    const data = await response.json();

    return data.publishStatus;
  } catch (error) {
    console.error("Error publishing note:", error.message);
  }
};
