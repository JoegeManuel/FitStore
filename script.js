// Cart functionality
let cart = [];
let cartTotal = 0;
const deliveryFee = 5000;

function toggleCart() {
    const cartSection = document.getElementById('cart-section');
    cartSection.classList.toggle('hidden');
    
    const cartPanel = cartSection.querySelector('div');
    if (cartSection.classList.contains('hidden')) {
        cartPanel.classList.add('translate-x-full');
    } else {
        cartPanel.classList.remove('translate-x-full');
    }
}

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    cartTotal += price;
    updateCartUI();
    showToast(`${name} adicionado ao carrinho!`, 'success');
    
    const cartBadge = document.getElementById('cart-badge');
    cartBadge.classList.remove('hidden');
    cartBadge.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartBadge.classList.add('animate-ping', 'duration-300');
    setTimeout(() => {
        cartBadge.classList.remove('animate-ping');
    }, 300);
}

function updateCartUI() {
    const cartItemsElement = document.getElementById('cart-items');
    const cartCountElement = document.getElementById('cart-count');
    const cartSubtotalElement = document.getElementById('cart-subtotal');
    const cartTotalElement = document.getElementById('cart-total');
    const cartBadge = document.getElementById('cart-badge');
    
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = totalItems;
    cartBadge.textContent = totalItems;
    cartBadge.classList.toggle('hidden', totalItems === 0);
    
    if (cart.length === 0) {
        cartItemsElement.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-shopping-cart text-4xl text-gray-300 mb-4"></i>
                <p class="text-gray-500">Seu carrinho está vazio</p>
                <button onclick="document.getElementById('produtos').scrollIntoView({behavior: 'smooth'}); toggleCart();" class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                    Ver Produtos
                </button>
            </div>
        `;
    } else {
        cartItemsElement.innerHTML = '';
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item flex justify-between items-center py-4 border-b';
            itemElement.innerHTML = `
                <div>
                    <h4 class="font-medium">${item.name}</h4>
                    <p class="text-gray-600">AOA ${item.price.toLocaleString()}</p>
                </div>
                <div class="flex items-center">
                    <button onclick="updateQuantity('${item.name}', -1)" class="px-2 text-gray-500 hover:text-indigo-600">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="mx-2 w-6 text-center">${item.quantity}</span>
                    <button onclick="updateQuantity('${item.name}', 1)" class="px-2 text-gray-500 hover:text-indigo-600">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button onclick="removeFromCart('${item.name}')" class="ml-4 text-red-500 hover:text-red-700">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            cartItemsElement.appendChild(itemElement);
        });
    }
    
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    cartSubtotalElement.textContent = subtotal.toLocaleString();
    cartTotalElement.textContent = (subtotal + deliveryFee).toLocaleString();
}

function updateQuantity(name, change) {
    const item = cart.find(item => item.name === name);
    
    if (item) {
        if (item.quantity + change <= 0) {
            removeFromCart(name);
            return;
        }
        
        item.quantity += change;
        cartTotal += change * item.price;
        updateCartUI();
    }
}

function removeFromCart(name) {
    const itemIndex = cart.findIndex(item => item.name === name);
    
    if (itemIndex !== -1) {
        cartTotal -= cart[itemIndex].price * cart[itemIndex].quantity;
        cart.splice(itemIndex, 1);
        updateCartUI();
        showToast(`${name} removido do carrinho!`, 'error');
    }
}

function checkout() {
    if (cart.length === 0) {
        showToast('Seu carrinho está vazio!', 'error');
        return;
    }
    
    showToast('Compra finalizada com sucesso!', 'success');
    cart = [];
    cartTotal = 0;
    updateCartUI();
    toggleCart();
}

function showToast(message, type = 'success') {
    document.querySelectorAll('.toast').forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = `toast fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white flex items-center ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    toast.innerHTML = `
        <i class="fas ${icon} mr-2"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Back to top button
window.addEventListener('scroll', function() {
    const backToTopButton = document.getElementById('back-to-top');
    if (window.pageYOffset > 300) {
        backToTopButton.classList.remove('hidden');
    } else {
        backToTopButton.classList.add('hidden');
    }
});

document.getElementById('back-to-top').addEventListener('click', function() {
    window.scrollTo({top: 0, behavior: 'smooth'});
});