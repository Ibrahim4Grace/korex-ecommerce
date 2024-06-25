                                        //PRODUCT SIDEBAR FILTER SEARCH BY SIZE, AMOUNT AND COLORS
  document.addEventListener("DOMContentLoaded", function() {
        const sizeCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="size-"]');
        const colorCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="color-"]');
        const priceCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="price-"]');

    
        sizeCheckboxes.forEach(function(checkbox) {
            checkbox.addEventListener("change", function() {
                filterProductsBySidebar();
            });
        });
    
        colorCheckboxes.forEach(function(checkbox) {
            checkbox.addEventListener("change", function() {
                filterProductsBySidebar();
            });
        });
    
        priceCheckboxes.forEach(function(checkbox) {
            checkbox.addEventListener("change", function() {
                filterProductsBySidebar();
            });
        });
    
        function filterProductsBySidebar() {
            const selectedSizes = [];
            sizeCheckboxes.forEach(function(checkbox) {
                if (checkbox.checked && checkbox.value !== "All Size") {
                    selectedSizes.push(checkbox.value);
                }
            });
    
            const selectedColors = [];
            colorCheckboxes.forEach(function(checkbox) {
                if (checkbox.checked && checkbox.value !== "All Color") {
                    selectedColors.push(checkbox.value);
                }
            });
    
            const selectedPrices = [];
            priceCheckboxes.forEach(function(checkbox, index) {
                if (checkbox.checked && checkbox.value !== "All Price") {
                    const lowerBound = parseFloat(checkbox.value);
                    let upperBound = Infinity;
                    // Check if there's a checkbox after the current one
                    if (index < priceCheckboxes.length - 1) {
                        // If yes, set the upperBound to the value of the next checkbox
                        upperBound = parseFloat(priceCheckboxes[index + 1].value);
                    }
                    // Push the price range to the selectedPrices array
                    selectedPrices.push({ lowerBound, upperBound });
                }
            });
 
            const products = document.querySelectorAll('.product-item');

            products.forEach(function(product) {
                const productSizes = product.getAttribute('data-size').split(','); // Split the sizes into an array
                const productColors = product.getAttribute('data-color').split(','); // Split the colors into an array
                const productPrice = parseFloat(product.getAttribute('data-price')); // Get product price as float
        
                const isPriceInRange = selectedPrices.length === 0 || selectedPrices.some(priceRange => productPrice >= priceRange.lowerBound && productPrice < priceRange.upperBound);
                const isSizeMatched = selectedSizes.length === 0 || productSizes.some(size => selectedSizes.includes(size.trim()));
                const isColorMatched = selectedColors.length === 0 || productColors.some(color => selectedColors.includes(color.trim()));
        
                if (isPriceInRange && isSizeMatched && isColorMatched) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            });

    
            const noProductsMessage = document.getElementById('noProductsMessage');
            if (
                (selectedSizes.length > 0 || selectedColors.length > 0 || selectedPrices.length > 0) && 
                document.querySelectorAll('.product-item[style="display: block;"]').length === 0
            ) {
                noProductsMessage.style.display = 'block';
            } else {
                noProductsMessage.style.display = 'none';
            }
        
        }
        
        // Initial filter on page load
        filterProductsBySidebar();
    });
    
    


                                                     // USER FILTER SEARCH BY DRESS NAME AT THE TOP
                                          
document.addEventListener("DOMContentLoaded", function() {
    const searchDressInput = document.getElementById('searchDressInput');

    searchDressInput.addEventListener('input', function() {
        const searchQuery = searchDressInput.value.trim().toLowerCase(); // Get the entered search query

        filterProductSearchQuery(searchQuery);
    });
});

function filterProductSearchQuery(searchQuery) {
    const products = document.querySelectorAll('.product-item');

    products.forEach(function(product) {
        const productName = product.querySelector('.card-body h6').textContent.toLowerCase(); // Get the product name

        if (productName.includes(searchQuery)) {
            product.style.display = 'block'; // Show the product if its name matches the search query
        } else {
            product.style.display = 'none'; // Hide the product if its name doesn't match the search query
        }
    });

    // Show/hide the "No products found" message based on the search results
    const noSearchResultsMessage = document.getElementById('noSearchResultsMessage');
    const matchingProducts = document.querySelectorAll('.product-item[style="display: block;"]');
    if (matchingProducts.length === 0) {
        noSearchResultsMessage.style.display = 'block'; // Show the message if no matching products are found
    } else {
        noSearchResultsMessage.style.display = 'none'; // Hide the message if matching products are found
    }
}



                                          //DISPLAYING PRODUCT QUANTITY BY SIZE, AMOUNT AND COLOR

    document.addEventListener("DOMContentLoaded", function() {
        // Function to update quantity for each size
        function updateSizeQuantities() {
            const products = document.querySelectorAll('.product-item');
            const sizeCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="size-"]');
    
            sizeCheckboxes.forEach(function(checkbox) {
                const sizeId = checkbox.id;
                const quantitySpanId = sizeId + "-quantity";
                const size = checkbox.value;
    
                const quantity = Array.from(products).filter(function(product) {
                    const productSize = product.getAttribute('data-size').split(',');
                    return productSize.includes(size) && product.style.display !== 'none';
                }).length;
    
                document.getElementById(quantitySpanId).textContent = quantity;
            });
        }
    
        // Function to update quantity for each color
        function updateColorQuantities() {
            const products = document.querySelectorAll('.product-item');
            const colorCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="color-"]');
    
            colorCheckboxes.forEach(function(checkbox) {
                const colorId = checkbox.id;
                const quantitySpanId = colorId + "-quantity";
                const color = checkbox.value;
    
                const quantity = Array.from(products).filter(function(product) {
                    const productColors = product.getAttribute('data-color').split(',');
                    return productColors.includes(color) && product.style.display !== 'none';
                }).length;
    
                document.getElementById(quantitySpanId).textContent = quantity;
            });
        }
    
        // Function to update quantity for each price range
        function updatePriceQuantities() {
            const products = document.querySelectorAll('.product-item');
            const priceRanges = [
                { min: 0, max: 50, id: 'price-1-quantity' },
                { min: 50, max: 100, id: 'price-2-quantity' },
                { min: 100, max: 200, id: 'price-3-quantity' },
                { min: 200, max: 300, id: 'price-4-quantity' },
                { min: 300, max: 400, id: 'price-5-quantity' },
            ];
    
            priceRanges.forEach(function(range) {
                const quantity = Array.from(products).filter(function(product) {
                    const price = parseFloat(product.getAttribute('data-price'));
                    return price >= range.min && price < range.max && product.style.display !== 'none';
                }).length;
    
                document.getElementById(range.id).textContent = quantity;
            });
        }
        
        // Call the functions initially and whenever products change
        updateSizeQuantities();
        updateColorQuantities();
        updatePriceQuantities();
        filterProductsBySidebar(); // Assuming you have a function named filterProductsBySidebar
    });
    