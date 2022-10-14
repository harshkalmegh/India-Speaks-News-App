import React from 'react';

function AboutUs() {
  return (
    <div style={{margin: '60px'}}>
      <div class="about-section">
        <h1>About Us Page</h1>
        <p>It is a news plateform site</p>
      </div>

      <h2>Our Team</h2>
      <div class="row">
        <div class="column">
          <div class="card">
            <div class="container">
              <h2>Harsh Kalmegh</h2>
              <p class="title">CEO & Founder</p>
              <p>Passionate Software Developer</p>
              <p>harshkalmegh3@gmail.com</p>
              <p>
                <button class="button">Contact</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
