const cartItems = document.querySelector('.cart__items');
const loading = document.querySelector('.loading');
const sectionItems = document.querySelector('.items');
const searchButton = document.querySelector('.search-button');
const inputButton = document.querySelector('.input');
const items = document.querySelector('.items');
const totalPrice = document.querySelector('.total-price');
let price = 0;

function saveCart() {
  localStorage.setItem('cartItems', cartItems.innerHTML);
  localStorage.setItem('totalPrice', totalPrice.innerHTML);
}

function getSavedCart() {
  cartItems.innerHTML = localStorage.getItem('cartItems');
  const priceLocalStorage = Number(localStorage.getItem('totalPrice'));
  price = priceLocalStorage;
  totalPrice.innerHTML = priceLocalStorage;
}

function sumPrices(salePrice) {
  price += salePrice;
  const roundNumber = Math.round(price * 100) / 100;
  totalPrice.innerHTML = roundNumber;
}

function decreasePrices(event) {
  const getStringPrice = event.target.innerHTML.split('PRICE: $')[1];
  const getNumberPrice = Number(getStringPrice);
  price -= getNumberPrice;
  const roundNumber = Math.round(price * 100) / 100;
  totalPrice.innerHTML = roundNumber;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const click = event.target;
  if (click.innerHTML.split('|').length === 3) {
    decreasePrices(event);
    click.remove();
  }
  saveCart();
}
cartItems.addEventListener('click', cartItemClickListener);

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  sumPrices(salePrice);
  return cartItems.appendChild(li);
}

function getInfosApi(object) {
  const infos = object.map((element) => ({
     sku: element.id,
     name: element.title,
     image: element.thumbnail,
    }));
  return infos.forEach((product) => {
    sectionItems.appendChild(createProductItemElement(product));
  });
}

async function getInfosCart(object) {
  return {
    sku: object.id,
    name: object.title,
    salePrice: object.price,
   };
}

function clearCart() {
  const emptyCart = document.querySelector('.empty-cart');
  emptyCart.addEventListener('click', () => {
    price = 0;
    totalPrice.innerHTML = 0;
    cartItems.innerHTML = '';
    saveCart();
  });
}
clearCart();

async function fetchProductId(id) {
  const urlFetch = `https://api.mercadolibre.com/items/${id}`;
  const response = await fetch(urlFetch);
  const data = await response.json();
  const filteredData = await getInfosCart(data);
  cartItems.appendChild(createCartItemElement(filteredData));
  saveCart();
}

async function clickButtonCart() {
  const addButton = document.querySelectorAll('.item__add');
  addButton.forEach((button) => button.addEventListener('click', (event) => {
    const clickedItem = event.target.parentNode.firstChild.innerText;
    fetchProductId(clickedItem);
  }));
}

const urlFetch = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

async function fetchApi(url) {
  const response = await fetch(url);
  const json = await response.json();
  const data = json.results;
  getInfosApi(data);
  clickButtonCart();
  loading.parentNode.removeChild(loading);
}

fetchApi(urlFetch);

searchButton.addEventListener('click', () => {
  items.innerHTML = '';
  fetchApi(`https://api.mercadolibre.com/sites/MLB/search?q=${inputButton.value}`);
});

window.onload = () => { 
  getSavedCart();
};