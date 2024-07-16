// To better protect sensitive information while still sending data to Google Analytics, you can modify the approach to avoid exposing sensitive data directly in the URL. Here’s a refined method that ensures sensitive information is handled more securely:

// ### Step 1: Simplified URL

// Only include non-sensitive UTM parameters in the URL. This way, sensitive information like email and IDs are not exposed in the URL.

// Example:
// ```html
// https://eventhorizonpartners.github.io/PitchDeck_FAQ/deck?utm_source=crm&utm_medium=email&utm_campaign=investor_outreach
// ```

// ### Step 2: Email Template

// Modify your Freshsales email template to include non-sensitive UTM parameters:
// ```html
// <a href="https://eventhorizonpartners.github.io/PitchDeck_FAQ/deck?utm_source=crm&utm_medium=email&utm_campaign=investor_outreach&name={{contact.name}}">
//   Visit Our Deck
// </a>
// ```

// ### Step 3: Using Post-Load JavaScript to Send Sensitive Data

// Use JavaScript to securely send sensitive data to Google Analytics after the page loads.

// 1. **Add the JavaScript code to your GitHub Pages site**:
//    - Create a separate file (e.g., `track.js`) and include it in your HTML.
//    - This script will fetch sensitive data from a secure source and send it to Google Analytics.

// Here’s an example of how you can do this:

// ```html
// <script>
//   document.addEventListener('DOMContentLoaded', (event) => {
//     // Function to get URL parameters
//     function getParameterByName(name, url) {
//       if (!url) url = window.location.href;
//       name = name.replace(/[\[\]]/g, '\\$&');
//       var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
//           results = regex.exec(url);
//       if (!results) return null;
//       if (!results[2]) return '';
//       return decodeURIComponent(results[2].replace(/\+/g, ' '));
//     }

//     // Get non-sensitive UTM parameters
//     var utm_source = getParameterByName('utm_source');
//     var utm_medium = getParameterByName('utm_medium');
//     var utm_campaign = getParameterByName('utm_campaign');

//     // Simulate fetching sensitive data securely (you should replace this part with your secure data fetching mechanism)
//     // For example, an API call that fetches sensitive data based on a secure token stored in session or local storage.
//     var sensitiveData = {
//       email: "example@example.com", // Fetch this securely
//       external_id: "123456",        // Fetch this securely
//       deal_id: "78910",             // Fetch this securely
//       contact_internal_id: "11213"  // Fetch this securely
//     };

//     // Send data to Google Analytics
//     if (utm_source && utm_medium && utm_campaign) {
//       gtag('config', 'GA_TRACKING_ID', {
//         'custom_map': {
//           'dimension1': 'email',
//           'dimension2': 'external_id',
//           'dimension3': 'deal_id',
//           'dimension4': 'contact_internal_id'
//         }
//       });

//       gtag('event', 'page_view', {
//         'utm_source': utm_source,
//         'utm_medium': utm_medium,
//         'utm_campaign': utm_campaign,
//         'email': sensitiveData.email,
//         'external_id': sensitiveData.external_id,
//         'deal_id': sensitiveData.deal_id,
//         'contact_internal_id': sensitiveData.contact_internal_id
//       });
//     }
//   });
// </script>
// ```

// ### Step 4: Secure Data Fetching Mechanism

// Implement a secure mechanism to fetch sensitive data. Here’s a suggestion:
// - Use a server-side script that provides the sensitive data only when requested by an authorized session or secure token.
// - Ensure this script verifies the authenticity of the request before responding.

// ### Example of Secure Data Fetching (Optional)

// If you can set up a backend service, here's a pseudo-code example of how this might work:

// #### Backend Service (e.g., Node.js/Express)
// ```javascript
// app.get('/getSensitiveData', (req, res) => {
//   // Verify session or token
//   if (verifySession(req)) {
//     // Fetch sensitive data from database
//     const sensitiveData = fetchSensitiveData(req.user.id);
//     res.json(sensitiveData);
//   } else {
//     res.status(403).send('Unauthorized');
//   }
// });
// ```

// #### Frontend JavaScript (Modified to Fetch from Backend)
// ```html
// <script>
//   document.addEventListener('DOMContentLoaded', (event) => {
//     function getParameterByName(name, url) {
//       if (!url) url = window.location.href;
//       name = name.replace(/[\[\]]/g, '\\$&');
//       var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
//           results = regex.exec(url);
//       if (!results) return null;
//       if (!results[2]) return '';
//       return decodeURIComponent(results[2].replace(/\+/g, ' '));
//     }

//     var utm_source = getParameterByName('utm_source');
//     var utm_medium = getParameterByName('utm_medium');
//     var utm_campaign = getParameterByName('utm_campaign');

//     fetch('/getSensitiveData', {
//       method: 'GET',
//       credentials: 'include'
//     })
//     .then(response => response.json())
//     .then(data => {
//       if (utm_source && utm_medium && utm_campaign) {
//         gtag('config', 'GA_TRACKING_ID', {
//           'custom_map': {
//             'dimension1': 'email',
//             'dimension2': 'external_id',
//             'dimension3': 'deal_id',
//             'dimension4': 'contact_internal_id'
//           }
//         });

//         gtag('event', 'page_view', {
//           'utm_source': utm_source,
//           'utm_medium': utm_medium,
//           'utm_campaign': utm_campaign,
//           'email': data.email,
//           'external_id': data.external_id,
//           'deal_id': data.deal_id,
//           'contact_internal_id': data.contact_internal_id
//         });
//       }
//     });
//   });
// </script>
// ```

// ### Summary

// By following these steps, you ensure that sensitive information like emails and IDs are not exposed in the URL but still get sent to Google Analytics securely. This approach involves:
// 1. Simplifying URLs to include only non-sensitive data.
// 2. Using JavaScript to fetch and send sensitive data after the page has loaded.
// 3. Implementing a secure data-fetching mechanism to ensure sensitive information is handled securely.