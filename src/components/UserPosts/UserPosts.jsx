import { useState, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns';
import { useStore } from '../../store'
import { useModal } from '../../hooks/useModal';
import { Modal } from '../Modal';
import { Thrash } from '../Icons/Thrash';
import { parseDate } from '../../utils/parseDate'
import '../Posts/Posts.css';
import './UserPosts.css';

export function UserPosts() {
    const { user } = useStore(
        useShallow((state) => ({
            user: state.user,
        }))
    );
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isModalOpen, toggleModal } = useModal();
    const [postToDelete, setPostToDelete] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`http://localhost:5001/user/${user.username}/posts`);
                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }
                const data = await response.json();
                setPosts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [user]);

    const handleDelete = async (postId) => {
        try {
            const response = await fetch(`http://localhost:5001/posts/${postId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete post');
            } else {
                closeModal()
            }

            setPosts(posts.filter((post) => post.postId !== postId));
        } catch (err) {
            setError(err.message);
        }
    };

    const openModal = (postId) => {
        setPostToDelete(postId);
        toggleModal();
    };

    const closeModal = () => {
        toggleModal();
        setPostToDelete(null);
    };

    const confirmDelete = () => {
        if (postToDelete !== null) {
            handleDelete(postToDelete);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <section className="user-posts">
            <div className="post-header">
                <h2 className="post-headline">Your Posts</h2>

            </div>
            {posts.length === 0 ? (
                <p>You have no posts.</p>
            ) : (
                <ul className="post-list">
                    {posts.map((post) => {
                        const postDate = parseDate(post.createdAt);
                        const timeAgo = formatDistanceToNow(postDate, { addSuffix: true });
                        return (
                            <li className="post-item" key={post.postId}>
                                <div className="post-data">
                                    <p className="username">
                                        {post.username} • <span
                                            title={postDate}
                                            className="time"
                                        >{timeAgo}</span>
                                    </p>
                                    <button className="delete-icon" onClick={() => openModal(post.postId)}><Thrash /></button>
                                </div>
                                <Link
                                    className="post-title"
                                    to={`/posts/${post.postId}`} state={{ postClicked: post }}
                                >
                                    <p>{post.title}</p>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            )}
            {isModalOpen && (
                <Modal toggleModal={toggleModal}>
                    <p>Are you sure you want to delete this post?</p>
                    <button onClick={confirmDelete}>Yes, Delete</button>
                    <button onClick={toggleModal}>Cancel</button>
                </Modal>
            )}
        </section>
    );
}
