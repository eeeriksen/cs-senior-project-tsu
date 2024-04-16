import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'
import { CreatePost } from './components/CreatePost'
import { Home } from './components/Home'
import React from 'react'
import './App.css'

function App() {
  const router = createBrowserRouter([
    { path: '/', element: <Home /> },
    { path: '/create-post', element: <CreatePost /> },
  ])

  return (
    <>
      <React.StrictMode>
        <RouterProvider router={router}></RouterProvider>
      </React.StrictMode>
    </>
  )
}

export default App
