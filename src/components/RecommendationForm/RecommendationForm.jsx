import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { toast } from 'sonner'
import { useStore } from '../../store'
import './RecommendationForm.css'

const apiUrl = import.meta.env.VITE_API_URL;

export const RecommendationForm = () => {
    const [loading, setLoading] = useState(false)
    const { user, setUser, setSearchSelectedItem } = useStore(
        useShallow((state) => ({
            user: state.user,
        }))
    );
    const [message, setMessage] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        const formData = {
            username: user.username,
            message,
        }

        try {
            const response = await fetch(`${apiUrl}/send-recommendation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            const result = await response.json()

            if (response.ok) {
                toast('Recommendation sent successfully!')
                setMessage('')
            } else {
                toast(result.message || 'Failed to send recommendation')
            }
        } catch (error) {
            console.error('Error sending recommendation:', error)
            toast('Error sending recommendation')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form>
            <h2>Help Shape Campus Voices</h2>
            <p>We're constantly evolving to better serve university communities. What features or improvements would you like to see on the platform? Your input is valuable in making Campus Voices more effective and user-friendly.</p>
            <div className="input-group">
                <textarea
                    onChange={(e) => setMessage(e.target.value)}
                    type="text"
                    value={message}
                    placeholder="Your suggestion for Campus Voices"
                />
                <button disabled={loading} onClick={handleSubmit} className="idea-button">
                    Send Idea
                </button>
            </div>
        </form>
    )
}
