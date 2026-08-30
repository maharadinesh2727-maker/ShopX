/* ===================================
   PRODUCT DATA
=================================== */

const products = [

    {
        id: 1,
        name: "Premium Wireless Headphones",
        category: "electronics",
        price: 89.99,
        rating: 4.8,
        image: "🎧"
    },

    {
        id: 2,
        name: "Smart Watch Pro",
        category: "electronics",
        price: 129.99,
        rating: 4.7,
        image: "⌚"
    },

    {
        id: 3,
        name: "Classic White T-Shirt",
        category: "fashion",
        price: 24.99,
        rating: 4.5,
        image: "👕"
    },

    {
        id: 4,
        name: "Urban Running Shoes",
        category: "shoes",
        price: 74.99,
        rating: 4.9,
        image: "👟"
    },

    {
        id: 5,
        name: "Minimal Backpack",
        category: "accessories",
        price: 49.99,
        rating: 4.6,
        image: "🎒"
    },

    {
        id: 6,
        name: "Mechanical Keyboard",
        category: "electronics",
        price: 79.99,
        rating: 4.8,
        image: "⌨️"
    },

    {
        id: 7,
        name: "Premium Sunglasses",
        category: "accessories",
        price: 39.99,
        rating: 4.4,
        image: "🕶️"
    },

    {
        id: 8,
        name: "Casual Denim Jacket",
        category: "fashion",
        price: 499,
        rating: 4.7,
        image: "🧥"
    },

    {
        id: 9,
        name: "Gaming Mouse",
        category: "electronics",
        price: 45.99,
        rating: 4.8,
        image: "🖱️"
    },

    {
        id: 10,
        name: "Classic Sneakers",
        category: "shoes",
        price: 59.99,
        rating: 4.6,
        image: "👞"
    },

    {
        id: 11,
        name: "Leather Wallet",
        category: "accessories",
        price: 29.99,
        rating: 4.5,
        image: "👛"
    },

    {
        id: 12,
        name: "Bluetooth Speaker",
        category: "electronics",
        price: 55.99,
        rating: 4.7,
        image: "🔊"
    }

];


/* ===================================
   VARIABLES
=================================== */

let cart = JSON.parse(localStorage.getItem("shopxCart")) || [];

let wishlist = JSON.parse(localStorage.getItem("shopxWishlist")) || [];

let currentCategory = "all";

let searchTerm = "";


/* ===================================
   DOM ELEMENTS
=================================== */

const productGrid = document.getElementById("productGrid");

const searchInput = document.getElementById("searchInput");

const sortSelect = document.getElementById("sortSelect");

const cartSidebar = document.getElementById("cartSidebar");

const cartItems = document.getElementById("cartItems");

const cartCount = document.getElementById("cartCount");

const subtotalElement = document.getElementById("subtotal");

const totalElement = document.getElementById("total");

const emptyCart = document.getElementById("emptyCart");

const overlay = document.getElementById("overlay");

const checkoutModal = document.getElementById("checkoutModal");

const toast = document.getElementById("toast");

const wishlistCount = document.getElementById("wishlistCount");


/* ===================================
   DISPLAY PRODUCTS
=================================== */

function displayProducts() {

    let filteredProducts = products.filter(product => {

        const matchesCategory =
            currentCategory === "all" ||
            product.category === currentCategory;

        const matchesSearch =
            product.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        return matchesCategory && matchesSearch;

    });


    /* SORT */

    const sort = sortSelect.value;

    if (sort === "low") {

        filteredProducts.sort(
            (a, b) => a.price - b.price
        );

    }

    if (sort === "high") {

        filteredProducts.sort(
            (a, b) => b.price - a.price
        );

    }

    if (sort === "rating") {

        filteredProducts.sort(
            (a, b) => b.rating - a.rating
        );

    }


    productGrid.innerHTML = "";


    if (filteredProducts.length === 0) {

        document.getElementById("noProducts").style.display = "block";

        return;

    }

    document.getElementById("noProducts").style.display = "none";


    filteredProducts.forEach(product => {

        const isLiked = wishlist.includes(product.id);

        const card = document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `

            <div class="product-image">

                <span>${product.image}</span>

                <button
                    class="wishlist ${isLiked ? "liked" : ""}"
                    onclick="toggleWishlist(${product.id})"
                >
                    ${isLiked ? "❤️" : "♡"}
                </button>

            </div>


            <div class="product-info">

                <p class="product-category">
                    ${product.category}
                </p>

                <h3 class="product-name">
                    ${product.name}
                </h3>

                <div class="rating">
                    ★★★★★
                    <span>${product.rating}</span>
                </div>

                <div class="price-row">

                    <div class="price">
                        $${product.price.toFixed(2)}
                    </div>

                    <button
                        class="add-cart"
                        onclick="addToCart(${product.id})"
                    >
                        +
                    </button>

                </div>

            </div>

        `;

        productGrid.appendChild(card);

    });

}


/* ===================================
   ADD TO CART
=================================== */

function addToCart(id) {

    const product = products.find(
        product => product.id === id
    );

    const existingItem = cart.find(
        item => item.id === id
    );


    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({

            id: product.id,

            quantity: 1

        });

    }


    saveCart();

    updateCart();

    showToast(`${product.name} added to cart!`);

}


/* ===================================
   REMOVE FROM CART
=================================== */

function removeFromCart(id) {

    cart = cart.filter(
        item => item.id !== id
    );

    saveCart();

    updateCart();

}


/* ===================================
   CHANGE QUANTITY
=================================== */

function changeQuantity(id, change) {

    const item = cart.find(
        item => item.id === id
    );

    if (!item) return;


    item.quantity += change;


    if (item.quantity <= 0) {

        removeFromCart(id);

        return;

    }


    saveCart();

    updateCart();

}


/* ===================================
   UPDATE CART
=================================== */

function updateCart() {

    cartItems.innerHTML = "";


    let subtotal = 0;

    let totalQuantity = 0;


    if (cart.length === 0) {

        emptyCart.style.display = "block";

    } else {

        emptyCart.style.display = "none";

    }


    cart.forEach(item => {

        const product = products.find(
            product => product.id === item.id
        );

        if (!product) return;


        subtotal += product.price * item.quantity;

        totalQuantity += item.quantity;


        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";


        cartItem.innerHTML = `

            <div class="cart-item-image">
                ${product.image}
            </div>

            <div class="cart-item-info">

                <h4>
                    ${product.name}
                </h4>

                <div class="cart-item-price">
                    $${product.price.toFixed(2)}
                </div>

                <div class="quantity">

                    <button
                        onclick="changeQuantity(${product.id}, -1)"
                    >
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        onclick="changeQuantity(${product.id}, 1)"
                    >
                        +
                    </button>

                    <button
                        class="remove"
                        onclick="removeFromCart(${product.id})"
                    >
                        Remove
                    </button>

                </div>

            </div>

        `;


        cartItems.appendChild(cartItem);

    });


    cartCount.textContent = totalQuantity;

    subtotalElement.textContent =
        subtotal.toFixed(2);

    totalElement.textContent =
        subtotal.toFixed(2);

}


/* ===================================
   SAVE CART
=================================== */

function saveCart() {

    localStorage.setItem(
        "shopxCart",
        JSON.stringify(cart)
    );

}


/* ===================================
   CATEGORY FILTER
=================================== */

document.querySelectorAll(".category").forEach(button => {

    button.addEventListener("click", () => {

        document
            .querySelectorAll(".category")
            .forEach(btn =>
                btn.classList.remove("active")
            );


        button.classList.add("active");


        currentCategory =
            button.dataset.category;


        displayProducts();

    });

});


/* ===================================
   SEARCH
=================================== */

searchInput.addEventListener(
    "input",
    () => {

        searchTerm =
            searchInput.value.trim();

        displayProducts();

    }
);


/* ===================================
   SORT
=================================== */

sortSelect.addEventListener(
    "change",
    displayProducts
);


/* ===================================
   CART OPEN
=================================== */

document
    .getElementById("cartBtn")
    .addEventListener("click", () => {

        cartSidebar.classList.add("show");

        overlay.classList.add("show");

    });


/* ===================================
   CART CLOSE
=================================== */

function closeCart() {

    cartSidebar.classList.remove("show");

    overlay.classList.remove("show");

}

document
    .getElementById("closeCart")
    .addEventListener("click", closeCart);


overlay.addEventListener(
    "click",
    closeCart
);


/* ===================================
   WISHLIST
=================================== */

function toggleWishlist(id) {

    if (wishlist.includes(id)) {

        wishlist =
            wishlist.filter(
                item => item !== id
            );

        showToast("Removed from wishlist");

    } else {

        wishlist.push(id);

        showToast("Added to wishlist ❤️");

    }


    localStorage.setItem(
        "shopxWishlist",
        JSON.stringify(wishlist)
    );


    updateWishlistCount();

    displayProducts();

}


/* ===================================
   WISHLIST COUNT
=================================== */

function updateWishlistCount() {

    wishlistCount.textContent =
        wishlist.length;

}


/* ===================================
   TOAST
=================================== */

function showToast(message) {

    toast.querySelector("p").textContent =
        message;


    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 2200);

}


/* ===================================
   DARK MODE
=================================== */

const themeBtn =
    document.getElementById("themeBtn");


if (
    localStorage.getItem("shopxTheme") === "dark"
) {

    document.body.classList.add("dark");

    themeBtn.textContent = "☀️";

}


themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");


    const dark =
        document.body.classList.contains("dark");


    themeBtn.textContent =
        dark ? "☀️" : "🌙";


    localStorage.setItem(
        "shopxTheme",
        dark ? "dark" : "light"
    );

});


/* ===================================
   CHECKOUT
=================================== */

document
    .getElementById("checkoutBtn")
    .addEventListener("click", () => {

        if (cart.length === 0) {

            showToast("Your cart is empty!");

            return;

        }


        checkoutModal.classList.add("show");

    });


/* ===================================
   CLOSE MODAL
=================================== */

document
    .getElementById("closeModal")
    .addEventListener("click", () => {

        checkoutModal.classList.remove("show");

    });


/* ===================================
   CHECKOUT FORM
=================================== */

document
    .getElementById("checkoutForm")
    .addEventListener("submit", (event) => {

        event.preventDefault();


        const name =
            document.getElementById("customerName").value;


        alert(
            `🎉 Thank you ${name}!\n\nYour order has been placed successfully.`
        );


        cart = [];

        saveCart();

        updateCart();


        checkoutModal.classList.remove("show");

        closeCart();

        event.target.reset();

    });


/* ===================================
   INITIAL LOAD
=================================== */

displayProducts();

updateCart();

updateWishlistCount();