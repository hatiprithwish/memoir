import { Note } from "../models/note.models.js";

const DEFAULT_VALUE = "kk";
const findOrCreateNote = async (documentId) => {
  if (!documentId) {
    throw new Error("documentId is required");
  }
  const existingNote = await Note.findOne({ documentId });

  if (!existingNote) {
    const newEmptyNote = await Note.create(
      {
        documentId,
        content: DEFAULT_VALUE,
      },
      { validateBeforeSave: false }
    );
    return newEmptyNote;
  }

  return existingNote;
};

export default findOrCreateNote;
