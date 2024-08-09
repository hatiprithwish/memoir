export const createNote = async (req, res) => {
  const { content } = req.body;
  console.log({ content });
  return res.status(200).json({ content });
};
