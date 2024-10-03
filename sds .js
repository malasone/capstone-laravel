document.getElementById('print-receipt').addEventListener('click', () => {
    // Prepare order details
    const order = {
        items: items, // Use the global 'items' array that holds the order details
        total: total
    };

    // Send order to PHP backend (save_order.php)
    fetch('http://localhost/new/save_order.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        alert(data.message); // Show confirmation message
    })
    .catch((error) => {
        console.error('Error:', error);
    });

    // Receipt printing code (same as before)
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

    items.forEach(item => {
        receiptContent += `<li><img src="${item.logo}" alt="${item.name}" class="item-logo"> ${item.quantity}x ${item.name} - ₱${(item.price * item.quantity).toFixed(2)}</li>`;
    });

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
