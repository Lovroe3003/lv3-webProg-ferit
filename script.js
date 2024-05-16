// Get elements
const cartButton = document.querySelector('.cart-button');
const cartBadge = document.querySelector('.cart-badge');
const modal = document.querySelector('.modal');
const modalClose = document.querySelector('.close');
const buyButton = document.querySelector('.buy-btn');
const cartItemsList = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const itemsGrid = document.querySelector('.items-grid');

const infoLabel = document.querySelector('.info-label');
const thankYouMessage = document.querySelector('.thank-you-message'); 
const walletAmount = document.querySelector('.wallet-amount');
const closeButton = document.querySelector('.close-btn');
const modalNormal = document.querySelector('.modal-normal');
const sortButton = document.querySelector(".sort-button");
const dropdownMenu = document.querySelector(".dropdown-menu");
const selectedSort = document.querySelector(".selected-sort");


let walletBalance = 75;
let cart = [];

// An example function that creates HTML elements using the DOM.
function fillItemsGrid() {
    for (const item of items) {
        let itemElement = document.createElement('div');
        itemElement.classList.add('item');
        itemElement.innerHTML = `
            <img src="https://picsum.photos/200/300?random=${item.id}" alt="${item.name}">
            <h2>${item.name}</h2>
            <p>$${item.price}</p>
            <button class="add-to-cart-btn" data-id="${item.id}">Add to cart</button>
        `;
        itemsGrid.appendChild(itemElement);
    }

    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    addToCartButtons.forEach((button) => {
        
        let itemId = button.getAttribute("data-id");
        button.addEventListener("click", () => addToCart(itemId));
    });
}

// Adding the .show-modal class to an element will make it visible
// because it has the CSS property display: block; (which overrides display: none;)
// See the CSS file for more details.
function toggleModal() {
  modal.classList.toggle('show-modal');
}

// Call fillItemsGrid function when page loads
fillItemsGrid();


// Example of DOM methods for adding event handling
cartButton.addEventListener('click', toggleModal);
cartButton.addEventListener('click', updateCartItemsList);
modalClose.addEventListener('click', toggleModal);


function addToCart(itemId){
    let item = items.find((item) => item.id == itemId);
    cart.push(item);
    cartBadge.textContent= cart.length;

    updateCartItemsList();
    updateCartTotal();
}

function updateCartItemsList(){
    cartItemsList.innerHTML = "";
    for (const item of cart) {
        let itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <h2>${item.name}</h2>
            <p>$${item.price}</p>
            <button class="remove-from-cart-btn" data-id="${item.id}">Remove</button>
        `;
        cartItemsList.appendChild(itemElement);
    }

    const removeFromCartButtons = document.querySelectorAll('.remove-from-cart-btn');
    removeFromCartButtons.forEach((button) => {
        
        let itemId = button.getAttribute("data-id");
        button.addEventListener("click", () => removeFromCart(itemId));
    });

    if (cart.length == 0) {
        infoLabel.innerText = "Your cart is empty!"
        infoLabel.style.display = "block";
        return;
    }
    else{
        infoLabel.style.display = "none";
    }
}

function updateCartTotal(){
    let totalPrice = calculateTotalPrice();
    cartTotal.innerText = `${totalPrice} €`;
}

function calculateTotalPrice(){
    let total=0;
    for(const item of cart){
        total += item.price;
    }
    return total.toFixed(2);
}

function removeFromCart(itemId) {
    let index = cart.findIndex((item) => item.id == itemId);
    cart.splice(index, 1);
    cartBadge.innerText = cart.length;

    updateCartItemsList();
    updateCartTotal();
}

buyButton.addEventListener("click", ()=>{
    if(walletBalance < calculateTotalPrice()){
        infoLabel.innerText = "You don't have enough money!"
        infoLabel.style.display = "block";
        return;
    }
    else if(cart.length == 0){
        infoLabel.innerText = "Cannot buy! Your cart is empty."
        infoLabel.style.display = "block";
        return;
    }
    else{
        infoLabel.style.display = "none";
    }
    cart.forEach((item) => {
        walletBalance-= item.price;
      });
    walletAmount.innerText = walletBalance.toFixed(2);
    
    cart = [];

    cartBadge.innerText = cart.length;
    updateCartItemsList();
    updateCartTotal();
    
    thankYouMessage.style.display = "block";
    modalNormal.style.display = "none";
});

closeButton.addEventListener("click", ()=>{
    thankYouMessage.style.display = "none";
    toggleModal();
    modalNormal.style.display = "block";
});

sortButton.addEventListener("click", ()=>{
    dropdownMenu.classList.toggle("show");
});

dropdownMenu.addEventListener("click", function (event) {
    if (event.target.tagName === "A") {
    const sortBy = event.target.getAttribute("data-sort");
    sortItems(sortBy);
    dropdownMenu.classList.remove("show");
    }
});

function sortItems(sortBy) {
    if (sortBy === "price-low-high") {
        items.sort((a, b) => a.price - b.price);
        selectedSort.innerHTML = "Price Low To High";
    } else if (sortBy === "price-high-low") {
        items.sort((a, b) => b.price - a.price);
        selectedSort.innerHTML = "Price High To Low";
    }

    itemsGrid.innerHTML = "";

    fillItemsGrid();
}