import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { toast } from 'sonner'
import { useStore } from '../../store'

const apiUrl = import.meta.env.VITE_API_URL;

export const RecommendationForm = () => {
    const { user, setUser, setSearchSelectedItem } = useStore(
        useShallow((state) => ({
            user: state.user,
        }))
    );
    const [message, setMessage] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        const formData = {
            username: user.username,
            email: user.email,
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
            } else {
                toast(result.message || 'Failed to send recommendation')
            }
        } catch (error) {
            console.error('Error sending recommendation:', error)
            toast('Error sending recommendation')
        }
    }

    return (
        <form>
            <h2>Help Shape Campus Voices</h2>
            <p>We're constantly evolving to better serve our university community. What features or improvements would you like to see on our platform? Your input is valuable in making Campus Voices more effective and user-friendly.</p>
            <div className="input-group">
                <input
                    onChange={(e) => setMessage(e.target.value)}
                    type="text"
                    placeholder="Your suggestion for Campus Voices"
                />
                <button onClick={handleSubmit} className="btn primary">
                    Send Idea
                </button>
            </div>
            <p className="note">Your suggestions help us improve and adapt to the changing needs of our community. Together, we can create a more responsive and impactful platform.</p>
        </form>
    )
}
