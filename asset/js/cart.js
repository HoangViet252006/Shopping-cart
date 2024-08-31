import products from "./product.js";

var app = document.getElementById('app');
var temporaryContent = document.getElementById('temporaryContent');


function loadListProduct(searchText) {
    let listProductHTML = document.querySelector('.listProduct');
    listProductHTML.innerHTML = null;

    products.forEach(product => {
        if (!product.name.toUpperCase().includes(searchText.toUpperCase())) {
            return;
        }
        let newProduct = document.createElement('div');
        newProduct.classList.add('item');
        newProduct.innerHTML =
            `<a href="/detail.html?id=${product.id}">
             <img src="${product.image}">
         </a>
         <h2>${product.name}</h2>
         <div class="price">$${product.price}</div>
         <button 
             class="addCart" 
             data-id='${product.id}'>
                 Add To Cart
         </button>`;
        listProductHTML.appendChild(newProduct);
    });
}
const initApp = () => {
    // load list product
    loadListProduct();

}


const cart = () => {
    var search = document.querySelector('.header__search-input');
    var searchBtn = document.querySelector('.header__search-btn');

    function searchClick(e, isClearInput) {
        var content = search.value;
        if (isClearInput) {
            search.value = '';
        }
        loadListProduct(content);
    }

    searchBtn.addEventListener('click', e => {
        searchClick(e, true);
    });

    search.addEventListener("keyup", e => {
        let contentSearch = search.value.trim();
        let isClearInput = false;
        if (e.key != "Enter") {
            true;
        }
        searchClick(contentSearch, isClearInput);
    });

    let listCartHTML = document.querySelector('.listCart');
    let iconCart = document.querySelector('.icon-cart');
    let iconCartSpan = iconCart.querySelector('span');
    let body = document.querySelector('body');
    let closeCart = document.querySelector('.close');
    let cart = [];

    let modalCart = document.querySelector('.modal');
    let btnYes = document.querySelector('.btn-yes');
    let btnNo = document.querySelector('.btn-no');
    let modalItemName = document.querySelector('.modal-itemName')

    // localStorage.clear();

    // open and close tab

    iconCart.addEventListener('click', () => {
        body.classList.toggle('activeTabCart');
    })
    closeCart.addEventListener('click', () => {
        body.classList.toggle('activeTabCart');
    })

    function showModalCart(idProduct) {
        modalCart.classList.add('open');
        products.forEach(product => {
            if (product.id == idProduct) {
                modalItemName.innerText = product.name;
            }
        });
    }

    function hideModalCart() {
        modalCart.classList.remove('open');
    }

    const setProductInCart = (idProduct, value) => {
        let positionThisProductInCart = cart.findIndex((value) => value.product_id == idProduct);
        if (value === 'remove') {
            cart.splice(positionThisProductInCart, 1);
        } else if (value === 0) {
            let eventHandled = false;
            showModalCart(idProduct);
            btnNo.addEventListener('click', hideModalCart);
            btnYes.addEventListener('click', (e) => {
                if (!eventHandled) {
                    eventHandled = true;
                    hideModalCart();
                    setProductInCart(idProduct, 'remove');
                }
            })
        } else if (positionThisProductInCart < 0) {
            cart.push({
                product_id: idProduct,
                quantity: 1
            });
        } else {
            cart[positionThisProductInCart].quantity = value;
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        addCartToHTML();
    }

    const addCartToHTML = () => {
        listCartHTML.innerHTML = '';
        let totalQuantity = 0;
        if (cart.length > 0) {
            cart.forEach(item => {
                totalQuantity = totalQuantity + item.quantity;
                let newItem = document.createElement('div');
                newItem.classList.add('item');
                newItem.dataset.id = item.product_id;

                let positionProduct = products.findIndex((value) => value.id == item.product_id);
                let info = products[positionProduct];
                listCartHTML.appendChild(newItem);
                newItem.innerHTML = `
                <div class="image">
                        <img src="${info.image}">
                    </div>
                    <div class="name">
                    ${info.name}
                    </div>
                    <div class="totalPrice">$${info.price * item.quantity}</div>
                    <div class="quantity">
                        <span class="minus" data-id="${info.id}"><</span>
                        <span>${item.quantity}</span>
                        <span class="plus" data-id="${info.id}">></span>
                         <span class="del" data-id="${info.id}">X
                         </span>
                    </div>
                `;
            })
        }
        iconCartSpan.innerText = totalQuantity;
    }

    function dangerCart(idProduct) {
        let listCart = document.querySelectorAll('.item');
        listCart.forEach(cart => {
            if (cart.dataset.id == idProduct) {
                cart.classList.add('danger');
                setTimeout(function() {
                    cart.classList.remove('danger');
                }, 1000);
            }

        })
    }

    document.addEventListener('click', (event) => {
        let buttonClick = event.target;
        let idProduct = buttonClick.dataset.id;
        let quantity = null;
        let positionProductInCart = cart.findIndex((value) => value.product_id == idProduct);
        switch (true) {
            case (buttonClick.classList.contains('addCart')):
                if (!body.classList.contains('activeTabCart')) {
                    body.classList.add('activeTabCart');
                }
                if (positionProductInCart >= 0) {
                    dangerCart(idProduct);
                } else {
                    quantity = (positionProductInCart < 0) ? 1 : cart[positionProductInCart].quantity + 1;
                    setProductInCart(idProduct, quantity);
                }
                break;
            case (buttonClick.classList.contains('minus')):
                quantity = cart[positionProductInCart].quantity - 1;
                setProductInCart(idProduct, quantity);
                break;
            case (buttonClick.classList.contains('plus')):
                quantity = cart[positionProductInCart].quantity + 1;
                setProductInCart(idProduct, quantity);
                break;
            case (buttonClick.classList.contains('del')):
                quantity = 'remove';
                setProductInCart(idProduct, quantity);
            default:
                break;
        }
    })

    const initApp = () => {
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    }
    initApp();
}
export default cart;