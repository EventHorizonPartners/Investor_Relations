---
layout: default
title: EHP
---
<!-- Welcome Banner -->
<div class="container mt-4">
  <div class="welcome-banner">
    <h1 class="custom-font">EVENT HORIZON PARTNERS</h1>
    <p>Welcome to our site! We're glad you're here. We are dedicated to providing you with the best investment opportunities. Explore our deck and FAQ pages to learn more about our strategies and performance.</p>
    <!-- add part here to track some metrics on calendly clicking -->
    <a href="https://calendly.com/roger-parkinson-ehp/30min" class="btn btn-custom" id="calendly-welcome-btn">Schedule a Meeting</a>
  </div>

  <div class="row row-cols-1 row-cols-md-2 g-4 mt-4">
    <div class="col">
      <div class="card text-white" style="background-image: url('{{ site.baseurl }}/assets/images/deck_preview.png');">
        <div class="card-img-overlay">
          <h5 class="card-title"></h5>
          <p class="card-text">View our presentation deck for detailed information.</p>
          <a href="{{ site.baseurl }}/deck" class="btn btn-custom">Go to Deck</a>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card text-white" style="background-image: url('{{ site.baseurl }}/assets/images/FAQ_preview.png');">
        <div class="card-img-overlay">
          <h5 class="card-title"></h5>
          <p class="card-text">Find answers to common questions about our fund.</p>
          <a href="{{ site.baseurl }}/faq" class="btn btn-custom">Go to FAQ</a>
        </div>
      </div>
    </div>
  </div>
</div>