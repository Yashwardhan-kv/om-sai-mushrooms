let cart = [];
let cartCount = 0;

// Load cart from local storage
function loadCart() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
        cartCount = cart.reduce((count, item) => count + item.quantity, 0);
    }
}

// Function to add items to the cart
function addToCart(productName, productPrice) {
    // Check if the product is already in the cart
    const existingItem = cart.find(item => item.name === productName);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name: productName, price: productPrice, quantity: 1 });
    }
    cartCount++;
    localStorage.setItem('cart', JSON.stringify(cart)); // Save updated cart to local storage
    document.getElementById('cart-count').innerText = cartCount;
    alert(`${productName} has been added to your cart!`);
}

// Function to display the cart contents
function displayCart() {
    const cartTableBody = document.querySelector('#cart-table tbody');
    cartTableBody.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const row = document.createElement('tr');
        const totalItemPrice = item.price * item.quantity;
        total += totalItemPrice;

        row.innerHTML = `
            <td>${item.name}</td>
            <td>₹${item.price.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>₹${totalItemPrice.toFixed(2)}</td>
        `;
        cartTableBody.appendChild(row);
    });

    document.getElementById('cart-total').innerText = `Total: ₹${total.toFixed(2)}`;
}

// Function to generate an invoice for the order
function generateInvoice() {
    const { jsPDF } = window.jspdf; // Import jsPDF
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text('Order Invoice', 10, 10);

    // Add date and time
    const date = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Kolkata' };
    const formattedDate = date.toLocaleString('en-IN', options);
    doc.setFontSize(12);
    doc.text(`Date: ${formattedDate}`, 10, 20);

    // Add a line break
    doc.text('\n', 10, 30);

    // Create table data
    const tableData = cart.map(item => [
        item.name,
        `₹${item.price.toFixed(2)}`,
        item.quantity,
        `₹${(item.price * item.quantity).toFixed(2)}`
    ]);

    // Add table headers
    const headers = [['Product Name', 'Price', 'Quantity', 'Total']];

    // Add the table to the PDF
    doc.autoTable({
        head: headers,
        body: tableData,
        startY: 40, // Adjust starting position of the table
        theme: 'grid'
    });

    // Add total amount below the table
    const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    doc.text(`Total: ₹${totalAmount.toFixed(2)}`, 10, doc.autoTable.previous.finalY + 10);

    // Save the PDF
    doc.save('invoice.pdf');
}

// Function to record the order and reset the cart
function recordOrder() {
    console.log(`Order recorded: ${JSON.stringify(cart)}`);
    generateInvoice(); // Generate an invoice when recording the order
    cart = [];
    cartCount = 0;
    localStorage.removeItem('cart'); // Clear cart from local storage
    document.getElementById('cart-count').innerText = cartCount;
}

// Event listener for displaying cart when on cart.html
document.addEventListener('DOMContentLoaded', () => {
    loadCart(); // Load cart from local storage when the page is loaded
    if (window.location.pathname.includes('cart.html')) {
        displayCart();
    }
});
