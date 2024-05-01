import React from 'react'
import { FaMagnifyingGlass, FaScroll } from "react-icons/fa6";
import { BsCurrencyExchange } from "react-icons/bs";
import './Work.css';


const Work = () => {
  return (
    <section class="Work1">
        <div class="heading">
            <span>A Three-Step Guide</span>
            <h1>Empowerment Through Decentralized Funding</h1>
        </div>
        <div class="ride-container">
            <div class="box">
                <FaMagnifyingGlass class="marker"/>
                <h2>Browse Projects</h2>
                <p>Explore a curated list of innovative projects seeking funding.</p>
            </div>
            <div class="box">
                <FaScroll/>
                <h2>Participate in Governance</h2>
                <p> Vote on which projects should receive funding next.</p>
            </div>
            <div class="box">
                <BsCurrencyExchange/>
                <h2>Fund Your Favorite</h2>
                <p>Use Stablecoins or ETH to fund projects you believe in.</p>
            </div>
        </div>
    </section>
  )
}

export default Work