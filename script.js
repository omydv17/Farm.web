/*
  script.js — Vanilla JS for farm store
  - Renders product grid
  - Modal for product details
  - Cart stored in localStorage
  - Checkout form with success state

  Comments included so you can swap images/prices easily.
*/

const products = [
  { id: 'honey', title: 'Organic Honey', price: 12.0, weight: '16 oz', stock: 8, img: 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=800&q=80', desc: 'Raw wildflower honey — unfiltered. Great with tea or toast.', origin: 'Bee Meadow' },
  { id: 'kale', title: 'Fresh Kale', price: 4.5, weight: '1 bunch', stock: 20, img: 'https://images.unsplash.com/photo-1508747703725-7197a1d0b7f5?auto=format&fit=crop&w=800&q=80', desc: 'Crisp, nutrient-dense curly kale. Perfect for salads and smoothies.', origin: 'Green Pastures' },
  { id: 'eggs', title: 'Organic Eggs (Dozen)', price: 6.5, weight: '12 pcs', stock: 24, img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80', desc: 'Free-range eggs from pasture-raised hens.', origin: 'Sunny Ridge Farm' },

  // Additional items added
  { id: 'carrots', title: 'Sweet Carrots', price: 3.25, weight: '1 lb', stock: 30, img: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?auto=format&fit=crop&w=800&q=80', desc: 'Crunchy, sweet carrots — great for snacking or roasting.', origin: 'Sun Valley Farm' },
  { id: 'tomatoes', title: 'Heirloom Tomatoes', price: 5.5, weight: '1 lb', stock: 16, img: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=80', desc: 'Juicy heirloom tomatoes with rich flavor.', origin: 'Red Orchard' },
  { id: 'cheese', title: 'Fresh Goat Cheese', price: 9.0, weight: '8 oz', stock: 10, img: 'https://images.unsplash.com/photo-1585238342028-9a6a19a8e5d8?auto=format&fit=crop&w=800&q=80', desc: 'Creamy artisan goat cheese — tangy and smooth.', origin: 'Hilltop Creamery' },
  { id: 'maple', title: 'Pure Maple Syrup', price: 14.0, weight: '12 oz', stock: 6, img: 'https://images.unsplash.com/photo-1508739826987-b79cd8b7da0a?auto=format&fit=crop&w=800&q=80', desc: 'Single-origin maple syrup — perfect for pancakes and glazing.', origin: 'Maple Ridge' },
  { id: 'blueberries', title: 'Fresh Blueberries', price: 6.0, weight: '6 oz', stock: 18, img: 'https://images.unsplash.com/photo-1506807803488-8eafc1534f3b?auto=format&fit=crop&w=800&q=80', desc: 'Sweet, ripe blueberries — great for baking or snacking.', origin: 'Berry Fields' }
]

// DOM refs
const grid = document.getElementById('productGrid')
const modalBackdrop = document.getElementById('modalBackdrop')
const modalContent = document.getElementById('modalContent')
const closeModalBtn = document.getElementById('closeModal')
const cartBtn = document.getElementById('cartBtn')
const cartDrawer = document.getElementById('cartDrawer')
const closeCartBtn = document.getElementById('closeCart')
const cartItemsEl = document.getElementById('cartItems')
const cartCount = document.getElementById('cartCount')
const cartTotal = document.getElementById('cartTotal')
const checkoutBtn = document.getElementById('checkoutBtn')
const checkoutBackdrop = document.getElementById('checkoutBackdrop')
const checkoutForm = document.getElementById('checkoutForm')
const checkoutSuccess = document.getElementById('checkoutSuccess')
const cancelCheckout = document.getElementById('cancelCheckout')

// Local storage helpers
const CART_KEY = 'farm_cart_v1'
function loadCart(){
  try{ return JSON.parse(localStorage.getItem(CART_KEY)) || [] }catch(e){return []}
}
function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)) }

let cart = loadCart()

function formatPrice(v){ return v.toFixed(2) }

// Render functions
function renderProducts(){
  grid.innerHTML = ''
  products.forEach(p => {
    const card = document.createElement('article')
    card.className = 'product-card'
    card.innerHTML = `
      <div class="product-media" style="background-image:url('${p.img}')"></div>
      <div class="product-body">
        <h4 class="product-title">${p.title}</h4>
        <div class="product-meta">${p.weight} • $${formatPrice(p.price)}</div>
        <div class="product-row">
          <div class="in-stock">${p.stock>0? 'In stock':'Out of stock'}</div>
          <div>
            <button class="btn add-btn" data-id="${p.id}">Add</button>
            <button class="btn btn-outline" data-id="${p.id}" data-action="view">View Details</button>
          </div>
        </div>
      </div>
    `
    grid.appendChild(card)
  })
}

function openModal(html){
  modalContent.innerHTML = html
  modalBackdrop.classList.add('open')
  modalBackdrop.setAttribute('aria-hidden', 'false')
}
function closeModal(){
  modalBackdrop.classList.remove('open')
  modalBackdrop.setAttribute('aria-hidden', 'true')
  setTimeout(()=>{ modalContent.innerHTML = '' }, 220)
}

function renderCart(){
  cartItemsEl.innerHTML = ''
  if(cart.length===0){ cartItemsEl.innerHTML = '<div class="muted">Cart is empty</div>' }
  cart.forEach(item => {
    const el = document.createElement('div')
    el.className = 'cart-item'
    el.innerHTML = `
      <img src="${item.img}" alt="${item.title}">
      <div style="flex:1">
        <div style="font-weight:600">${item.title}</div>
        <div style="font-size:.9rem;color:var(--muted)">$${formatPrice(item.price)} • ${item.weight}</div>
      </div>
      <div class="cart-controls">
        <button class="btn" data-action="dec" data-id="${item.id}">-</button>
        <div>${item.qty}</div>
        <button class="btn" data-action="inc" data-id="${item.id}">+</button>
        <button class="btn" data-action="remove" data-id="${item.id}">Remove</button>
      </div>
    `
    cartItemsEl.appendChild(el)
  })
  const total = cart.reduce((s,i)=> s + i.price * i.qty, 0)
  cartTotal.textContent = formatPrice(total)
  cartCount.textContent = cart.reduce((s,i)=>s+i.qty,0)
}

function addToCart(id, qty=1){
  const prod = products.find(p=>p.id===id)
  if(!prod) return
  const existing = cart.find(i=>i.id===id)
  if(existing){ existing.qty = Math.min(existing.qty + qty, prod.stock) }
  else { cart.push({ id: prod.id, title:prod.title, price:prod.price, weight:prod.weight, img:prod.img, qty: Math.min(qty, prod.stock) }) }
  saveCart(cart)
  renderCart()
}

function changeQty(id, delta){
  const item = cart.find(i=>i.id===id)
  if(!item) return
  item.qty = Math.max(1, item.qty + delta)
  saveCart(cart)
  renderCart()
}

function removeFromCart(id){
  cart = cart.filter(i=>i.id!==id)
  saveCart(cart)
  renderCart()
}

// Event Delegation
grid.addEventListener('click', (e)=>{
  const btn = e.target.closest('button')
  if(!btn) return
  const id = btn.dataset.id
  const action = btn.dataset.action
  if(action === 'view'){
    const p = products.find(x=>x.id===id)
    openModal(`
      <h3>${p.title}</h3>
      <img src="${p.img}" alt="${p.title}">
      <p>${p.desc}</p>
      <p><strong>Origin:</strong> ${p.origin}</p>
      <p><strong>Price:</strong> $${formatPrice(p.price)}</p>
      <div style="margin-top:.75rem;"><button class="btn btn-primary" data-id="${p.id}" data-action="add-modal">Add to cart</button></div>
    `)
  } else if(btn.classList.contains('add-btn')){
    addToCart(id)
  }
})

// Modal add-to-cart
modalContent.addEventListener('click', (e)=>{
  const btn = e.target.closest('button')
  if(!btn) return
  const id = btn.dataset.id
  const action = btn.dataset.action
  if(action === 'add-modal'){
    addToCart(id)
    closeModal()
  }
})

closeModalBtn.addEventListener('click', closeModal)
modalBackdrop.addEventListener('click', (e)=>{ if(e.target === modalBackdrop) closeModal() })

// Cart drawer open/close
cartBtn.addEventListener('click', ()=>{
  const open = cartDrawer.classList.toggle('open')
  cartBtn.setAttribute('aria-expanded', String(open))
})
closeCartBtn.addEventListener('click', ()=> cartDrawer.classList.remove('open'))

// Cart item controls
cartItemsEl.addEventListener('click', (e)=>{
  const btn = e.target.closest('button')
  if(!btn) return
  const id = btn.dataset.id
  const action = btn.dataset.action
  if(action === 'inc') changeQty(id, 1)
  if(action === 'dec') changeQty(id, -1)
  if(action === 'remove') removeFromCart(id)
})

// Checkout flow
checkoutBtn.addEventListener('click', ()=>{
  checkoutBackdrop.classList.add('open')
  checkoutBackdrop.setAttribute('aria-hidden','false')
  checkoutForm.hidden = false
  checkoutSuccess.hidden = true
})
document.getElementById('closeCheckout').addEventListener('click', ()=>{ checkoutBackdrop.classList.remove('open'); checkoutBackdrop.setAttribute('aria-hidden','true') })
cancelCheckout.addEventListener('click', ()=>{ checkoutBackdrop.classList.remove('open'); checkoutBackdrop.setAttribute('aria-hidden','true') })

checkoutForm.addEventListener('submit', (e)=>{
  e.preventDefault()
  // In a real app you'd validate and post to server
  checkoutForm.hidden = true
  checkoutSuccess.hidden = false
  // clear cart
  cart = []
  saveCart(cart)
  renderCart()
})

document.getElementById('successClose').addEventListener('click', ()=>{ checkoutBackdrop.style.display='none'; checkoutBackdrop.setAttribute('aria-hidden','true') })

// Hero / browse buttons
document.getElementById('heroBrowse').addEventListener('click', ()=>{ document.getElementById('products').scrollIntoView({behavior:'smooth'}) })
document.getElementById('browseBtn').addEventListener('click', ()=>{ document.getElementById('products').scrollIntoView({behavior:'smooth'}) })

// Initial render
renderProducts()
renderCart()

// Keyboard: Escape closes modal, checkout, or cart when open
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return
  if (modalBackdrop.classList.contains('open')) { closeModal(); return }
  if (checkoutBackdrop.classList.contains('open')) { checkoutBackdrop.classList.remove('open'); checkoutBackdrop.setAttribute('aria-hidden','true'); return }
  if (cartDrawer.classList.contains('open')) { cartDrawer.classList.remove('open'); cartBtn.setAttribute('aria-expanded','false'); return }
})
