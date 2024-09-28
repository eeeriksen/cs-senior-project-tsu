import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow'
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner'
import { Modal } from '../Modal';
import { useModal } from '../../hooks/useModal';
import { parseDate } from '../../utils/parseDate'
import { useStore } from '../../store'
import "./PostView.css";

export function PostView() {
    const location = useLocation();
    const { postId } = useParams();
    const { user } = useStore(
        useShallow((state) => ({
            user: state.user,
        }))
    );
    const { postClicked } = location.state || {};
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { isModalOpen, toggleModal } = useModal();
    const [commentToDelete, setCommentToDelete] = useState(null);
    const [isAddingComment, setIsAddingComment] = useState(false);

    useEffect(() => {
        if (postClicked) {
            setPost(postClicked);
            setLoading(false);
            return
        }

        const fetchPost = async () => {
            try {
                const response = await fetch(`http://localhost:5001/post/${postId}`);
                if (!response.ok) throw new Error('Failed to fetch post');
                const data = await response.json();
                setPost(data[0]);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [postId]);

    useState(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch(`http://localhost:5001/posts/${postId}/comments`);
                if (!response.ok) {
                    throw new Error('Failed to fetch comments');
                }

                const data = await response.json();
                setComments(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [postId])

    const addComment = async () => {
        if (!newComment.trim()) return;

        const commentId = crypto.randomUUID();
        const commentData = { username: user.username, comment: newComment, commentId }

        try {
            setIsAddingComment(true);
            const response = await fetch(`http://localhost:5001/posts/${postId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(commentData),
            });
            if (!response.ok) throw new Error('Failed to add comment');
            const newCommentObj = await response.json();
            toast(newCommentObj.message);
            setComments([...comments, commentData]);
            setNewComment('');
            setIsAddingComment(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const deleteComment = async (commentId) => {
        try {
            const response = await fetch(`http://localhost:5001/comments/${commentId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete comment');
            setComments(comments.filter(comment => comment.commentId !== commentId));
        } catch (err) {
            setError(err.message);
        }
    };

    const deletePost = async () => {
        try {
            const response = await fetch(`http://localhost:5001/posts/${postId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete post');
            navigate('/posts');
        } catch (err) {
            setError(err.message);
        }
    };

    const openModal = (postId) => {
        setCommentToDelete(postId);
        toggleModal();
    };

    const closeModal = () => {
        toggleModal();
        setCommentToDelete(null);
    };

    const confirmDelete = () => {
        if (commentToDelete !== null) {
            handleDelete(commentToDelete);
        }
    };

    console.log(post);
    const postDate = post && parseDate(post.createdAt);
    const timeAgo = post && formatDistanceToNow(postDate, { addSuffix: true });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    if (post) return (
        <div className="post-view">
            <div className="post-data">
                <p className="username">
                    {post.username} • <span
                        title={postDate}
                        className="time"
                    >{timeAgo}</span>
                </p>
            </div>
            <p>{post.body}</p>
            {user && user.username === post.username && (
                <button onClick={deletePost}>Delete Post</button>
            )}
            <section>
                <h3>Comments</h3>
                {comments.length === 0 ? (
                    <p>No comments yet</p>
                ) : (
                    <ul>
                        {comments.map(comment => (
                            <li key={comment.commentId}>
                                <p>{comment.comment}</p>
                                <p>By: {comment.username}</p>
                                {user && user.username === comment.username && (
                                    <button onClick={() => openModal(post.postId)}>
                                        Delete
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
                {user && <div>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment"
                    />
                    <button disabled={isAddingComment} onClick={addComment}>Comment</button>
                </div>}
            </section>
            {isModalOpen && (
                <Modal toggleModal={toggleModal}>
                    <>
                        <p>Are you sure you want to delete this post?</p>
                        <button onClick={confirmDelete}>Yes, Delete</button>
                        <button onClick={toggleModal}>Cancel</button>
                    </>
                </Modal>
            )}
        </div>
    );
}
