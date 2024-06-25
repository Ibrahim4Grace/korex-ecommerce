'use strict';


   //    VIEW PRODUCT MODEL
function showViewProductModal(button) {
    const productId = button.getAttribute('data-product-id');
    const url = button.getAttribute('data-url'); 

    fetch(`${url}/${productId}`)
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text || 'Network response was not ok') });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            const product = data.productInfo;
            const modalContent = document.getElementById('modalContent');

            // Check if productImages exists and is an array
             const productImages = Array.isArray(product.images) ? product.images : [];
            
            let content = `
                <div class="card-wrappers rows">
                    <div class="cards clear">
                        <div class="product-imgs">
                            <div class="img-display">
                                ${productImages.slice(0, 1).map(img => `
                                    <div class="img-showcase">
                                        <img src="${img.imageUrl}" alt="product image">
                                    </div>
                                `).join('')}
                            </div>
                            <div class="img-select">
                                ${productImages.map(img => `
                                    <div class="img-item">
                                        <img src="${img.imageUrl}" alt="product image" width="100">
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        <div class="product-content">
                          
                            <div class="product-detail">
                                
                                <p><b>Description:</b> ${product.productDescription || 'No description available'}</p>
                                <ul>
                                    <li>Product: <span>${product.productName || 'N/A'}</span></li>
                                    <li>Price: <span>${product.productPrice}</span></li>
                                    <li>Category: <span>${product.productCategory}</span></li>
                                    <li>Brand: <span>${product.productBrand}</span></li>
                                    <li>Shipping Fees: <span>${product.productShipping}</span></li>
                                    <li>Size: <span>${product.productSize}</span></li>
                                    <li>Color: <span>${product.productColor}</span></li>
                                    <li>Quantity: <span>${product.productQuantity}</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>`;

            modalContent.innerHTML = content;
            const modal = document.getElementById('viewProductModal');
            modal.style.display = 'block';
        } else {
            alert('Product details not found');
        }
    })
    .catch(error => {
        alert('An error occurred while fetching product details.');
    });
}

function closeViewProductModal() {
const modal = document.getElementById('viewProductModal');
modal.style.display = 'none';
}


    //  EDIT PRODUCT MODEL
function showEditProductModal(button) {
const productId = button.getAttribute('data-product-id');

fetch(`/editProduct/${productId}`)
.then(response => response.json())
.then(data => {
    if (data.success) {
        const product = data.editProduct;
        const formContent = document.getElementById('editProductFormContent');

        let content = `
            <div class="col-12 d-flex main_flex_div">
                <div class="col-4 d-flex flex-column inner_flex_div">
                    <label for="productName">Product Name:</label>
                    <input type="text" id="productName" name="productName" value="${product.productName || ''}">
                    <input type="hidden" name="_id" value="${product._id}">
                </div>
                <div class="col-4 d-flex flex-column inner_flex_div">
                    <label for="productPrice">Price:</label>
                    <input type="number" id="productPrice" name="productPrice" value="${product.productPrice || ''}">
                </div>
                <div class="col-4 d-flex flex-column inner_flex_div">
                    <label for="productOldPrice">Old Price:</label>
                    <input type="text" id="productOldPrice" name="productOldPrice" value="${product.productOldPrice || ''}">
                </div>
            </div>

            <div class="col-12 d-flex main_flex_div">
                <div class="col-4 d-flex flex-column inner_flex_div">
                    <label for="productShipping">Shipping:</label>
                    <input type="text" id="productShipping" name="productShipping" value="${product.productShipping || ''}">
                </div>
                <div class="col-4 d-flex flex-column inner_flex_div">
                    <label for="productCategory">Category</label>
                    <input type="text" id="productCategory" name="productCategory" value="${product.productCategory || ''}">
                </div>
                <div class="col-4 d-flex flex-column inner_flex_div">
                    <label for="productBrand">Brand:</label>
                    <input type="text" id="productBrand" name="productBrand" value="${product.productBrand || ''}">
                </div>
            </div>

            <div class="col-12 d-flex main_flex_div">
                <div class="col-4 d-flex flex-column inner_flex_div">
                    <label for="productSize">Size:</label>
                    <select name="productSize[]" id="productSize" multiple>
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="38">38</option>
                        <option value="39">39</option>
                        <option value="40">40</option>
                        <option value="41">41</option>
                        <option value="42">42</option>
                        <option value="43">43</option>
                        <option value="44">44</option>
                        <option value="45">45</option>
                    </select>
                </div>

                <div class="col-4 d-flex flex-column inner_flex_div">
                    <label for="productColor">Color:</label>
                    <select name="productColor[]" id="productColor" multiple>
                        <option value="Black">Black</option>
                        <option value="Blue">Blue</option>
                        <option value="Green">Green</option>
                        <option value="Gold">Gold</option>
                        <option value="White">White</option>
                        <option value="Pink">Pink</option>
                    </select>
                </div>

                <div class="col-4 d-flex flex-column inner_flex_div">
                    <label for="productQuantity">Quantity:</label>
                    <input type="number" id="productQuantity" name="productQuantity" value="${product.productQuantity || ''}">
                </div>
            </div>
            <div class="col-12 d-flex main_flex_div">
                <div class="col-12 d-flex flex-column inner_flex_div">
                    <label for="productDescription">Description:</label>
                    <textarea id="productDescription" name="productDescription">${product.productDescription || ''}</textarea>
                </div>
            </div>`;

        formContent.innerHTML = content;
        const modal = document.getElementById('editProductModal');
        modal.style.display = 'block';

         // Set the selected options for the product sizes
        const selectedSizes = product.productSize || [];
        const sizeSelect = document.getElementById('productSize');
        Array.from(sizeSelect.options).forEach(option => {
            if (selectedSizes.includes(option.value)) {
                option.selected = true;
            }
        });
        

        const selectedColors = product.productColor || [];
        const colorSelect = document.getElementById('productColor');
        Array.from(colorSelect.options).forEach(option => {
            if (selectedColors.includes(option.value)) {
                option.selected = true;
            }
        });

    } else {
        alert('Product details not found');
    }
})
.catch(error => {
    alert('An error occurred while fetching product details.');
});
}

function closeEditProductModal() {
const modal = document.getElementById('editProductModal');
modal.style.display = 'none';
}

//Submit edit product modal
document.getElementById('editProductForm').addEventListener('submit', async function(event) {
event.preventDefault();

const formData = new FormData(this);
const productId = formData.get('_id');

    // Manually collect selected sizes and colors into arrays
const productSize = Array.from(document.getElementById('productSize').selectedOptions).map(option => option.value);
const productColor = Array.from(document.getElementById('productColor').selectedOptions).map(option => option.value);

const formObject = Object.fromEntries(formData.entries());
formObject.productSize = productSize;
formObject.productColor = productColor;

try {
const response = await fetch(`/merchant/editProductPost/${productId}`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(formObject)
});
const data = await response.json();
if (response.ok) {
    showToast('Product successfully updated', 'success');
    closeEditProductModal();
    window.location.href = data.redirectUrl;
} else {
    alert(data.message);
}
} catch (error) {
console.error('An error occurred:', error);
}
});

// DELETE PRODUCT MODAL
function showDeleteProductModal(button) {
    const productId = button.getAttribute('data-product-id');
    const url = button.getAttribute('data-url'); 

    if (confirm('Are you sure you want to delete this product?')) {
        fetch(`${url}/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => { throw new Error(data.message || 'Error deleting product') });
            }
            return response.json();
        })
        .then(data => {
            if (data.redirectUrl) {
                showToast('Product deleted successfully', 'success');
                window.location.href = data.redirectUrl; // Redirect based on received redirectUrl
            } else {
                showToast('Error deleting product', 'error');
            }
        })
        .catch(error => {
            showToast('Error deleting product: ' + error.message, 'error');
        });
    }
}

//Start View order model
function showViewOrderModal(button) {
    const orderNumber = button.getAttribute('data-order-number');
    const url = button.getAttribute('data-url'); 

    fetch(`${url}/${orderNumber}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                const order = data.orders[0];
                const modalTableBody = document.getElementById('modalTableBody');

                let tableRows = '';

                order.cartItems.forEach(item => {
                    tableRows += `
                        <tr>
                            <td>
                                <img src="${item.productImages && item.productImages.length > 0 ? item.productImages[0] : 'NA'}"
                                    alt="product" width="80">
                            </td>
                            <td>${item.productName || 'N/A'}</td>
                            <td>${item.productQuantity}</td>
                            <td>${item.productColor}</td>
                            <td>${item.productSize}</td>
                            <td><strong>${item.productPrice}</strong></td>
                            <td>${order.paystack_ref}</td>
                            <td><span style="background-color:#ffc107;" class="badge ${order.paymentStatus === 'PAID' ? 'badge-success' : 'badge-warning'}">${order.paymentStatus}</span></td>
                            
                        </tr>`;
                });

                // Add a summary row
                tableRows += `
                    <tr>
                        <td colspan="2">
                            <span>Shipment Status:</span>
                            <span style="background-color:green;" class="badge ${order.shipmentStatus ? 'badge-success' : 'badge-warning'}">${order.shipmentStatus}</span>
                        </td>
                        <td>
                            <span class="text-muted">Subtotal</span>
                            <strong>$${order.subtotal}</strong>
                        </td>
                        <td>
                            <span class="text-muted">Shipping</span>
                            <strong>$${order.totalShipping}</strong>
                        </td>
                        <td>
                            <span class="text-muted">Total Price</span>
                            <strong>$${order.totalAmount}</strong>
                        </td>
                    </tr>`;

                        // Add shipping and billing address row
                    tableRows += `
                    <tr>
                        <td colspan="6">
                            <div class="address-container">
                                <div class="address-section">
                                    <h5>DELIVERY ADDRESS</h5>
                                    <p>
                                        ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br>
                                        ${order.shippingAddress.addressLine1}<br>
                                        ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.country}<br>
                                        ${order.shippingAddress.email}<br>
                                        ${order.shippingAddress.mobileNumber}
                                    </p>
                                </div>
                                <div class="address-section">
                                    <h5>BILLING ADDRESS</h5>
                                    <p>
                                        ${order.user.userFirstName} ${order.user.userLastName}<br>
                                        ${order.user.userAddress}<br>
                                        ${order.user.userCity}, ${order.user.userState}, ${order.user.userCountry}
                                        <br>
                                        ${order.user.userEmail}<br>
                                        ${order.user.userNumber}
                                    </p>
                                </div>
                            </div>
                        </td>
                    </tr>`;

                modalTableBody.innerHTML = tableRows;

                const modal = document.getElementById('viewOrderModal');
                modal.style.display = 'block';
            } else {
                alert('Order details not found');
            }
        })
        .catch(error => {
            console.error('Error fetching order details:', error);
            alert('An error occurred while fetching order details.');
        });
}

function closeViewOrderModal() {
    const modal = document.getElementById('viewOrderModal');
    modal.style.display = 'none';
}
//End View order model


//   FUNCTION TO OPEN THE MODAL WHEN THE BUTTON IS CLICKED START 
    $(document).ready(function() {
          // Function to open the modal when the button is clicked
        $("#newProductBtn").click(function() {
            $('#myModal').modal('show'); // Show the modal
        });

         // Function to handle modal close event
        $('#myModal').on('hidden.bs.modal', function() {
            saveDraft(); // Save the draft when modal is closed
        });

                 // Function to save draft data
        function saveDraft() {
            // You can save the form data in localStorage or send it to the server
            const formData = $('#productForm').serializeArray();
            localStorage.setItem('draftFormData', JSON.stringify(formData));
        }

                 // Function to load draft data
        function loadDraft() {
            const draftData = localStorage.getItem('draftFormData');
            if (draftData) {
                const formData = JSON.parse(draftData);
                $.each(formData, function(i, field) {
                    $('[name="' + field.name + '"]').val(field.value);
                });
            }
        }

        // Load draft data when the document is ready
        loadDraft();

        let nStep = 3;
        let firstTab = $("#myModal .tab-pane:first-child").attr("id");
        let lastTab = $("#myModal .tab-pane:last-child").attr("id");

        $("#myModal .progress-bar").text("Step 1 of " + nStep);
        $("#myModal .back, #myModal .first").hide();

                // Manually trigger the shown.bs.tab event for the first tab
        $('[href="#' + firstTab + '"]').tab("show").trigger('shown.bs.tab');

        $("#myModal .next").click(function() {
            // Validate current step before proceeding
            if (!validateStep()) return false;

            let currentTab = $("#myModal .tab-pane.active");
            let nextId = currentTab.next().attr("id");
            $("#myModal [href='#" + nextId + "']").tab("show");

            $("#myModal .back, #myModal .first").css("display", "unset");
            if (nextId === lastTab) {
                $("#myModal .next").hide();
                $("#myModal .right-footer .btn-primary").show(); // Show the submit button
            }
            return false;
        });

        $("#myModal .back").click(function() {
            let currentTab = $("#myModal .tab-pane.active");
            let backId = currentTab.prev().attr("id");
            $("#myModal [href='#" + backId + "']").tab("show");

            $("#myModal .next").css("display", "unset");
            if (backId === "step1") {
                $("#myModal .back, #myModal .first").css("display", "none");
            }
            if (backId !== lastTab) {
                $("#myModal .right-footer .btn-primary").hide(); // Hide the submit button
            }
            return false;
        });

        $('a[data-toggle="tab"]').on("shown.bs.tab", function(e) {
            let step = $(e.target).data("step");
            let percent = parseInt(step) / nStep * 100;

            $("#myModal .progress-bar").css({ width: percent + "%" });
            $("#myModal .progress-bar").text("Step " + step + " of " + nStep);

            // Check if the current tab is the "Upload Image" tab
            if ($(e.target).attr("href") === "#step3") {
                $("#myModal .right-footer .btn-primary").show(); // Show the submit button
                $("#myModal .next").hide(); // Hide the next button
            } else {
                $("#myModal .right-footer .btn-primary").hide(); // Hide the submit button
                $("#myModal .next").show(); // Show the next button
            }
        });

        $("#myModal .first").click(function() {
            $("#myModal [href='#" + firstTab + "']").tab("show");
            $("#myModal .back, #myModal .first").css("display", "none");
            $("#myModal .next").css("display", "unset");
            $("#myModal .right-footer .btn-primary").hide(); // Hide the submit button
        });

             // Form submission logic
             $("#productForm").submit(function(event) {
                event.preventDefault();

                // Validate all steps before submission
                if (!validateStep()) return false;

                 // Collect form data including files
                let formData = new FormData(this);

                // Remove any existing images from formData
                formData.delete('images[]');

                 // Append each image file to formData separately
                document.querySelectorAll("input[type='file']").forEach(fileInput => {
                    Array.from(fileInput.files).forEach(file => {
                        formData.append('images[]', file);
                    });
                });


                 // Send the data to the server
                $.ajax({
                    url: '/merchant/merchantProductsPost', 
                    type: 'POST',
                    data: formData,
                    processData: false, // Prevent jQuery from processing the data
                    contentType: false, // Prevent jQuery from setting content type
                    success: function(response) {
                        if (response.success) {
                             // Handle success response
                            showToast('Product Posted successfully', 'success');
                            window.location.href = response.redirectUrl; 
                        } else {
                            // If registration failed, display error messages
                            const errors = response.errors;
                            showToast('Failed to post product');
                            errors.forEach(error => {
                                const errorElement = document.getElementById(`${error.key}Error`);
                                if (errorElement) {
                                    errorElement.textContent = error.msg;
                                }
                            });
                        }
                    },
                    error: function(xhr, status, error) {
                        // Handle error
                        console.error(xhr.responseText);
                        alert('An error occurred while processing your request.');
                    }
                });
            });

            // Function to validate current step
            function validateStep() {
                let currentTab = $("#myModal .tab-pane.active");
                let inputs = currentTab.find('input, select');

                let valid = true;
                inputs.each(function() {
                    if (!$(this).val()) {
                        valid = false;
                        let fieldName = $(this).attr('name');
                        let errorElement = document.getElementById(fieldName + 'Error');
                        if (errorElement) {
                            errorElement.textContent = 'Please fill out this field.';
                        }
                    }
                });

                return valid;
            }

            // Add event listener to each input field to clear error messages
            const inputFields = document.querySelectorAll('input, select'); // Get all input and select fields
            inputFields.forEach(inputField => {
                inputField.addEventListener('input', () => {
                    const fieldName = inputField.name;
                    const errorElement = document.getElementById(fieldName + 'Error');
                    if (errorElement) {
                        // Clear the error message associated with the input field
                        errorElement.innerText = '';
                    }
                });
            });
        });


 // FUNCTION TO OPEN THE MODAL WHEN THE BUTTON IS CLICKED START END    

//  UPLOADING IMAGE USING FILE READER START   
     document.addEventListener("DOMContentLoaded", init, false);

     //To save an array of attachments
     let AttachmentArray = [];

     //counter for attachment array
     let arrCounter = 0;

     //to make sure the error message for number of files will be shown only one time.
     let filesCounterAlertStatus = false;

     //un ordered list to keep attachments thumbnails
     let ul = document.createElement("ul");
     ul.className = "thumb-Images";
     ul.id = "imgList";

     function init() {
         //add javascript handlers for the file upload event
         document
         .querySelector("#files")
         .addEventListener("change", handleFileSelect, false);
    }

     //the handler for file upload event
     function handleFileSelect(e) {
         //to make sure the user select file/files
         if (!e.target.files) return;

         //To obtaine a File reference
         let files = e.target.files;

         // Loop through the FileList and then to render image files as thumbnails.
         for (let i = 0, f; (f = files[i]); i++) {
             //instantiate a FileReader object to read its contents into memory
             let fileReader = new FileReader();

             // Closure to capture the file information and apply validation.
             fileReader.onload = (function(readerEvt) {
                 return function(e) {
                      //Apply the validation rules for attachments upload
                     ApplyFileValidationRules(readerEvt);

                     //Render attachments thumbnails.
                     RenderThumbnail(e, readerEvt);

                      //Fill the array of attachment
                     FillAttachmentArray(e, readerEvt);
                 };
             })(f);

             fileReader.readAsDataURL(f);
         }
         document
         .getElementById("files")
         .addEventListener("change", handleFileSelect, false);
     }

     //To remove attachment once user click on x button
     jQuery(function($) {
         $("div").on("click", ".img-wrap .close", function() {
             let id = $(this)
             .closest(".img-wrap")
             .find("img")
             .data("id");

              //to remove the deleted item from array
             let elementPos = AttachmentArray.map(function(x) {
                 return x.FileName;
             }).indexOf(id);
             if (elementPos !== -1) {
                 AttachmentArray.splice(elementPos, 1);
             }

             //to remove image tag
             $(this).parent().find("img").not().remove();

              //to remove div tag that contain the image
             $(this).parent().find("div").not().remove();

              //to remove div tag that contain caption name
             $(this).parent().parent().find("div").not().remove();

             //to remove li tag
             let lis = document.querySelectorAll("#imgList li");
             for (let i = 0; (li = lis[i]); i++) {
                 if (li.innerHTML == "") {
                     li.parentNode.removeChild(li);
                 }
             }
         });
     });

     //Apply the validation rules for attachments upload
     function ApplyFileValidationRules(readerEvt) {
         //To check file type according to upload conditions
         if (CheckFileType(readerEvt.type) == false) {
             alert(
                 "The file (" +
                 readerEvt.name +
                 ") does not match the upload conditions, You can only upload jpg/png/gif files"
                 );
                 e.preventDefault();
                 return;
             }

             //To check file Size according to upload conditions
             if (CheckFileSize(readerEvt.size) == false) {
                 alert(
                     "The file (" +
                     readerEvt.name +
                     ") does not match the upload conditions, The maximum file size for uploads should not exceed 300 KB"
                     );
                     e.preventDefault();
                     return;
                 }

                 //To check files count according to upload conditions
                 if (CheckFilesCount(AttachmentArray) == false) {
                     if (!filesCounterAlertStatus) {
                         filesCounterAlertStatus = true;
                         alert(
                             "You have added more than 3 files. According to upload conditions you can upload 3 files maximum"
                             );
                         }
                         e.preventDefault();
                         return;
                     }
                 }

                 //To check file type according to upload conditions
                 function CheckFileType(fileType) {
                     if (fileType == "image/jpeg") {
                         return true;
                     } else if (fileType == "image/png") {
                         return true;
                     } else if (fileType == "image/gif") {
                         return true;
                     } else if (fileType == "image/jpg") {
                         return true;
                     }else {
                         return false;
                     }
                     return true;
                 }

                 //To check file Size according to upload conditions
                 function CheckFileSize(fileSize) {
                     if (fileSize < 300000) {
                         return true;
                     } else {
                         return false;
                     }
                     return true;
                 }

                 //To check files count according to upload conditions
                 function CheckFilesCount(AttachmentArray) {
                     //Since AttachmentArray.length return the next available index in the array,
                     //I have used the loop to get the real length
                     let len = 0;
                     for (let i = 0; i < AttachmentArray.length; i++) {
                         if (AttachmentArray[i] !== undefined) {
                             len++;
                         }
                     }
                     //To check the length does not exceed 3 files maximum
                     if (len > 2) {
                         return false;
                     } else {
                         return true;
                     }
                 }

                 //Render attachments thumbnails.
                 function RenderThumbnail(e, readerEvt) {
                     let li = document.createElement("li");
                     ul.appendChild(li);
                     li.innerHTML = [
                     '<div class="img-wrap"> <span class="close">&times;</span>' +
                     '<img class="thumb" src="',
                     e.target.result,
                     '" title="',
                     escape(readerEvt.name),
                     '" data-id="',
                     readerEvt.name,
                     '"/>' + "</div>"
                     ].join("");

                     let div = document.createElement("div");
                     div.className = "FileNameCaptionStyle";
                     li.appendChild(div);
                     div.innerHTML = [readerEvt.name].join("");
                     document.getElementById("Filelist").insertBefore(ul, null);
                 }

                 //Fill the array of attachment
                 function FillAttachmentArray(e, readerEvt) {
                     AttachmentArray[arrCounter] = {
                         AttachmentType: 1,
                         ObjectType: 1,
                         FileName: readerEvt.name,
                         FileDescription: "Attachment",
                         NoteText: "",
                         MimeType: readerEvt.type,
                         Content: e.target.result.split("base64,")[1],
                         FileSizeInBytes: readerEvt.size
                     };
                     arrCounter = arrCounter + 1;
                 }

// UPLOADING IMAGE USING FILE READER END  



// START SELECT MULTIPLE INPUT FIELD SCRIPT                 
     jQuery(function() {
         jQuery('.multiSelect').each(function(e) {
             let self = jQuery(this);
             let field = self.find('.multiSelect_field');
             let fieldOption = field.find('option');
             let placeholder = field.attr('data-placeholder');

             field.hide().after(`<div class="multiSelect_dropdown"></div>
             <span class="multiSelect_placeholder">` + placeholder + `</span>
             <ul class="multiSelect_list"></ul>
             <span class="multiSelect_arrow"></span>`);

             fieldOption.each(function(e) {
                 let optionValue = jQuery(this).val();
                 let optionText = jQuery(this).text();
                 self.find('.multiSelect_list').append(`<li class="multiSelect_option" data-value="${optionValue}">
                     <a class="multiSelect_text">${optionText}</a>
                 </li>`);
             });

             let dropdown = self.find('.multiSelect_dropdown');
             let list = self.find('.multiSelect_list');
             let option = self.find('.multiSelect_option');
             let optionText = self.find('.multiSelect_text');

             dropdown.attr('data-multiple', 'true');
             list.css('top', dropdown.height() + 5);

             option.click(function(e) {
                 let self = jQuery(this);
                 e.stopPropagation();
                 self.addClass('-selected');
                 field.find('option:contains(' + self.children().text() + ')').prop('selected', true);
                 dropdown.append(function(e) {
                     return jQuery('<span class="multiSelect_choice">'+ self.children().text() +'<svg class="multiSelect_deselect -iconX"><use href="#iconX"></use></svg></span>').click(function(e) {
                         let self = jQuery(this);
                         e.stopPropagation();
                         self.remove();
                         list.find('.multiSelect_option:contains(' + self.text() + ')').removeClass('-selected');
                         list.css('top', dropdown.height() + 5).find('.multiSelect_noselections').remove();
                         field.find('option:contains(' + self.text() + ')').prop('selected', false);
                         if (dropdown.children(':visible').length === 0) {
                             dropdown.removeClass('-hasValue');
                         }
                     });
                 }).addClass('-hasValue');
                 list.css('top', dropdown.height() + 5);
                 if (!option.not('.-selected').length) {
                     list.append('<h5 class="multiSelect_noselections">No Selections</h5>');
                 }
             });

             dropdown.click(function(e) {
                 e.stopPropagation();
                 e.preventDefault();
                 dropdown.toggleClass('-open');
                 list.toggleClass('-open').scrollTop(0).css('top', dropdown.height() + 5);
             });

             jQuery(document).on('click touch', function(e) {
                 if (dropdown.hasClass('-open')) {
                     dropdown.toggleClass('-open');
                     list.removeClass('-open');
                 }
             });
         });
     });

// END SELECT MULTIPLE INPUT FIELD SCRIPT   