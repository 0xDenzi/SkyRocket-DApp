import React from 'react'
import { FaFacebook, FaGithub, FaGoogle } from "react-icons/fa";
import './footer.css'
const footer = () => {
  return (
    <div class="copyright">
        <p>&#169; Bhai-Loug all rights reserved</p>
        <div class="social">
            <FaFacebook/>
            <FaGithub/>
            <FaGoogle/>
        </div>
    </div>
  )
}

export default footer