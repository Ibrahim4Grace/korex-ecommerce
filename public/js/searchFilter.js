const searchInput = document.getElementById('searchInput');
const productRows = document.querySelectorAll('.center');
const searchNotFound = document.getElementById('searchNotFound');

      // Function to filter products based on search term
function filterProducts(searchTerm) {
    searchTerm = searchTerm.trim().toLowerCase();
    let found = false;
    productRows.forEach(row => {
        const productName = row.querySelector('td:nth-child(3)').textContent.trim().toLowerCase();
        if (productName.includes(searchTerm)) {
            row.style.display = 'table-row'; // Show matching rows
            found = true;
        } else {
            row.style.display = 'none'; // Hide non-matching rows
        }
    });
    if (!found) {
        searchNotFound.style.display = 'block'; // Show message if no product found
    } else {
        searchNotFound.style.display = 'none'; // Hide message if products found
    }
}

      // Event listener for search input
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value;
    if (searchTerm.trim() === '') {
        // If search input is empty, show all rows
        productRows.forEach(row => {
            row.style.display = 'table-row';
        });
        searchNotFound.style.display = 'none'; // Hide message
        return;
    }
    filterProducts(searchTerm); // Filter products based on search term
});

    // Initially display all products
filterProducts('');
