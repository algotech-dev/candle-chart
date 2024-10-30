// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';
const Home = () => {
  return (
    <>
    <div className="container py-5">
      <div className="row align-items-center">
        <div className="col-lg-6">
          <h1 className="display-4 fw-bold mb-4">Welcome to Time Line Investments</h1>
          <p className="lead mb-4">
            Unlock the power of algorithmic trading with our advanced financial technology solutions.
          </p>
          <Link to="/dashboard" className="btn btn-primary btn-lg">
            Get Started
          </Link>
        </div>
        <div className="col-lg-6">
          <div className="p-5">
            <img
              src="https://i.pinimg.com/originals/02/9e/2f/029e2f0a048bc786b024f0a8c75574b8.gif"
              alt="Trading visualization"
              className="img-fluid rounded shadow"
            />
          </div>
        </div>
      </div>

      {/* Additional Content Section */}
      <div className="row mt-5">
        <div className="col-md-4 text-center">
          <h3 className="fw-bold">Advanced Analytics</h3>
          <p>
            Leverage powerful data analytics tools to make informed trading decisions and maximize your investment potential.
          </p>
        </div>
        <div className="col-md-4 text-center">
          <h3 className="fw-bold">User-Friendly Interface</h3>
          <p>
            Enjoy an intuitive interface designed for traders of all experience levels, from beginners to seasoned professionals.
          </p>
        </div>
        <div className="col-md-4 text-center">
          <h3 className="fw-bold">24/7 Support</h3>
          <p>
            Our dedicated support team is available around the clock to assist you with any questions or issues you may have.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-5">
        <h2 className="fw-bold text-center">Key Features</h2>
        <ul className="list-unstyled mt-4">
          <li>✔️ Real-time market data and analytics</li>
          <li>✔️ Customizable trading algorithms</li>
          <li>✔️ Risk management tools</li>
          <li>✔️ Seamless integration with your trading accounts</li>
          <li>✔️ Educational resources and tutorials</li>
        </ul>
      </div>

      {/* Call to Action Section */}
      <div className="mt-5 text-center">
        <h2 className="fw-bold">Ready to Get Started?</h2>
        <p>
          Join us today and take your trading to the next level with Time Line Investments.
        </p>
        <Link to="/dashboard" className="btn btn-primary btn-lg">
          Sign Up Now
        </Link>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default Home;
