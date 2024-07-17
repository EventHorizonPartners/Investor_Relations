---
layout: default
title: Home
---
<!-- Welcome Banner -->
<div class="container mt-4">
  <div class="welcome-banner">
      <img src="{{ site.baseurl }}/assets/images/EventHorizon_white_textOnly.png" alt="EHP Logo" class="img-fluid">
      <p class="lead mt-3">Welcome to our site! We're glad you're here. We are dedicated to providing you with the best investment opportunities. Explore our deck and FAQ pages to learn more about our strategies and performance.</p>
      <!-- Schedule Meeting Button and Via Calendly Text -->
      <div class="text-center mt-4">
        <a href="https://calendly.com/roger-parkinson-ehp/30min" class="btn btn-custom" id="calendly-welcome-btn">Schedule a Meeting</a>
      </div>
    </div>
  <div class="row">
    <div class="col-md-6">
      <div class="card mb-4 text-white" style="background-image: url('{{ site.baseurl }}/assets/images/deck_preview.png'); height: 500px; background-size: cover; background-position: center;">
        <div class="card-img-overlay d-flex flex-column justify-content-center">
          <h5 class="card-title text-center">Deck</h5>
          <p class="card-text text-center">View our presentation deck for detailed information.</p>
          <div class="text-center">
            <a href="{{ site.baseurl }}/deck" class="btn btn-custom card-link">Go to Deck</a>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-6">
      <div class="card mb-4 text-white" style="background-image: url('{{ site.baseurl }}/assets/images/FAQ_preview.png'); height: 500px; background-size: cover; background-position: center;">
        <div class="card-img-overlay d-flex flex-column justify-content-center">
          <h5 class="card-title text-center">FAQ</h5>
          <p class="card-text text-center">Find answers to common questions about our fund.</p>
          <div class="text-center">
            <a href="{{ site.baseurl }}/faq" class="btn btn-custom">Go to FAQ</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
