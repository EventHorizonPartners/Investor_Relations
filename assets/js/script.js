// deck url
// https://eventhorizonpartners.github.io/PitchDeck_FAQ/deck?utm_source=crm&utm_medium=email&utm_campaign=investor_outreach&email={{contact.email}}&contact_external_ID={{contact.external_id}}&deal_ID={{deal.id}}&contact_internal_ID={{contact.id}}&contact_name={{contact.full_name}}&contact_phone={{contact.mobile_number}}&deal_ID={{deal.id}}

        // SAMPLE URL
        //
// FAQ url
// https://eventhorizonpartners.github.io/PitchDeck_FAQ/faq?utm_source=crm&utm_medium=email&utm_campaign=investor_outreach&email={{contact.email}}&contact_external_ID={{contact.external_id}}&deal_ID={{deal.id}}&contact_internal_ID={{contact.id}}&contact_name={{contact.full_name}}&contact_phone={{contact.mobile_number}}&deal_ID={{deal.id}}

 // SAMPLE URL
//  https://eventhorizonpartners.github.io/PitchDeck_FAQ/faq?utm_source=crm&utm_medium=email&utm_campaign=investor_outreach&email=grant.c.parkinson@gmail.com&contact_external_ID=28&deal_ID=27001951145&contact_internal_ID=27067037975&contact_name=Grant%20Parkinson&contact_phone=3609908088&deal_ID=27001951145


// This current flow is working lets make sure we can do it more securely before we actually link to live email template and deployment
// 
// 
document.addEventListener('DOMContentLoaded', (event) => {
  // Function to get URL parameters
  function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
          results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  // Get UTM parameters directly from the URL
  const utm_source = getParameterByName('utm_source');
  const utm_medium = getParameterByName('utm_medium');
  const utm_campaign = getParameterByName('utm_campaign');
  // Get sensitive data from URL parameters for testing
  const sensitiveData = {
    email: getParameterByName('email'), // Assuming 'email' is passed as a URL parameter
    contact_external_ID: getParameterByName('contact_external_ID'), // Assuming 'contact_external_ID' is passed as a URL parameter
    contact_internal_ID: getParameterByName('contact_internal_ID'), // Assuming 'contact_internal_ID' is passed as a URL parameter
    contact_name: getParameterByName('contact_name'), // Assuming 'contact_name' is passed as a URL parameter
    contact_phone: getParameterByName('contact_phone'), // Assuming 'contact_phone' is passed as a URL parameter
    deal_ID: getParameterByName('deal_ID') // Assuming 'deal_ID' is passed as a URL parameter
  };

  // Send data to Google Analytics (ensure GA_TRACKING_ID is replaced with your actual tracking ID)
  if (utm_source && utm_medium && utm_campaign) {
    gtag('config', 'G-2HYX0T804J', {
      'custom_map': {
        'dimension1': 'contact_email',
        'dimension2': 'contact_external_ID',
        'dimension3': 'contact_internal_ID',
        'dimension4': 'contact_name',
        'dimension5': 'contact_phone',
        'dimension6': 'deal_ID'
      }
    });

    gtag('event', 'page_view', {
      'contact_email': sensitiveData.email,
      'contact_external_ID': sensitiveData.contact_external_ID,
      'contact_internal_ID': sensitiveData.contact_internal_ID,
      'contact_name': sensitiveData.contact_name,
      'contact_phone': sensitiveData.contact_phone,
      'deal_ID': sensitiveData.deal_ID
    });
  }

  // Get UTM parameters directly from the URL
  const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'email', 'contact_external_ID', 'contact_internal_ID', 'contact_name', 'contact_phone', 'deal_ID'];
  let utmString = '';

  utmParams.forEach(param => {
    const value = getParameterByName(param);
    if (value) {
      utmString += `${param}=${value}&`;
    }
  });

  // Remove the last '&' if it exists
  utmString = utmString.slice(0, -1);

  // Append UTM parameters to navbar links
  const navLinks = document.querySelectorAll('nav ul li a');
  navLinks.forEach(link => {
    if (utmString) {
      const separator = link.href.includes('?') ? '&' : '?';
      link.href += `${separator}${utmString}`;
    }
  });

  let lastScrollTop = 0;
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
      // Downscroll code
      navbar.style.top = '-60px'; // Adjust this value based on the navbar height
    } else {
      // Upscroll code
      navbar.style.top = '0';
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
  });





  // end of DOMContentLoaded
});
