import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns';
import { useStore } from '../../store'
import { useShallow } from 'zustand/react/shallow'
import { useModal } from '../../hooks/useModal'
import { emailByCollege } from '../../consts/emailByCollege';
import { Filter } from '../Filter'
import { CreatePost } from '../CreatePost'
import { Modal } from '../Modal'
import { Close, Thrash, Refresh } from '../Icons'
import { Tooltip } from '../Tooltip';
import { parseDate } from '../../utils/parseDate'
import './Posts.css'

const apiUrl = import.meta.env.VITE_API_URL;

export function Posts() {
    const navigate = useNavigate()
    const { isModalOpen, toggleModal } = useModal();
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [filter, setFilter] = useState('Latest')
    const [postToDelete, setPostToDelete] = useState(null);
    const {
        searchSelectedItem,
        setSearchSelectedItem,
        user,
        posts,
        setPosts,
        globalPosts,
        setUniversityPosts,
    } = useStore(
        useShallow((state) => ({
            searchSelectedItem: state.searchSelectedItem,
            setSearchSelectedItem: state.setSearchSelectedItem,
            user: state.user,
            posts: state.posts,
            setPosts: state.setPosts,
            globalPosts: state.globalPosts,
            setUniversityPosts: state.setUniversityPosts,
        }))
    );

    const userDomain = user.domain
    const selectedUserDomain = emailByCollege[searchSelectedItem];

    const fetchPosts = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${apiUrl}/post/domain/${selectedUserDomain}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }

            const data = await response.json()

            setUniversityPosts(selectedUserDomain, data);
            setPosts(data)
        } catch (error) {
            setError('Failed to fetch posts')
            setSearchSelectedItem(null)
            console.error('Error fetching posts:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!searchSelectedItem || posts.length > 0) {
            return
        }

        if (globalPosts[selectedUserDomain]) {
            setPosts(globalPosts[selectedUserDomain])
            return
        }

        fetchPosts()
    }, [searchSelectedItem])

    const handleDelete = async (postId) => {
        try {
            const response = await fetch(`${apiUrl}/post/${postId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete post');
            } else {
                closeDeletePostModal()
            }

            setPosts(posts.filter((post) => post.postId !== postId));
        } catch (err) {
            setError(err.message);
        }
    };

    const openDeletePostModal = (postId) => {
        setPostToDelete(postId);
        toggleModal();
    };

    const closeDeletePostModal = () => {
        toggleModal();
        setPostToDelete(null);
    };

    const confirmDelete = () => {
        if (postToDelete !== null) {
            handleDelete(postToDelete);
        }
    };

    const updatePosts = (newPost) => {
        setPosts([newPost, ...posts]);
    }

    const refreshPosts = () => {
        if (searchSelectedItem) {
            fetchPosts();
        }
    }

    const tooltipMessage = !user
        ? 'You must be logged in to post'
        : userDomain !== selectedUserDomain && 'You can only post in your college';

    const isNewPostDisabled = !user
        ? true
        : userDomain !== selectedUserDomain ? true : false;

    const modalContent = !postToDelete ? (
        <CreatePost closeModal={toggleModal} updatePosts={updatePosts} />
    ) : (
        <div className="delete-post-modal">
            <h2>Delete Post</h2>
            <p>Are you sure you want to delete this post?</p>
            <div className="modal-buttons">
                <button className="confirm-button" onClick={() => confirmDelete()}>Yes, Delete</button>
                <button className="post-comment" onClick={() => closeDeletePostModal()}>Cancel</button>
            </div>
        </div>
    );

    const sortedPosts = filter === 'Popular'
        ? [...posts].sort((a, b) => b.commentCount - a.commentCount)
        : filter === "Mine"
            ? [...posts].filter(post => post.username === user.username)
            : posts

    if (loading) return <p>Loading posts...</p>
    if (error) return <p>{error}</p>

    return (
        <section className="posts-section">
            <div className="post-header">
                <h2 className="post-headline">
                    {filter === 'Mine' ? 'My' : filter} Posts
                    <button title="Get latest posts" onClick={refreshPosts}>
                        <Refresh />
                    </button>
                </h2>
                <Tooltip
                    showTooltip={isNewPostDisabled}
                    message={tooltipMessage}
                >
                    <button
                        disabled={isNewPostDisabled}
                        className="new-post"
                        onClick={toggleModal}
                    >
                        New Post
                    </button>
                </Tooltip>
            </div>
            <Filter setFilter={setFilter} />
            <ul className="post-list">
                {
                    sortedPosts.length === 0 ? (
                        <p>No posts yet</p>
                    ) : sortedPosts.map(post => {
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
                                    {user && user.username === post.username && (
                                        <button
                                            className="delete-icon"
                                            onClick={() => openDeletePostModal(post.postId)}
                                        >
                                            <Thrash />
                                        </button>
                                    )}
                                </div>
                                <Link
                                    className="post-title"
                                    to={`/posts/${post.postId}`}
                                >
                                    <p>{post.title}</p>
                                </Link>
                            </li>
                        )
                    })
                }
            </ul>

            {
                isModalOpen && (
                    <Modal toggleModal={closeDeletePostModal}>
                        {modalContent}
                    </Modal>
                )
            }
        </section >
    )
}
