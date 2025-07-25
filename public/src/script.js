document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/featured-products')
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('featured-products');
      container.innerHTML = '';

      Object.values(data).forEach(product => {
        if (!product) return;

        const imagePath = product.image_path.replace(/\\|\\/g, '/');

        container.innerHTML += `
          <div class="col-12 col-sm-6 col-lg-3 mb-4 m-auto">
            <div class="cart-card card h-100">
              <div class="badge bg-danger position-absolute" style="top: 10px; right: 10px;">Sale</div>
              <img src="/${imagePath}" class="card-img-top" alt="${product.title}" style="height: 200px; object-fit: contain;">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">${product.title}</h5>
                <p class="card-text flex-grow-1">${product.description}</p>
                <div class="d-flex justify-content-between align-items-center mt-2">
                  <span class="price-tag"><span class="rupee-symbol">₹</span>${product.price}</span>
                  <button class="btn btn-success text-white" onclick='addToCart(${JSON.stringify(product)})'>Add to Cart</button>
                </div>
              </div>
            </div>
          </div>
        `;
      });
    })
    .catch(err => console.error('Error loading featured products:', err));
});

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existing = cart.find(p => p.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    product.quantity = 1;
    cart.push(product);
  }
  
  // Calculate total quantity
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  // Update UI
  const cart_num = document.getElementById("cart-count");
  if (cart_num) {
    cart_num.textContent = total;
  }
  
  // Save to storage
  localStorage.setItem('cart', JSON.stringify(cart));
  
   showCartFeedback();
  // Show toast
  const toastEl = document.getElementById('cartToast');
  const toast = new bootstrap.Toast(toastEl);
  toast.show();
  
}


// Update the login form submission
document.getElementById("loginForm")?.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("emailInput").value.trim();
  const password = document.getElementById("passwordInput").value.trim();
  const messageBox = document.getElementById("loginMessage");

  // Clear previous message
  messageBox.classList.add('d-none');
  messageBox.textContent = "";

  try {
    const res = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      messageBox.className = "alert alert-success";
      messageBox.textContent = data.message || "Login successful!";
      
      // Store user data in localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(data.user || {}));
      
      // Update UI
      updateLoginUI(true);
      
      setTimeout(() => {
        // Close modal if using Bootstrap
        const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        if (modal) modal.hide();
        window.location.reload(); // Refresh to update the UI
      }, 1000);
    } else {
      messageBox.className = "alert alert-danger";
      messageBox.textContent = data.error || "Invalid credentials";
      messageBox.classList.remove("d-none");
    }
  } catch (err) {
    messageBox.className = "alert alert-danger";
    messageBox.textContent = "Something went wrong!";
    messageBox.classList.remove("d-none");
    console.error(err);
  }
});

// Function to update UI based on login status
function updateLoginUI(isLoggedIn) {
  const loginBtn = document.getElementById("login-btn");
  const profileBtn = document.getElementById("profileBtn");
  
  if (!loginBtn || !profileBtn) return;
  
  if (isLoggedIn) {
    loginBtn.classList.add("d-none");
    profileBtn.classList.remove("d-none");
  } else {
    loginBtn.classList.remove("d-none");
    profileBtn.classList.add("d-none");
  }
}

//  updateNavbar();

// Function to logout
function logout() {
  // Clear the actual login key used
  localStorage.removeItem('loggedInUser'); // ✅ this is the key used during login

  // Update navbar UI
  const loginBtn = document.getElementById("login-btn");
  const profileBtn = document.getElementById("profileBtn");

  if (loginBtn && profileBtn) {
    loginBtn.classList.remove("d-none");
    profileBtn.classList.add("d-none");
  }

  // Optional: Server-side logout
  fetch('/api/logout', {
    method: 'POST',
    credentials: 'same-origin'
  }).catch(err => console.error('Logout error:', err));

  // Optional: Redirect
  // setTimeout(() => {
  //   window.location.href = '/';
  // }, 300);
}



// Check login status when page loads
document.addEventListener('DOMContentLoaded', function() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  updateLoginUI(isLoggedIn);
});

const user = JSON.parse(localStorage.getItem('user'));
if (user && user.name) {
  document.querySelector('#profileBtn .dropdown-toggle').textContent = `👤 ${user.name}`;
}

// localStorage.setItem('isLoggedIn', 'true');
// localStorage.setItem('user', JSON.stringify(userData)); // Store user data if needed
// updateNavbarState(true); // Update UI immediately



function showCartFeedback() {
  const cartBtn = document.getElementById('cart-btn');
  const feedback = document.createElement('div');
  feedback.className = 'cart-feedback';
  
  // Create random animation style
  const styles = ['thumbs-up-big', 'thumbs-up-bounce', 'thumbs-up-sparkle'];
  const randomStyle = styles[Math.floor(Math.random() * styles.length)];
  
  feedback.innerHTML = `<div class="${randomStyle}">👍</div>`;
  
  // Add to button
  cartBtn.appendChild(feedback);
  
  // Remove after animation completes
  setTimeout(() => {
    feedback.remove();
  }, 1500);
}
// Initialize cart count on page load
// document.addEventListener('DOMContentLoaded', function() {
//   const cart = JSON.parse(localStorage.getItem('cart')) || [];
//   const total = cart.reduce((sum, item) => sum + item.quantity, 0);
//   document.getElementById('cart-count').textContent = total;
// });

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
} // Call to update navbar state

let currentFocus = -1;

function searchProducts() {
    const input = document.getElementById('searchBox');
    const val = input.value.trim();
    const resultsContainer = document.getElementById('searchResultsList');
    const dropdown = document.getElementById('searchResults');
    
    if (val.length < 2) {
        dropdown.style.display = 'none';
        return;
    }
    
    // Simulate API call (replace with actual fetch)
    fetch(`/api/search?q=${encodeURIComponent(val)}`)
        .then(response => response.json())
        .then(products => {
            resultsContainer.innerHTML = '';
            
            if (products.length === 0) {
                resultsContainer.innerHTML = '<div class="no-results">No products found</div>';
                dropdown.style.display = 'block';
                return;
            }
            
            products.forEach((product, index) => {
                const item = document.createElement('div');
                item.className = 'search-result-item';
                item.innerHTML = `
                    <div class="d-flex align-items-center">
                        <img src="${product.image || 'placeholder.jpg'}" alt="${product.name}" 
                             style="width: 40px; height: 40px; object-fit: cover; margin-right: 10px;">
                        <div>
                            <h6 class="mb-0">${product.name}</h6>
                            <small class="text-muted">₹${product.price.toFixed(2)}</small>
                        </div>
                    </div>
                `;
                
                item.addEventListener('click', () => {
                    window.location.href = `/product/${product.id}`;
                });
                
                resultsContainer.appendChild(item);
            });
            
            dropdown.style.display = 'block';
        })
        .catch(error => {
            console.error('Search error:', error);
        });
}

// Keyboard navigation for dropdown
document.getElementById('searchBox').addEventListener('keydown', function(e) {
    const dropdown = document.getElementById('searchResults');
    const items = document.querySelectorAll('.search-result-item');
    
    if (!dropdown || dropdown.style.display === 'none') return;
    
    // Down arrow
    if (e.key === 'ArrowDown') {
        currentFocus++;
        setActive(items);
    }
    // Up arrow
    else if (e.key === 'ArrowUp') {
        currentFocus--;
        setActive(items);
    }
    // Enter
    else if (e.key === 'Enter') {
        e.preventDefault();
        if (currentFocus > -1 && items[currentFocus]) {
            items[currentFocus].click();
        }
    }
});

function setActive(items) {
    if (!items) return;
    
    // Remove active class from all items
    items.forEach(item => {
        item.classList.remove('active');
    });
    
    // Set current item as active
    if (currentFocus >= items.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = items.length - 1;
    
    if (items[currentFocus]) {
        items[currentFocus].classList.add('active');
        items[currentFocus].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('searchResults');
    const searchBox = document.getElementById('searchBox');
    
    // Only proceed if dropdown exists
    if (!dropdown) return;
    
    // Check if click is outside dropdown and not on search box
    if (!dropdown.contains(e.target) && e.target !== searchBox) {
        dropdown.style.display = 'none';
        currentFocus = -1;
    }
});