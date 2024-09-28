import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns';
import { useStore } from '../../store'
import { useShallow } from 'zustand/react/shallow'
import { useModal } from '../../hooks/useModal'
import { colleges } from '../../consts/colleges';
import { Filter } from '../Filter'
import { CreatePost } from '../CreatePost'
import { Modal } from '../Modal'
import { Close } from '../Icons/Close'
import { Tooltip } from '../Tooltip';
import { parseDate } from '../../utils/parseDate'
import './Posts.css'

export function Posts() {
    const navigate = useNavigate()
    const { isModalOpen, toggleModal } = useModal();
    const [latestPosts, setLatestPosts] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [filter, setFilter] = useState('Latest')
    const { searchSelectedItem, user } = useStore(
        useShallow((state) => ({
            searchSelectedItem: state.searchSelectedItem,
            user: state.user,
        }))
    );

    useEffect(() => {
        if (!searchSelectedItem) {
            setLatestPosts([])
            return
        }

        const fetchPosts = async () => {
            const domain = colleges[searchSelectedItem];

            try {
                setLoading(true)
                const response = await fetch(`http://localhost:5001/posts/${domain}`,
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
                setLatestPosts(data)
            } catch (error) {
                setError('Failed to fetch posts')
                console.error('Error fetching posts:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchPosts()
    }, [searchSelectedItem])

    if (loading) return <p>Loading posts...</p>
    if (error) return <p>{error}</p>

    return (
        <section>
            <div className="post-header">
                <h2 className="post-headline">{filter} Posts</h2>
                <Tooltip showTooltip={!!user} message="You must be logged in to post">
                    <button
                        disabled={!user ? true : false}
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
                    latestPosts.map(post => {
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
                                </div>
                                <Link
                                    className="post-title"
                                    to={`/posts/${post.postId}`} state={{ postClicked: post }}
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
                    <Modal toggleModal={toggleModal}>
                        <CreatePost />
                    </Modal>
                )
            }
        </section >
    )
}
