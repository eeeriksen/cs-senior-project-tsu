import React, { useState } from 'react';
import { useShallow } from 'zustand/react/shallow'
import { toast } from 'sonner';
import { useStore } from '../../store'
import './CreatePost.css';

const apiUrl = import.meta.env.VITE_API_URL;

export const CreatePost = ({ closeModal, updatePosts }) => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useStore(
        useShallow((state) => ({
            user: state.user,
        }))
    );

    const handleCreatePost = async (e) => {
        e.preventDefault();

        if (!user) {
            console.error('User is not logged in.');
            return;
        }

        const postId = crypto.randomUUID();

        const domain = user.domain

        const postData = {
            postId,
            username: user.username,
            title,
            body,
            domain,
        };

        try {
            setLoading(true);
            const response = await fetch(`${apiUrl}/post/create-post`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            const data = await response.json();

            if (response.ok) {
                setTitle('');
                setBody('');
                toast('Post created successfully.');
                updatePosts(data.post)
                setLoading(false);
                closeModal();
            } else {
                console.error('Failed to create post.');
            }
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    return (
        <form className="create-post-form" onSubmit={handleCreatePost}>
            <div>
                <label>Title</label>
                <input
                    type="text"
                    name="post-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Body</label>
                <textarea
                    value={body}
                    name="post-body"
                    onChange={(e) => setBody(e.target.value)}
                    required
                ></textarea>
            </div>
            <button disabled={loading} className="submit-button" type="submit">Post</button>
        </form>
    );
};
