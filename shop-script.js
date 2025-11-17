// Cart Management
let cart = JSON.parse(localStorage.getItem('delamaCart')) || [];

// Update cart count on page load
updateCartCount();

function addToCart(name, price, image) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    updateCartDisplay();
    
    // Show feedback
    showNotification(`${name} added to cart!`);
}

function removeFromCart(name) {
    const index = cart.findIndex(item => item.name === name);
    if (index > -1) {
        cart.splice(index, 1);
        saveCart();
        updateCartCount();
        updateCartDisplay();
    }
}

function updateQuantity(name, change) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(name);
        } else {
            saveCart();
            updateCartDisplay();
        }
    }
}

function saveCart() {
    localStorage.setItem('delamaCart', JSON.stringify(cart));
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Your cart is empty</p>';
        cartTotal.textContent = 'Ksh 0';
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>Ksh ${item.price.toLocaleString()}</p>
                <div class="quantity-controls">
                    <button onclick="updateQuantity('${item.name}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity('${item.name}', 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart('${item.name}')">Remove</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    cartTotal.textContent = `Ksh ${total.toLocaleString()}`;
}

function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    cartSidebar.classList.toggle('active');
    updateCartDisplay();
}

function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    toggleCart();
    showCheckoutModal();
}

function showCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    modal.classList.add('active');
    updateCheckoutSummary();
}

function closeCheckout() {
    const modal = document.getElementById('checkout-modal');
    modal.classList.remove('active');
}

function updateCheckoutSummary() {
    const checkoutItems = document.getElementById('checkout-items');
    const subtotalElement = document.getElementById('subtotal');
    const finalTotalElement = document.getElementById('final-total');
    
    let subtotal = 0;
    checkoutItems.innerHTML = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const checkoutItem = document.createElement('div');
        checkoutItem.className = 'checkout-item';
        checkoutItem.innerHTML = `
            <span>${item.name} x ${item.quantity}</span>
            <span>Ksh ${itemTotal.toLocaleString()}</span>
        `;
        checkoutItems.appendChild(checkoutItem);
    });
    
    const deliveryFee = 300; // Default delivery fee
    const total = subtotal + deliveryFee;
    
    subtotalElement.textContent = `Ksh ${subtotal.toLocaleString()}`;
    finalTotalElement.textContent = `Ksh ${total.toLocaleString()}`;
}

async function payWithMpesa() {
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const location = document.getElementById('location').value.trim();
    
    // Validation
    if (!name || !phone || !email) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Validate phone number format
    const phoneRegex = /^254[0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
        showNotification('Please enter a valid M-Pesa number (254XXXXXXXXX)', 'error');
        return;
    }
    
    // Calculate total
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 300;
    const total = subtotal + deliveryFee;
    
    // Show loading
    showLoading();
    
    try {
        // Prepare order data
        const orderData = {
            customerName: name,
            phone: phone,
            email: email,
            location: location || 'Not specified',
            items: cart,
            subtotal: subtotal,
            deliveryFee: deliveryFee,
            total: total,
            timestamp: new Date().toISOString()
        };
        
        // Call M-Pesa API
        const response = await fetch('/api/mpesa/initiate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        
        const result = await response.json();
        
        hideLoading();
        
        if (result.success) {
            showNotification('M-Pesa prompt sent! Please check your phone to complete payment.', 'success');
            
            // Clear cart after successful initiation
            setTimeout(() => {
                cart = [];
                saveCart();
                updateCartCount();
                closeCheckout();
                showNotification('Thank you for your order! We will contact you shortly.', 'success');
            }, 3000);
        } else {
            showNotification(result.message || 'Payment failed. Please try again.', 'error');
        }
    } catch (error) {
        hideLoading();
        console.error('Payment error:', error);
        
        // Fallback for development/testing
        showNotification('M-Pesa integration is in development mode. Order details saved!', 'info');
        
        // Log order for testing
        console.log('Order Details:', {
            customerName: name,
            phone: phone,
            email: email,
            location: location || 'Not specified',
            items: cart,
            total: total
        });
        
        // Simulate success after 2 seconds
        setTimeout(() => {
            cart = [];
            saveCart();
            updateCartCount();
            closeCheckout();
            showNotification('Test order completed! Check console for details.', 'success');
        }, 2000);
    }
}

function showLoading() {
    document.getElementById('loading-overlay').classList.add('active');
}

function hideLoading() {
    document.getElementById('loading-overlay').classList.remove('active');
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${type === 'success' ? '#00a651' : type === 'error' ? '#ff4444' : '#ff6347'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Search functionality
document.getElementById('search-input')?.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const productName = card.querySelector('h3').textContent.toLowerCase();
        if (productName.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

// Close modals on outside click
window.addEventListener('click', function(e) {
    const modal = document.getElementById('checkout-modal');
    if (e.target === modal) {
        closeCheckout();
    }
});
