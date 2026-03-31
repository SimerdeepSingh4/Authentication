import React from 'react'

import { router } from './app.routes'
import { RouterProvider } from 'react-router'
import { AuthProvider } from './features/auth/context/auth.context'

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App