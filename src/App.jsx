import React from 'react'
import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
    Outlet,
} from 'react-router-dom'
import { Home } from './components/Home'
import { Login } from './components/Login'
import { Posts } from './components/Posts'
import { Header } from './components/Header/Header'
import { Layout } from './components/Layout/Layout'
import { SignUp } from './components/SignUp'
import { PostView } from './components/PostView'
import { CreatePost } from './components/CreatePost'
import { Account } from './components/Account'
import { NotFound } from './components/NotFound'
import { useShallow } from 'zustand/react/shallow'
import { useStore } from './store'

function ProtectedRoute({ element }) {
    const { user } = useStore(
        useShallow((state) => ({
            user: state.user,
        }))
    );
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return element;
}

export function App() {
    const { user } = useStore(
        useShallow((state) => ({
            user: state.user,
        }))
    );
    const router = createBrowserRouter([
        {
            path: '/',
            element: <Layout />,
            children: [
                { path: '/', element: <Home /> },
                { path: '/login', element: <Login /> },
                { path: '/signup', element: <SignUp /> },
                { path: '/posts/:postId', element: <PostView /> },
                { path: '/account', element: <ProtectedRoute element={<Account />} /> },
                { path: '*', element: <NotFound /> },
            ],
        },
    ]);

    return (
        <RouterProvider router={router} />
    )
}
