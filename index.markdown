---
layout: default
title: EHP
---
<!-- Welcome Banner -->
<div class="container mt-4">
  <div class="welcome-banner">
    <h1 class="custom-font">
      <span class="event-horizon">EVENT HORIZON</span>
      <span class="partners">PARTNERS</span>
    </h1>
    <p>See how we use machine learning and AI to drive our automated trading systems. Browse our deck and FAQ, and schedule a call with our founder to find out if we’re a good match for your portfolio</p>
    <!-- add part here to track some metrics on calendly clicking -->
    <a href="https://calendly.com/roger-parkinson-ehp/30min" class="btn btn-custom" id="calendly-welcome-btn">Schedule a Meeting</a>
  </div>

  <div class="row row-cols-1 row-cols-md-2 g-4 mt-4">
    <div class="col">
      <div class="card text-white" style="background-image: url('{{ site.baseurl }}/assets/images/deck_preview.png');">
        <div class="card-img-overlay">
          <h5 class="card-title">Deck</h5>
          <p class="card-text">View our presentation deck for detailed information.</p>
          <a href="{{ site.baseurl }}/deck" class="btn btn-custom">Go to Deck</a>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card text-white" style="background-image: url('{{ site.baseurl }}/assets/images/FAQ_preview.png');">
        <div class="card-img-overlay">
          <h5 class="card-title">FAQ</h5>
          <p class="card-text">Find answers to common questions about our fund.</p>
          <a href="{{ site.baseurl }}/faq" class="btn btn-custom">Go to FAQ</a>
        </div>
      </div>
    </div>
  </div>
</div>