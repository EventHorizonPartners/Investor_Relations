- adding content to Deck page 
  - pdf to jpeg converter 
    - https://smallpdf.com/pdf-to-jpg
  - jpeg compressor
    - https://tinyjpg.com/
  - upload to compressed folder in assets/deck
  - update img.src = `assets/deck/compressed/EventHorizon_Presentation_LP-images-${i}.jpg`; as necessary in inline JS
  - make sure path {i} corresponds to correct page # of deck



- adding content to FAQ page
  - adjust h1's per accordion
  - adjust <ul>/<li> as necessary
  - leave classes and ids the same
- paste into ChatGPT if more needs to be done formatting-wise
  - prompt: I have this faq markdown page that I have formatted using Bootstrap 5.3.3, I would like you to only update this code with the new text content I provided for you.

- css we want to keep the same

  .faq-container h1, .accordion-button {
  color: rgb(233, 107, 5);
}

.accordion-button {
  background-color: #444; /* Slightly darker grey for the button background */
  color: rgb(233, 107, 5); /* Orange color for the text */
}

.accordion-button:focus {
  box-shadow: none; /* Remove default focus shadow */
}

.accordion-button:not(.collapsed) {
  background-color: #444; /* Orange color for expanded state */
  color: rgb(233, 107, 5); /* Darker text color for better contrast in expanded state */
}

.accordion-button:hover {
  background-color: rgb(233, 107, 5); /* Brighter orange on hover */
  color: #fff; /* White text on hover for better visibility */
}

.accordion-body {
  padding-left: 20px; /* Indent the text */
  color: #f5f5f5; /* Ensure body text is light for readability */
  background-color: #333; /* Match container background */
}
