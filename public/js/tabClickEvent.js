'use strict';
function openProductDetail(event) {
    const url = event.currentTarget.getAttribute('href'); // Get the URL from the link
    
    // Check if the link is opened in a new tab
    if (!event.ctrlKey && !event.metaKey) {
        event.preventDefault(); // Prevent the default behavior of the link if not opened in a new tab
        
        // Open the URL in a new tab
        window.open(url, '_blank');
    } else {
        // Fetch the content of the URL and replace the content of the current page
        fetch(url)
            .then(response => response.text())
            .then(html => {
                document.documentElement.innerHTML = html;
            })
            .catch(error => console.error('Error fetching product details:', error));
    }
}









//   to open page without id 
// function openProductDetail(event) {
//     event.preventDefault(); // Prevent the default behavior of the link
//     const url = event.currentTarget.getAttribute('href'); // Get the URL from the link
//     fetch(url) // Fetch the content of the URL
//         .then(response => response.text()) // Extract the response as text
//         .then(html => {
//             // Open a new tab and write the received HTML content to it
//             const newTab = window.open();
//             newTab.document.write(html);
//         })
//         .catch(error => console.error('Error fetching product details:', error));
// }
