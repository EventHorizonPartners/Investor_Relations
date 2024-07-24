---
layout: default
title: Deck
permalink: /deck
---
<div class="container mt-4">
  <div class="deck-container" id="deck-container"> 
  <!-- Full viewport height -->
  </div>
</div>

<script>
  document.addEventListener('contextmenu', event => event.preventDefault()); //prevent rightclicks
  // Total number of pages/images
  const totalPages = 12; // Replace with the actual number of images
  const container = document.getElementById('deck-container');

  for (let i = 0; i <= totalPages; i++) {
    const img = document.createElement('img');
    img.src = `assets/deck/compressed/EventHorizon_Presentation_LP-images-${i}.jpg`;
    img.alt = `Page ${i}`;
    img.className = 'deck-image';
    container.appendChild(img);
  }
</script>