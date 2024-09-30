import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow'
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner'
import { Modal } from '../Modal';
import { useModal } from '../../hooks/useModal';
import { parseDate } from '../../utils/parseDate'
import { useStore } from '../../store'
import { Thrash } from '../Icons/Thrash';
import { BackArrow } from '../Icons/BackArrow';
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

    const handleBackButton = () => {
        console.log(1)
        navigate('/');
    }

    console.log(post);
    const postDate = post && parseDate(post.createdAt);
    const timeAgo = post && formatDistanceToNow(postDate, { addSuffix: true });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    if (post) return (
        <div className="post-view">
            <button className="back-button" onClick={handleBackButton}>
                <BackArrow />
            </button>
            <div className="post-data">
                <p className="username">
                    {post.username} • <span
                        title={postDate}
                        className="time"
                    >{timeAgo}</span>
                    {user && user.username === post.username && (
                        <button onClick={deletePost}>
                            <Thrash />
                        </button>
                    )}
                </p>
            </div>
            <h2 className="post-title">{post.title}</h2>
            <p className="post-body">{post.body}</p>
            <section className="comments-section">
                <h3>Comments</h3>
                {comments.length === 0 ? (
                    <p>No comments yet</p>
                ) : (
                    <ul className="comments-list">
                        {comments.map(comment => {
                            const commentDate = post && parseDate(post.createdAt);
                            const commentTimeAgo = post && formatDistanceToNow(commentDate, { addSuffix: true });

                            return (
                                <li key={comment.commentId}>
                                    <p className="comment-item">{comment.username}• <span
                                        title={postDate}
                                        className="time"
                                    >{timeAgo}</span></p>
                                    {user && user.username === comment.username && (
                                        <button
                                            className="remove-comment"
                                            onClick={() => openModal(post.postId)}
                                        >
                                            <Thrash />
                                        </button>
                                    )}
                                    <p className="comment-text">{comment.comment}</p>
                                </li>
                            )
                        })}
                    </ul>
                )}
                {user && <div>
                    <textarea
                        className="comment-input"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment"
                    />
                    <button className="post-comment" disabled={isAddingComment || newComment === ""} onClick={addComment}>Post Comment</button>
                </div>}
            </section>
            {isModalOpen && (
                <Modal toggleModal={toggleModal}>
                    <>
                        <p>Are you sure you want to delete this post?</p>
                        <div className="modal-buttons">
                            <button className="confirm-button" onClick={confirmDelete}>Yes, Delete</button>
                            <button className="post-comment" onClick={toggleModal}>Cancel</button>
                        </div>
                    </>
                </Modal>
            )}
        </div>
    );
}
