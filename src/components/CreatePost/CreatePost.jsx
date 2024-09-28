import React, { useState } from 'react';
import { useShallow } from 'zustand/react/shallow'
import { toast } from 'sonner';
import { useStore } from '../../store'
import './CreatePost.css';

export const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const { user } = useStore(
        useShallow((state) => ({
            user: state.user,
        }))
    );


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            console.error('User is not logged in.');
            return;
        }

        const postId = crypto.randomUUID();

        const domain = user.email.split('@')[1];

        const postData = {
            postId,
            username: user.username,
            title,
            body,
            college: domain,
        };

        try {
            const response = await fetch('http://localhost:5001/create-post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            if (response.ok) {
                setTitle('');
                setBody('');
                toast('Post created successfully.');
            } else {
                console.error('Failed to create post.');
            }
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Body</label>
                <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                ></textarea>
            </div>
            <button type="submit">Create Post</button>
        </form>
    );
};
