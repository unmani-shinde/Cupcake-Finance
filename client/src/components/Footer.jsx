// import { useState,useEffect } from "react";

function Footer() {

    const options = ["Documentation","Aptos"]

    return(
        <div style={{display: "flex", flexDirection: 'row', width: '100%', height: '15%', alignSelf: 'center', justifyContent: 'center', alignItems: 'center'}}>
    {options.map((option, index) => (
        <p className="footer-options" key={index}>{option}</p>
    ))}
</div>

    )
    
}

export default Footer;