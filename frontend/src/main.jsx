import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SignUpForm from './signupSeller.jsx'
import ProfileTemplate from './profileTemplate.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SignUpForm />
  </StrictMode>,
)
