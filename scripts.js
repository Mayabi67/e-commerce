function shopNow() {
    window.location.href = '#';
}

function learnMore() {
    window.location.href = '#';
}


let cart = [];

function addToCart(name, price, image) {
    const product = { name, price, image, quantity: 1 };
    const index = cart.findIndex(item => item.name === name);
    if (index > -1) {
        cart[index].quantity++;
    } else {
        cart.push(product);
    }
    updateCart();
}

function removeFromCart(name) {
    const index = cart.findIndex(item => item.name === name);
    if (index > -1) {
        if (cart[index].quantity > 1) {
            cart[index].quantity--;
        } else {
            cart.splice(index, 1);
        }
    }
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <p>${item.name}</p>
            <p>Ksh ${item.price}</p>
            <p>Quantity: ${item.quantity}</p>
            <button onclick="removeFromCart('${item.name}')">Remove</button>
        `;
        cartItems.appendChild(cartItem);
    });

    const cartTotal = document.getElementById('cart-total');
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotal.innerText = total;
}

function checkout() {
    alert('Proceeding to checkout');
    document.querySelector('.checkout').style.display = 'block';
}


function payWithMpesa() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const zip = document.getElementById('zip').value;

    if (!name || !email || !phone || !address || !city || !zip) {
        alert('Please fill in all the details');
        return;
    }

    // Replace the following code with the actual M-Pesa payment integration
    alert(`Thank you for your order, ${name}. We will contact you on ${phone} to complete the M-Pesa payment.`);
}

let slideIndex = 0;

function slide(direction, type = 'product') {
    const sliderTrack = type === 'blog' ? document.getElementById('blog-slider-track') : 
                        type === 'faq' ? document.getElementById('faq-slider-track') : 
                        document.querySelector('.products .slider-track');
    const items = sliderTrack.children;
    const itemWidth = items[0].offsetWidth;
    const containerWidth = sliderTrack.parentElement.offsetWidth;
    const totalItems = items.length;
    const totalWidth = itemWidth * totalItems;
    const maxSlide = Math.ceil(totalWidth / containerWidth) - 1;

    if (direction === -1 && slideIndex > 0) {
        slideIndex--;
    } else if (direction === 1 && slideIndex < maxSlide) {
        slideIndex++;
    }

    const transformValue = -(slideIndex * containerWidth);
    sliderTrack.style.transform = `translateX(${transformValue}px)`;
}
