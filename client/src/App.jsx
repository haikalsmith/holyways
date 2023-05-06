import { Routes, Route, useNavigate } from "react-router-dom"
import { useEffect, useState, useContext } from "react"

import DetailDonate from './components/DetailDonate'
import FormFund from './components/FormFund'
import Home from './components/Home'
import Navbar from './components/Navbar'
import Profile from './components/Profile'
import RaiseFund from './components/RaiseFund'
import ViewFund from './components/ViewFund'

import { UserContext } from "./context/UserContext"
import { API, setAuthToken } from "./config/Api"
import { PrivateRouteLogin } from "./auth/PrivateRoute"

function App() {
  const [state, dispatch] = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true)

  let navigate = useNavigate()

  useEffect(() =>{
    // Redirect Auth but just when isLoading is false
    if (!isLoading) {
      if (state.isLogin === false) {
        navigate("/")
      }
    }
  }, [isLoading])

  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token)
      checkUser()
    } else {
      setIsLoading(false)
    }
  }, [])

  const checkUser = async () => {
    try {
      const response = await API.get('/check-auth')
      console.log("check user succes", response)
      // get user data
      let payload = response.data.data
      // get token from localstorage
      payload.token = localStorage.token
      // send data to user context
      dispatch({
        type: 'USER_SUCCESS',
        payload,
      })
      setIsLoading(false)
    } catch(error) {
      console.log("check user failed: ", error)
      dispatch({
        type: 'AUTH_ERROR',
      })
      setIsLoading(false)
    }
  }

  return (
    <>
      {isLoading ? null : (
        <div className="">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />  
            <Route path="/detail-donate/:id" element={<DetailDonate />} />

            <Route element={<PrivateRouteLogin />} >
              <Route path="/profile" element={<Profile />} />
              <Route path="/raise-fund" element={<RaiseFund />} />
              <Route path="/view-fund/:id" element={<ViewFund />} />
              <Route path="/form-fund" element={<FormFund />} />
            </Route>
            
          </Routes>
        </div>
      )}
    </>
  )
}

export default App
