import React from 'react';
import './Footer.css';  
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import PinterestIcon from '@mui/icons-material/Pinterest';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-left">
        <p>
          <span href="#">Cookie Policy</span> - <span href="#">Legal Notice</span>
        </p>
      </div>
      <div className="footer-center" style={{marginLeft:"19%"}}>
        <p>Copyright © 2021. Made with ♥ from seopossible</p>
      </div>
      <div className="footer-right">
        <a href="#"><FacebookIcon /></a>
        <a href="#"><InstagramIcon /></a>
        <a href="#"><TwitterIcon /></a>
        <a href="#"><PinterestIcon /></a>
      </div>
    </footer>
  );
};

export default Footer;
