import './CreatePost.css'

export function CreatePost() {
    return (
        <div className='make-complaint'>
            <h2>Create a complaint</h2>
            <form>
                <div>
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        value='title'
                        onChange={() => { }}
                    />
                </div>
                <div>
                    <label htmlFor="body">Body:</label>
                    <textarea
                        id="body"
                        value='body'
                        onChange={() => { }}
                    />
                </div>
                <div>
                    <button>Create Post</button>
                </div>
            </form>
        </div>
    )
}
