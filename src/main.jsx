import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import Home from './pages/Home.jsx'
import AddExpense from './pages/AddExpense.jsx'
import ExpenseList from './pages/ExpenseList.jsx'
import { Provider } from 'react-redux'
import { List } from './List/index.js'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    children: [
      {
        path: '/',
        element: <Home/> 
      },
      {
        path: '/add',
        element: <AddExpense/>
      },
      {
        path: '/list',
        element: <ExpenseList/>
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
<RouterProvider router={router}><Outlet/></RouterProvider>
)
