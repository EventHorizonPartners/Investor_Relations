// deck url
// https://ehp.dev/deck?utm_source=crm&utm_medium=email&utm_campaign=investor_outreach&contact_internal_ID={{contact.id}}


// home URL
// https://ehp.dev/?utm_source=crm&utm_medium=email&utm_campaign=investor_outreach&contact_internal_ID={{contact.id}}
// FAQ url
// https://ehp.dev/faq?utm_source=crm&utm_medium=email&utm_campaign=investor_outreach&contact_internal_ID={{contact.id}}

// SAMPLE URL
//  https://ehp.dev/PitchDeck_FAQ/faq?utm_source=crm&utm_medium=email&utm_campaign=investor_outreach&email=grant.c.parkinson@gmail.com&contact_external_ID=28&deal_ID=27001951145&contact_internal_ID=27067037975&contact_name=Grant%20Parkinson&contact_phone=3609908088&deal_ID=27001951145



// sample url for contact id
// https://www.ehp.dev/?contact_internal_ID=12345
// Configuration
console.log("Script loaded");
const config = {
  apiEndpoint: 'https://bo74vxe3f3.execute-api.us-east-2.amazonaws.com/Prod', // Your API Gateway URL
  gaTrackingId: 'G-2HYX0T804J', // Your Google Analytics tracking ID
};

// Function to get URL parameters
function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// Function to update contact via API Gateway
async function updateContactViaApiGateway(contactId, tags = '') {
  if (sessionStorage.getItem('contactUpdated') === 'true') {
    console.log('Contact already updated in this session');
    return;
  }

  try {
    const response = await fetch(`${config.apiEndpoint}/update-contact?contact_internal_ID=${contactId}&tags=${tags}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Contact updated:', data);
    sessionStorage.setItem('contactUpdated', 'true');
    sessionStorage.setItem('contact_internal_ID', contactId);

    sendCustomEvent('Contact_Updated', {
      contact_id: contactId,
      update_status: 'success',
      tags: tags,
      status: status
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    sendCustomEvent('Contact_Updated', {
      contact_id: contactId,
      update_status: 'error',
      error_message: error.message,
      tags: tags,
      status: status
    });
  }
}

// New function to handle partial site visit
async function handlePartialSiteVisit(contactId) {
  if (sessionStorage.getItem('partialVisitHandled') === 'true') {
    console.log('Partial visit already handled in this session');
    return;
  }

  await updateContactViaApiGateway(contactId, 'partial_site_visit,no_login_site');
  sessionStorage.setItem('partialVisitHandled', 'true');
}

// Function to send custom events to Google Analytics
function sendCustomEvent(eventName, eventParams) {
  if (typeof gtag === 'function') {
    gtag('event', eventName, eventParams);
  } else {
    console.error('Google Analytics not loaded');
  }
}

async function handleFormSubmission(email, phone) {
  console.log('Handling form submission');
  try {
    const response = await fetch(`${config.apiEndpoint}/form-contact`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, phone }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data && data.contact_id) {
      console.log('Contact saved successfully');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userPhone', phone);
      const tags = storedEmail && storedPhone ? 'full_site_visit,existing_contact_updated' : 'full_site_visit,new_contact';

      await updateContactViaApiGateway(data.contact_id, tags);

      return { status: 'sent', message: 'Request sent successfully' };
    } else {
      console.error('Failed to save contact: Contact ID is missing');
      throw new Error('Failed to save contact: Contact ID is missing');
    }
  } catch (error) {
    console.error('Error managing contact:', error);
    throw error;
  }
}
// Main execution
document.addEventListener('DOMContentLoaded', (event) => {
  const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'contact_internal_ID'];
  const utmValues = {};

  utmParams.forEach(param => {
    const value = getParameterByName(param);
    if (value) {
      utmValues[param] = value;
    }
  });

  if (Object.keys(utmValues).length > 0) {
    // Initialize Google Analytics
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());

    gtag('config', config.gaTrackingId, {
      'custom_map': {
        'dimension3': 'contact_internal_ID',
        'dimension4': 'contact_email',
        'dimension5': 'contact_phone',
        'dimension7': 'external_internal'
      }
    });

    // Send page view event with custom dimensions
    gtag('event', 'page_view', {
      ...utmValues,
      'external_internal': utmValues.contact_internal_ID ? false : true
    });

    // Update contact if ID is present
    if (utmValues.contact_internal_ID) {
      handlePartialSiteVisit(utmValues.contact_internal_ID);
    }
  }

  // Append UTM parameters to links
  const utmString = new URLSearchParams(utmValues).toString();
  document.querySelectorAll('a').forEach(link => {
    if (utmString) {
      const separator = link.href.includes('?') ? '&' : '?';
      link.href += `${separator}${utmString}`;
    }
  });

  const userInfoModalElement = document.getElementById('userInfoModal');
  if (!userInfoModalElement) {
    console.error('Modal element not found');
    return;
  }

  const userInfoModal = new bootstrap.Modal(userInfoModalElement, {
    backdrop: 'static',
    keyboard: false
  });

  const userInfoForm = document.getElementById('userInfoForm');
  if (!userInfoForm) {
    console.error('Form element not found');
    return;
  }

  const progressBar = document.querySelector('#formProgress .progress-bar');
  const progressContainer = document.getElementById('formProgress');
  const thankYouMessage = document.getElementById('thankYouMessage');

  userInfoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Form submitted');

    const userEmail = document.getElementById('userEmail').value;
    const userPhone = document.getElementById('userPhone').value;

    if (userEmail && userPhone) {
      progressContainer.style.display = 'block';
      userInfoForm.style.display = 'none';
      progressBar.style.width = '0%';
      progressBar.setAttribute('aria-valuenow', 0);

      // Simulate progress for 500ms
      for (let i = 0; i <= 100; i += 20) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Update every 100 milliseconds
        progressBar.style.width = `${i}%`;
        progressBar.setAttribute('aria-valuenow', i);
      }

      // Show thank you message
      thankYouMessage.style.display = 'block';
      progressContainer.style.display = 'none';

      // Close modal after 1 second
      setTimeout(() => {
        const modalElement = document.getElementById('userInfoModal');
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();
      }, 1000);

      // Run the API call in the background
      handleFormSubmission(userEmail, userPhone)
        .then(result => {
          console.log('Form submission result:', result);
          const contactId = sessionStorage.getItem('contact_internal_ID');
          if (contactId) {
            updateContactViaApiGateway(contactId, 'full_site_visit', 'logged_in');
          }
        })
        .catch(error => {
          console.error('Error handling form submission:', error);
          alert('An error occurred. Please try again.');
        });
    } else {
      alert('You must enter your email and phone to proceed.');
    }
  });

  // Check if the user needs to input email and phone
  if (!localStorage.getItem('contact_internal_ID') && (!localStorage.getItem('userEmail') || !localStorage.getItem('userPhone'))) {
    console.log('Showing modal because user info is missing');
    userInfoModal.show();
  } else {
    console.log('User info already present');
  }




  // Select the elements
  const calendlyNav = document.getElementById('calendly-nav');
  const calendlyWelcomeBtn = document.getElementById('calendly-welcome-btn');

  // Define the event handler function
  const handleClick = async (elementId) => {
    const contactId = sessionStorage.getItem('contact_internal_ID');
    if (contactId) {

      await updateContactViaApiGateway(contactId, 'calendly_clicked');
    }
  };

  // Add event listeners
  if (calendlyNav) {
    calendlyNav.addEventListener('click', () => handleClick('calendly-nav'));
    console.log('calendly-nav event listener added');
  }

  if (calendlyWelcomeBtn) {
    calendlyWelcomeBtn.addEventListener('click', () => handleClick('calendly-welcome-btn'));
    console.log('calendly-welcome-btn event listener added');
  }
});


// Navbar scroll behavior (unchanged)
// ... (keep the existing navbar scroll code here)

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