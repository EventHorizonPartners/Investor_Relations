// deck url
// https://ehp.dev/deck?utm_source=crm&utm_medium=email&utm_campaign=investor_outreach&contact_internal_ID={{contact.id}}


// home URL
// https://ehp.dev/?utm_source=crm&utm_medium=email&utm_campaign=investor_outreach&contact_internal_ID={{contact.id}}
// FAQ url
// https://ehp.dev/faq?utm_source=crm&utm_medium=email&utm_campaign=investor_outreach&contact_internal_ID={{contact.id}}

// SAMPLE URL
//  https://ehp.dev/PitchDeck_FAQ/faq?utm_source=crm&utm_medium=email&utm_campaign=investor_outreach&email=grant.c.parkinson@gmail.com&contact_external_ID=28&deal_ID=27001951145&contact_internal_ID=27067037975&contact_name=Grant%20Parkinson&contact_phone=3609908088&deal_ID=27001951145

// Configuration
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
async function updateContactViaApiGateway(contactId) {
  if (sessionStorage.getItem('contactUpdated') === 'true') {
    console.log('Contact already updated in this session');
    return;
  }

  try {
    const response = await fetch(`${config.apiEndpoint}/update-contact?contact_internal_ID=${contactId}`, {
      method: 'GET',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
        // Add any necessary API key or authorization header here
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Contact updated:', data);
    sessionStorage.setItem('contactUpdated', 'true');

    // Send custom event to Google Analytics
    sendCustomEvent('Contact_Updated', {
      contact_id: contactId,
      update_status: 'success',
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    sendCustomEvent('Contact_Updated', {
      contact_id: contactId,
      update_status: 'error',
      error_message: error.message,
    });
  }
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
  try {
    const response = await fetch(`${config.apiEndpoint}/form-contact`, {
      method: 'POST',
      mode: 'no-cors', // Reverted back to 'no-cors'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, phone }),
    });

    // Note: With 'no-cors', we can't access the response content
    console.log('Request sent successfully');
    
    // Log the response object for debugging purposes
    console.log('Response:', response);

    // Since we can't read the response, we'll just return a placeholder
    return { status: 'sent', message: 'Request sent, but response not readable due to CORS restrictions' };
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
      updateContactViaApiGateway(utmValues.contact_internal_ID);
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

  // Handle user information modal
  const userInfoModal = new bootstrap.Modal(document.getElementById('userInfoModal'), {
    backdrop: 'static',
    keyboard: false
  });
  
  document.getElementById('userInfoForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const userEmail = document.getElementById('userEmail').value;
    const userPhone = document.getElementById('userPhone').value;
  
    if (userEmail && userPhone) {
      try {
        const result = await handleFormSubmission(userEmail, userPhone);
        console.log('Form submission result:', result);
        alert(result.message);
        userInfoModal.hide(); // Hide modal on success
      } catch (error) {
        console.error('Error handling form submission:', error);
        alert('An error occurred. Please try again.');
        // userInfoModal.hide(); // Hide modal on failure
      }
    } else {
      alert('You must enter your email and phone to proceed.');
    }
  });
  // Check if the user needs to input email and phone
  if (!getParameterByName('contact_internal_ID') && (!localStorage.getItem('userEmail') || !localStorage.getItem('userPhone'))) {
    userInfoModal.show();
  }
  // adjust to work with lambda function while still keeping modal functionality
  // const userInfoModal = new bootstrap.Modal(document.getElementById('userInfoModal'), {
  //   backdrop: 'static',
  //   keyboard: false
  // });

  // document.getElementById('userInfoForm').addEventListener('submit', async (e) => {
  //   e.preventDefault();
  //   const userEmail = document.getElementById('userEmail').value;
  //   const userPhone = document.getElementById('userPhone').value;

  //   if (userEmail && userPhone) {
  //     try {
  //       const response = await fetch(`${config.apiEndpoint}/create-contact`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           // Add any necessary API key or authorization header here
  //         },
  //         body: JSON.stringify({ email: userEmail, phone: userPhone }),
  //       });

  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }

  //       const data = await response.json();
  //       console.log('New contact created:', data);

  //       // Send custom event to Google Analytics
  //       sendCustomEvent('Contact_Created', {
  //         contact_email: userEmail,
  //         contact_phone: userPhone,
  //       });

  //       // Hide the modal
  //       userInfoModal.hide();

  //       // Optionally, refresh the page
  //       location.reload();
  //     } catch (error) {
  //       console.error('Error creating contact:', error);
  //       alert('An error occurred. Please try again.');
  //     }
  //   } else {
  //     alert('You must enter your email and phone to proceed.');
  //   }
  // });

  // // Check if the user needs to input email and phone
  // if (!getParameterByName('contact_internal_ID') && (!localStorage.getItem('userEmail') || !localStorage.getItem('userPhone'))) {
  //   userInfoModal.show();
  // }
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