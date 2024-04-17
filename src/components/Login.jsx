import './Login.css'

// eslint-disable-next-line react/prop-types
function Login({ login, errorLogin }) {

    return (
        <div>
            <h2>LOGIN FORM</h2>
            <form>
                <label>Username</label>
                <input type="text" placeholder="Enter Username" />
                <label>Password</label>
                <input type="password" placeholder="Enter Password" />
                <button type='text'>Login</button>
                <p>Do not have an account? <a href="#">Register</a></p>
            </form>
        </div>
    )
}

export default Login