import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMsal } from '@azure/msal-react'
import axios from 'axios'
import { loginRequest } from '../authConfig'

function AuthRedirect() {
  const { instance, accounts } = useMsal()
  const navigate = useNavigate()

  useEffect(() => {
    console.log('AuthRedirect mounted. Accounts:', accounts)

    if (accounts.length === 0) {
      console.log('No accounts found yet.')
      return
    }

    const account = accounts[0]
    console.log('Found account:', account)

    instance.acquireTokenSilent({
      ...loginRequest,
      account: account
    }).then(async (response) => {
      console.log('Got MS access token:', response.accessToken)
      try {
        const backendResponse = await axios.post('http://127.0.0.1:8000/users/microsoft-login', {
          token: response.accessToken
        })
        console.log('Backend responded:', backendResponse.data)
        localStorage.setItem('token', backendResponse.data.access_token)
        navigate('/dashboard')
      } catch (err) {
        console.error('Backend call failed:', err.response?.data || err.message)
      }
    }).catch((err) => {
      console.error('acquireTokenSilent failed:', err)
    })
  }, [accounts, instance, navigate])

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#888' }}>
      Signing you in...
    </div>
  )
}

export default AuthRedirect