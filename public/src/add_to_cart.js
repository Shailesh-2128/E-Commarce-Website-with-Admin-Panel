 
    document.addEventListener("DOMContentLoaded", () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const container = document.getElementById("cart-items");
      const totalEl = document.getElementById("cart-total");
      const taxEl = document.getElementById("tax-amount");
      const totalAmountEl = document.getElementById("total-amount");
      const cartCountEl = document.getElementById("cart-count");
      let total = 0;

      // Update cart count
      cartCountEl.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

      if (cart.length === 0) {
        container.innerHTML = `
          <div class="empty-cart animate__animated animate__fadeIn">
            <i class="fas fa-shopping-cart"></i>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added anything to your cart yet</p>
            <button class="btn btn-primary" onclick="location.href='index.html'">
              <i class="fas fa-arrow-left me-2"></i>Continue Shopping
            </button>
          </div>`;
        totalEl.textContent = "0.00";
        taxEl.textContent = "0.00";
        totalAmountEl.textContent = "0.00";
        document.getElementById("checkout-btn").classList.remove("pulse");
        document.getElementById("checkout-btn").disabled = true;
        return;
      }

      container.innerHTML = "";

      cart.forEach((item, index) => {
        const imagePath = item.image_path ? '/' + item.image_path.replace(/\\/g, '/') : 'https://via.placeholder.com/100';
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const itemEl = document.createElement("div");
        itemEl.className = "cart-item p-3 mb-3 animate__animated animate__fadeIn";
        itemEl.style.animationDelay = `${index * 0.1}s`;
        itemEl.innerHTML = `
          <div class="row align-items-center">
            <div class="col-md-2">
              <img src="${imagePath}" alt="${item.title}" class="product-img">
            </div>
            <div class="col-md-5">
              <h5 class="mb-1">${item.title}</h5>
              <p class="text-muted mb-2">${item.category || "General"}</p>
              <p class="text-success mb-0"><small>In Stock</small></p>
            </div>
            <div class="col-md-3">
              <div class="d-flex align-items-center">
                <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">−</button>
                <input type="text" class="quantity-input mx-2" value="${item.quantity}" disabled>
                <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
              </div>
            </div>
            <div class="col-md-2 text-end">
              <h5 class="mb-2">₹${itemTotal.toFixed(2)}</h5>
              <button class="remove-btn" onclick="removeItem(${index})">
                <i class="fas fa-trash-alt me-1"></i>Remove
              </button>
            </div>
          </div>`;
        
        container.appendChild(itemEl);
      });

      const tax = total * 0.18; // 18% tax
      const totalWithTax = total + tax;
      
      totalEl.textContent = total.toFixed(2);
      taxEl.textContent = tax.toFixed(2);
      totalAmountEl.textContent = totalWithTax.toFixed(2);
      
      // Enable checkout button if there are items
      document.getElementById("checkout-btn").classList.add("pulse");
      document.getElementById("checkout-btn").disabled = false;
    });

    function updateQuantity(index, change) {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart[index].quantity += change;
      
      if (cart[index].quantity <= 0) {
        showNotification(`${cart[index].title} removed from cart`);
        cart.splice(index, 1);
      } else {
        showNotification(`Quantity updated for ${cart[index].title}`);
      }
      
      localStorage.setItem("cart", JSON.stringify(cart));
      location.reload();
    }

    function removeItem(index) {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const removedItem = cart[index].title;
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      showNotification(`${removedItem} removed from cart`);
      setTimeout(() => location.reload(), 800);
    }

    function clearCart() {
      localStorage.removeItem("cart");
      showNotification("Cart cleared successfully");
      setTimeout(() => location.reload(), 800);
    }

    function showNotification(message) {
      const notification = document.getElementById("notification");
      const notificationMsg = document.getElementById("notification-message");
      
      notificationMsg.textContent = message;
      notification.classList.add("show");
      
      setTimeout(() => {
        notification.classList.remove("show");
      }, 3000);
    }

    // Checkout button animation
    document.getElementById("checkout-btn")?.addEventListener("click", function() {
      this.classList.remove("pulse");
      this.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Processing...';
      setTimeout(() => {
        alert("Checkout functionality would be implemented here");
        location.reload();
      }, 1500);
    });
  

    document.addEventListener('DOMContentLoaded', function() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  updateNavbarState(isLoggedIn);
});

function updateNavbar() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  const loginBtn = document.getElementById("login-btn");
  const profileBtn = document.getElementById("profileBtn");

  if (user) {
    if (loginBtn) loginBtn.classList.add("d-none");
    if (profileBtn) profileBtn.classList.remove("d-none");
  } else {
    if (loginBtn) loginBtn.classList.remove("d-none");
    if (profileBtn) profileBtn.classList.add("d-none");
  }
}

const user = JSON.parse(localStorage.getItem('user'));
if (user && user.name) {
  document.querySelector('#profileBtn .dropdown-toggle').textContent = `👤 ${user.name}`;
}

// At the end of every page's HTML
document.addEventListener('DOMContentLoaded', function() {
  updateCartCount(); // Initialize count
  
  // Optional: Listen for storage events to sync across tabs
  window.addEventListener('storage', function(e) {
    if (e.key === 'cart') {
      updateCartCount();
    }
  });
});

document.addEventListener("DOMContentLoaded", updateNavbar);


document.getElementById('checkout-btn').addEventListener('click', () => {
  // Get cart items from your logic
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

  if (cartItems.length === 0) {
    alert("Cart is empty!");
    return;
  }

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const checkoutData = {
    items: cartItems,
    subtotal,
    tax,
    total
  };

  sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));

  // Now redirect to checkout
  window.location.href = '/checkout';
});
