// deck url
// https://eventhorizonpartners.github.io/PitchDeck_FAQ/deck?utm_source=crm&utm_medium=email&utm_campaign=investor_outreach&contact_internal_ID={{contact.id}}


// home URL
// https://eventhorizonpartners.github.io/PitchDeck_FAQ/?utm_source=crm&utm_medium=email&utm_campaign=investor_outreach&contact_internal_ID={{contact.id}}
// FAQ url
// https://eventhorizonpartners.github.io/PitchDeck_FAQ/faq?utm_source=crm&utm_medium=email&utm_campaign=investor_outreach&contact_internal_ID={{contact.id}}

// SAMPLE URL
//  https://eventhorizonpartners.github.io/PitchDeck_FAQ/faq?utm_source=crm&utm_medium=email&utm_campaign=investor_outreach&email=grant.c.parkinson@gmail.com&contact_external_ID=28&deal_ID=27001951145&contact_internal_ID=27067037975&contact_name=Grant%20Parkinson&contact_phone=3609908088&deal_ID=27001951145


// This current flow is working lets make sure we can do it more securely before we actually link to live email template and deployment
// 
// 

// add some stuff here about having to add email/name and phone number without contact id utm parameters
// would have to change logic about how google tags are send out
// different tags for contact vs no contact
document.addEventListener('DOMContentLoaded', (event) => {
  // Function to get URL parameters
  // Function to get URL parameters
  function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  // Get UTM parameters and check if they are available
  const utm_source = getParameterByName('utm_source');
  const utm_medium = getParameterByName('utm_medium');
  const utm_campaign = getParameterByName('utm_campaign');
  const contactInternalID = getParameterByName('contact_internal_ID');
  let externalInternal = !contactInternalID;

  // Send data to Google Analytics if UTM parameters are present
  if (utm_source && utm_medium && utm_campaign && contactInternalID) {
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());

    gtag('config', 'G-2HYX0T804J', {
      'custom_map': {
        'dimension3': 'contact_internal_ID',
        'dimension4': 'contact_email',
        'dimension5': 'contact_phone',
        'dimension7': 'external_internal'
      }
    });

    gtag('event', 'page_view', {
      'contact_internal_ID': contactInternalID,
      'external_internal': externalInternal
    });
  }


  function updateContactViaZapier(contactId) {
    const zapierUpdateUrl = 'https://hooks.zapier.com/hooks/catch/19436022/22ktw5k/';
    fetch(zapierUpdateUrl + '?contact_internal_ID=' + contactId, {
      method: 'GET' // Using GET just to trigger the webhook
    })
      .then(response => response.json())
      .then(data => console.log('Contact updated:', data))
      .catch(error => console.error('Error updating contact:', error));
  }

  // Usage
  if (contactInternalID) {
    updateContactViaZapier(contactInternalID);
  }



  // Simplify UTM parameters handling for links
  const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'contact_internal_ID'];
  let utmString = utmParams.map(param => {
    const value = getParameterByName(param);
    return value ? `${param}=${value}` : '';
  }).filter(Boolean).join('&');

  // Function to append UTM parameters to links
  function appendUtmParameters(selector) {
    const links = document.querySelectorAll(selector);
    links.forEach(link => {
      if (utmString) {
        const separator = link.href.includes('?') ? '&' : '?';
        link.href += `${separator}${utmString}`;
      }
    });
  }

  // Append UTM parameters to navbar links
  appendUtmParameters('nav ul li a');

  // Append UTM parameters to cards on the homepage
  appendUtmParameters('.card-link');

  // Append UTM parameters to the navbar icon with logo
  appendUtmParameters('.navbar-brand');
  // end of DOMContentLoaded


  // Ensure user inputs email and phone before accessing the site
  // Ensure user inputs email and phone before accessing the site if contact_internal_ID is not present
  function requireEmailAndPhone() {
    const email = localStorage.getItem('userEmail');
    const phone = localStorage.getItem('userPhone');

    if (!contactInternalID && (!email || !phone)) {
      const userInfoModal = new bootstrap.Modal(document.getElementById('userInfoModal'), {
        backdrop: 'static',
        keyboard: false
      });
      userInfoModal.show();

      document.getElementById('userInfoForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const userEmail = document.getElementById('userEmail').value;
        const userPhone = document.getElementById('userPhone').value;

        if (userEmail && userPhone) {
          localStorage.setItem('userEmail', userEmail);
          localStorage.setItem('userPhone', userPhone);
          window.dataLayer = window.dataLayer || [];
          function gtag() { dataLayer.push(arguments); }
          gtag('js', new Date());

          gtag('config', 'G-2HYX0T804J', {
            'custom_map': {
              'dimension4': 'contact_email',
              'dimension5': 'contact_phone',
              'dimension7': 'external_internal'
            }
          });

          gtag('event', 'user_info', {
            'contact_email': userEmail,
            'contact_phone': userPhone,
            'external_internal': externalInternal
          });

          // login zap flow uncomment when ready
          const zapierCreateUrl = 'https://hooks.zapier.com/hooks/catch/19436022/22kz61e/';
          fetch(zapierCreateUrl + '?email=' + userEmail + '&phone=' + userPhone, {
            method: 'GET' // Using GET just to trigger the webhook
          })
            .then(response => response.json())
            .then(data => {
              console.log('New contact created:', data);
              // Proceed to hide modal and potentially refresh the page
              const modalElement = document.getElementById('userInfoModal');
              const modal = bootstrap.Modal.getInstance(modalElement);
              modal.hide();
              location.reload();
            })
            .catch(error => console.error('Error creating contact:', error));
          // Hide the modal
          const modalElement = document.getElementById('userInfoModal');
          const modal = bootstrap.Modal.getInstance(modalElement);
          modal.hide();

          // Optionally, refresh the page
          location.reload();
        } else {
          alert('You must enter your email and phone to proceed.');
        }
      });
    }
  }

  // Check if the user needs to input email and phone
  requireEmailAndPhone();

});

let lastScrollTop = 0;
let isScrolling;

const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', function () {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  // Clear our timeout throughout the scroll
  window.clearTimeout(isScrolling);

  if (scrollTop > lastScrollTop) {
    // Downscroll
    navbar.style.top = '-60px'; // Adjust based on navbar height
  } else {
    // Upscroll
    navbar.style.top = '0';
  }

  // Set a timeout to run after scrolling ends
  isScrolling = setTimeout(function () {
    // Run the onScrollStop function
    if (scrollTop > lastScrollTop) {
      navbar.style.top = '-60px'; // Adjust based on navbar height
    } else {
      navbar.style.top = '0';
    }
  }, 150); // Adjust time as needed

  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
});