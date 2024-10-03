const buttons = document.querySelectorAll('.menu-btn');
const cartItemsList = document.getElementById('cart-items');
const totalPriceElement = document.getElementById('total-price');
let total = 0;
let items = [];

// Event listener for each button to add items to the cart
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const itemName = button.getAttribute('data-item');
        const itemPrice = parseFloat(button.getAttribute('data-price'));
        const itemLogo = button.getAttribute('data-logo'); // Get the logo image source

        // Ask the user for the quantity
        const quantity = parseInt(prompt(`How many ${itemName} would you like to add?`, 1));

        // If the input is not a valid number or is less than 1, return early
        if (isNaN(quantity) || quantity < 1) {
            alert('Please enter a valid quantity.');
            return;
        }

        const totalItemPrice = itemPrice * quantity;

        // Create new list item with item details, logo, and a remove button
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <img src="${itemLogo}" alt="${itemName}" class="item-logo">
            ${quantity}x ${itemName} - ₱${totalItemPrice.toFixed(2)} 
            <button class="remove-btn" data-price="${totalItemPrice}">Remove</button>
        `;
        cartItemsList.appendChild(listItem);

        // Update total and items array
        total += totalItemPrice;
        totalPriceElement.textContent = total.toFixed(2);

        items.push({ name: itemName, price: itemPrice, quantity: quantity, logo: itemLogo });

        // Add event listener to the remove button
        listItem.querySelector('.remove-btn').addEventListener('click', function() {
            const price = parseFloat(this.getAttribute('data-price'));
            total -= price;
            totalPriceElement.textContent = total.toFixed(2);

            // Remove item from the list
            cartItemsList.removeChild(listItem);

            // Update the items array by removing the correct item
            items = items.filter(item => item.price * item.quantity !== price);
        });
    });
});

// Function to generate and print the receipt
document.getElementById('print-receipt').addEventListener('click', () => {
    const receiptWindow = window.open('', '', 'width=400,height=600');
    let receiptContent = `
        <html>
        <head>
            <title>Receipt - Starbox Coffee</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                    background-color: #f8f4f0;
                }
                h2 {
                    color: #6d4c41;
                    text-align: center;
                }
                ul {
                    list-style-type: none;
                    padding: 0;
                }
                ul li {
                    font-size: 1.2rem;
                    border-bottom: 1px solid #ddd;
                    padding: 8px 0;
                }
                ul li img {
                    width: 30px;
                    height: 30px;
                    margin-right: 10px;
                }
                .total {
                    margin-top: 20px;
                    font-size: 1.5rem;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <h2>Receipt - Starbox Coffee</h2>
            <ul>`;

    // Add each item to the receipt with its logo
    items.forEach(item => {
        receiptContent += `<li><img src="${item.logo}" alt="${item.name}" class="item-logo"> ${item.quantity}x ${item.name} - ₱${(item.price * item.quantity).toFixed(2)}</li>`;
    });

    // Add total to the receipt
    receiptContent += `
            </ul>
            <div class="total">
                <strong>Total: ₱${total.toFixed(2)}</strong>
            </div>
        </body>
        </html>`;

    receiptWindow.document.write(receiptContent);
    receiptWindow.document.close();
    receiptWindow.focus();
    receiptWindow.print();
    receiptWindow.close();

    
});
// Event listener for "Show Saved Orders" button
document.getElementById('show-orders').addEventListener('click', () => {
    fetch('get_receipts.php')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const savedOrdersList = document.getElementById('saved-orders-list');
            savedOrdersList.innerHTML = ''; // Clear previous orders

            data.receipts.forEach(receipt => {
                // Create list item for each receipt
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <strong>Order ID:</strong> ${receipt.id} <br>
                    <strong>Date:</strong> ${new Date(receipt.created_at).toLocaleString()} <br>
                    <strong>Total:</strong> ₱${receipt.total} <br>
                    <strong>Items:</strong> <br> ${formatReceiptItems(receipt.items)}
                    <hr>
                `;
                savedOrdersList.appendChild(listItem);
            });
        } else {
            alert('Failed to fetch saved orders.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while fetching saved orders.');
    });
});
document.getElementById('print-receipt').addEventListener('click', () => {
    const dataToSend = {
        items: items,
        total: total
    };

    // Log data to the console before sending to the backend
    console.log('Data to be sent:', dataToSend);

    fetch('save_receipt.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Response from server:', data);
        if (data.success) {
            alert('Receipt saved successfully.');
        } else {
            alert('Failed to save the receipt: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while saving the receipt.');
    });
});
// Event listener to fetch and display saved orders


document.getElementById('show-orders').addEventListener('click', () => {
    window.location.replace('saved_orders.html', '_blank');
    
    })
    .catch(error => {
        console.error('Error fetching saved orders:', error);
        alert('Failed to load saved orders.');
    });

