const jwtUtils = require("../utils/jwtUtils")
const User = require("../models/user");

const Getchat = async (req, res) => {
    try {
        const userId = req.params.id;
        const token = await jwtUtils.extractTokenFromRequest(req);
        const decoded = await jwtUtils.verifyToken(token);
        const currentUser = decoded.userId;

        const chatHistoryWithUser = await User.findOne({
            _id: currentUser,
            'chatHistory.withUser': userId
        }).select('chatHistory')

        if (!chatHistoryWithUser || !chatHistoryWithUser.chatHistory) {
            console.log("not found")
            return res.status(404).json({ message: 'Chat history with user not found' });
        }

        const chatHistoryEntry = chatHistoryWithUser.chatHistory.find(chat => { return chat.withUser.toString() === userId });

        if (!chatHistoryEntry) {
            console.log("Chat history entry not found");
            return res.status(404).json({ message: 'Chat history with user not found' });
        }

        res.status(200).json({ message: chatHistoryEntry });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const Postchat = async ({ userId, currentUser, message }) => {
    try {
        // Find the current user to get their chat history
        const user = await User.findById(currentUser);
        const reciever = await User.findById(userId);

        // Find the chat history entry with the specified user
        let chatHistoryWithUser = user.chatHistory.find(chat => chat.withUser.toString() === userId);
        let chatHistoryWithOtherUser = reciever.chatHistory.find(chat => chat.withUser.toString() === currentUser);

        if (!chatHistoryWithUser) {
            // Create a new chat history entry if not found
            chatHistoryWithUser = {
                withUser: userId,
                messages: [
                    {
                        sender: currentUser,
                        message: message,
                        timestamp: Date.now()
                    }
                ]
            };
            user.chatHistory.push(chatHistoryWithUser);
        }
        if (!chatHistoryWithOtherUser) {
            // Create a new chat history entry if not found
            chatHistoryWithOtherUser = {
                withUser: currentUser,
                messages: [
                    {
                        sender: currentUser,
                        message: message,
                        timestamp: Date.now()
                    }
                ]
            };
            reciever.chatHistory.push(chatHistoryWithOtherUser);
        }

        // Add the new message to the chat history
        chatHistoryWithUser.messages.push({
            sender: currentUser,
            message: message,
            timestamp: Date.now()
        });
        chatHistoryWithOtherUser.messages.push({
            sender: currentUser,
            message: message,
            timestamp: Date.now()

        });

        // Save the updated user document
        await user.save();
        await reciever.save();
    } catch (error) {
        console.error("Error updating chat history:", error);
        // Handle the error, e.g., return an error response
    }
};





module.exports = { Getchat, Postchat };