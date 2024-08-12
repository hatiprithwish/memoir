// import { Note } from './models/Note';

// export const checkPermission = async (req, res, next) => {
//   try {
//     const { noteId } = req.params;
//     const username = req.headers['username'];

//     // Find the note
//     const note = await Note.findById(noteId);
//     if (!note) {
//       return res.status(404).json({ message: 'Note not found' });
//     }

//     // Find the user
//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Check permissions
//     const shareInfo = note.sharedWith.find(item => item.user.equals(user._id));
//     if (!shareInfo) {
//       return res.status(403).json({ message: 'No access to this note' });
//     }

//     req.userPermission = shareInfo.permission; // Pass permission to the request object
//     next();
//   } catch (error) {
//     console.error('Error checking permissions:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };
