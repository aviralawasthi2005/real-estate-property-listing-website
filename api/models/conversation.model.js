import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
        ],
        lastMessage: {
            text: {
                type: String,
                default: '',
            },
            sender: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            seen: {
                type: Boolean,
                default: false,
            },
        },
    },
    { timestamps: true }
);

// Indexes for fast lookup of user conversations ordered by latest activity
conversationSchema.index({ participants: 1 });
conversationSchema.index({ updatedAt: -1 });

const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema);

export default Conversation;
