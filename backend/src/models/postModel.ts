import mongoose, { Schema, Document } from 'mongoose';


const postSchema: Schema = new Schema({
    title: {
        type: String,
        required: false,
    },
    content: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: false,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    votes: {
        type: Number,
        default: 0,
    },
    coverImg: {
        type: String,
        required: false,
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: [],
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        content: {
            type: String,
            required: true,
        }, 
        username: {
            type: String,
            required: true,
        },
        coverImg: {
            type: String,
            required: false,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }],
}, {
    timestamps: true,
});

const Post = mongoose.model('Post', postSchema);

export default Post;