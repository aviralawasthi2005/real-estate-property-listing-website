import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
    {
        conversationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Conversation',
            required: true,
            index: true,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        text: {
            type: String,
            default: '',
        },
        seen: {
            type: Boolean,
            default: false,
        },
        img: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

// Compound index for lightning-fast retrieval of messages in a thread sorted chronologically
messageSchema.index({ conversationId: 1, createdAt: 1 });

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

export default Message;
