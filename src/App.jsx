import { startTransition, useEffect, useMemo, useState } from "react";

const storageKeys = {
  products: "a1_products",
  orders: "a1_orders",
  session: "a1_session",
  wishlist: "a1_wishlist",
  profile: "a1_profile"
};

const freeDeliveryThreshold = 50000;
const standardDeliveryFee = 199;
const orderStatuses = ["Placed", "Packed", "Shipped", "Delivered"];

const demoUsers = [
  { email: "admin@a1mobiles.com", password: "admin123", role: "admin", name: "Store Admin" },
  { email: "user@a1mobiles.com", password: "user123", role: "customer", name: "Guest Buyer" }
];

const coupons = [
  { code: "SAVE10", type: "percent", value: 10, minOrder: 30000, label: "10% off on orders above Rs. 30,000" },
  { code: "FLAT500", type: "flat", value: 500, minOrder: 20000, label: "Flat Rs. 500 off on orders above Rs. 20,000" },
  { code: "PREMIUM1500", type: "flat", value: 1500, minOrder: 70000, label: "Flat Rs. 1,500 off on premium orders" }
];

const defaultProducts = [
  {
    id: crypto.randomUUID(),
    name: "iPhone 16 Pro",
    brand: "Apple",
    category: "Premium",
    basePrice: 119900,
    stock: 8,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1583573636246-18cb2246697d?auto=format&fit=crop&w=900&q=80"
    ],
    colors: ["Natural Titanium", "Black Titanium", "Desert Gold"],
    storageOptions: ["128GB", "256GB", "512GB"],
    description: "Titanium design, pro camera system, and premium flagship performance.",
    specs: {
      ram: 8,
      storage: 256,
      camera: 48,
      battery: 3582,
      display: "6.3-inch Super Retina XDR",
      chipset: "A18 Pro"
    },
    reviews: [
      { user: "Ravi", rating: 5, text: "Camera and performance are excellent for everyday use." },
      { user: "Meena", rating: 4, text: "Great display and battery backup. Premium feel throughout." }
    ]
  },
  {
    id: crypto.randomUUID(),
    name: "Samsung Galaxy S25",
    brand: "Samsung",
    category: "Premium",
    basePrice: 84999,
    stock: 12,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=900&q=80"
    ],
    colors: ["Phantom Black", "Silver Blue", "Mint"],
    storageOptions: ["256GB", "512GB"],
    description: "AMOLED display, AI-powered camera tools, and dependable battery life.",
    specs: {
      ram: 12,
      storage: 256,
      camera: 50,
      battery: 4700,
      display: "6.7-inch Dynamic AMOLED",
      chipset: "Snapdragon 8 Elite"
    },
    reviews: [
      { user: "Asha", rating: 5, text: "Display quality is top class and photos look very crisp." },
      { user: "Kiran", rating: 4, text: "Fast, smooth, and good battery even with heavy use." }
    ]
  },
  {
    id: crypto.randomUUID(),
    name: "OnePlus 13R",
    brand: "OnePlus",
    category: "Performance",
    basePrice: 42999,
    stock: 15,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=900&q=80"
    ],
    colors: ["Nebula Black", "Cool Blue"],
    storageOptions: ["128GB", "256GB"],
    description: "Fast charging and smooth gaming-focused performance.",
    specs: {
      ram: 12,
      storage: 256,
      camera: 50,
      battery: 5500,
      display: "6.78-inch AMOLED 120Hz",
      chipset: "Snapdragon 8 Gen 3"
    },
    reviews: [
      { user: "Hari", rating: 5, text: "Excellent speed for gaming and multitasking." },
      { user: "Devi", rating: 4, text: "Charges very quickly and feels smooth to use." }
    ]
  },
  {
    id: crypto.randomUUID(),
    name: "Redmi Note 14 Pro",
    brand: "Xiaomi",
    category: "Value",
    basePrice: 26999,
    stock: 20,
    image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1510557880182-3f8a7a2f68f3?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=900&q=80"
    ],
    colors: ["Arctic White", "Midnight Blue", "Lavender"],
    storageOptions: ["128GB", "256GB"],
    description: "Great value with a strong battery, bright display, and balanced camera.",
    specs: {
      ram: 8,
      storage: 128,
      camera: 200,
      battery: 5100,
      display: "6.67-inch AMOLED",
      chipset: "Dimensity 7300"
    },
    reviews: [
      { user: "Naveen", rating: 4, text: "Very strong value for the price range." },
      { user: "Pooja", rating: 4, text: "Camera and battery are really solid for daily use." }
    ]
  },
  {
    id: crypto.randomUUID(),
    name: "Vivo V40",
    brand: "Vivo",
    category: "Camera",
    basePrice: 34999,
    stock: 10,
    image: "https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80"
    ],
    colors: ["Lotus Purple", "Starlight Silver"],
    storageOptions: ["256GB"],
    description: "Portrait-first phone with polished photography and slim design.",
    specs: {
      ram: 8,
      storage: 256,
      camera: 50,
      battery: 5000,
      display: "6.78-inch AMOLED",
      chipset: "Snapdragon 7 Gen 3"
    },
    reviews: [
      { user: "Ishita", rating: 5, text: "Portrait photos look great straight out of camera." },
      { user: "Sanjay", rating: 4, text: "Very light and comfortable to hold." }
    ]
  },
  {
    id: crypto.randomUUID(),
    name: "Google Pixel 9",
    brand: "Google",
    category: "Camera",
    basePrice: 79999,
    stock: 9,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=900&q=80"
    ],
    colors: ["Obsidian", "Porcelain", "Rose"],
    storageOptions: ["128GB", "256GB"],
    description: "Clean Android experience with standout photography and smart AI features.",
    specs: {
      ram: 12,
      storage: 256,
      camera: 50,
      battery: 4700,
      display: "6.3-inch OLED",
      chipset: "Google Tensor G4"
    },
    reviews: [
      { user: "Ajay", rating: 5, text: "Photos are excellent and the software feels very smooth." },
      { user: "Latha", rating: 4, text: "Strong camera phone with a clean Android interface." }
    ]
  },
  {
    id: crypto.randomUUID(),
    name: "Motorola Edge 50 Pro",
    brand: "Motorola",
    category: "Style",
    basePrice: 31999,
    stock: 14,
    image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80"
    ],
    colors: ["Moonlight Pearl", "Black Beauty", "Lavender"],
    storageOptions: ["256GB"],
    description: "Curved display, clean software, and fast charging in a stylish body.",
    specs: {
      ram: 12,
      storage: 256,
      camera: 50,
      battery: 4500,
      display: "6.7-inch pOLED 144Hz",
      chipset: "Snapdragon 7 Gen 3"
    },
    reviews: [
      { user: "Vikram", rating: 4, text: "Nice display and premium in-hand feel for the price." },
      { user: "Sneha", rating: 4, text: "Fast charging and clean UI are the best parts." }
    ]
  },
  {
    id: crypto.randomUUID(),
    name: "Realme GT 6",
    brand: "Realme",
    category: "Performance",
    basePrice: 40999,
    stock: 16,
    image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=900&q=80"
    ],
    colors: ["Razor Green", "Fluid Silver"],
    storageOptions: ["256GB", "512GB"],
    description: "Flagship-grade speed, bright display, and ultra-fast charging for power users.",
    specs: {
      ram: 12,
      storage: 256,
      camera: 50,
      battery: 5500,
      display: "6.78-inch AMOLED 120Hz",
      chipset: "Snapdragon 8s Gen 3"
    },
    reviews: [
      { user: "Arun", rating: 5, text: "Great performance and battery for gaming and multitasking." },
      { user: "Keerthi", rating: 4, text: "Very fast charging and smooth overall experience." }
    ]
  },
  {
    id: crypto.randomUUID(),
    name: "Nothing Phone 2a",
    brand: "Nothing",
    category: "Style",
    basePrice: 23999,
    stock: 18,
    image: "https://images.unsplash.com/photo-1603899122634-f086ca5f5ddd?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1603899122634-f086ca5f5ddd?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1510557880182-3f8a7a2f68f3?auto=format&fit=crop&w=900&q=80"
    ],
    colors: ["Milk", "Black"],
    storageOptions: ["128GB", "256GB"],
    description: "Distinctive transparent look with a clean interface and balanced daily performance.",
    specs: {
      ram: 8,
      storage: 128,
      camera: 50,
      battery: 5000,
      display: "6.7-inch AMOLED 120Hz",
      chipset: "Dimensity 7200 Pro"
    },
    reviews: [
      { user: "Renu", rating: 4, text: "Unique design and smooth software stand out." },
      { user: "Mahesh", rating: 4, text: "Good display and battery at a fair price." }
    ]
  },
  {
    id: crypto.randomUUID(),
    name: "iQOO Neo 9 Pro",
    brand: "iQOO",
    category: "Performance",
    basePrice: 37999,
    stock: 13,
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=80"
    ],
    colors: ["Fiery Red", "Conqueror Black"],
    storageOptions: ["128GB", "256GB"],
    description: "Gaming-ready internals with strong cooling and very responsive performance.",
    specs: {
      ram: 12,
      storage: 256,
      camera: 50,
      battery: 5160,
      display: "6.78-inch LTPO AMOLED",
      chipset: "Snapdragon 8 Gen 2"
    },
    reviews: [
      { user: "Gokul", rating: 5, text: "Super smooth for gaming and heavy tasks." },
      { user: "Amina", rating: 4, text: "Strong value if you want raw speed." }
    ]
  },
  {
    id: crypto.randomUUID(),
    name: "Poco X6 Pro",
    brand: "Poco",
    category: "Value",
    basePrice: 27999,
    stock: 21,
    image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80"
    ],
    colors: ["Racing Grey", "Spectre Black", "Poco Yellow"],
    storageOptions: ["256GB", "512GB"],
    description: "Aggressive pricing with strong performance and a vibrant display.",
    specs: {
      ram: 12,
      storage: 256,
      camera: 64,
      battery: 5000,
      display: "6.67-inch AMOLED 120Hz",
      chipset: "Dimensity 8300 Ultra"
    },
    reviews: [
      { user: "Pranav", rating: 4, text: "Fast and affordable with very good display quality." },
      { user: "Shilpa", rating: 4, text: "A nice pick for performance on a budget." }
    ]
  },
  {
    id: crypto.randomUUID(),
    name: "Samsung Galaxy A55",
    brand: "Samsung",
    category: "Value",
    basePrice: 39999,
    stock: 17,
    image: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=900&q=80"
    ],
    colors: ["Awesome Iceblue", "Awesome Navy", "Awesome Lilac"],
    storageOptions: ["128GB", "256GB"],
    description: "Reliable mid-range Samsung phone with polished software and a premium finish.",
    specs: {
      ram: 8,
      storage: 256,
      camera: 50,
      battery: 5000,
      display: "6.6-inch Super AMOLED",
      chipset: "Exynos 1480"
    },
    reviews: [
      { user: "Divya", rating: 4, text: "Feels premium and the display is very nice." },
      { user: "Karthik", rating: 4, text: "Good everyday phone with dependable battery life." }
    ]
  },
  {
    id: crypto.randomUUID(),
    name: "Honor 200",
    brand: "Honor",
    category: "Camera",
    basePrice: 34999,
    stock: 11,
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1603899122634-f086ca5f5ddd?auto=format&fit=crop&w=900&q=80"
    ],
    colors: ["Moonlight White", "Emerald Green", "Black"],
    storageOptions: ["256GB", "512GB"],
    description: "Portrait-focused camera setup with a sleek design and fast performance.",
    specs: {
      ram: 12,
      storage: 256,
      camera: 50,
      battery: 5200,
      display: "6.7-inch OLED",
      chipset: "Snapdragon 7 Gen 3"
    },
    reviews: [
      { user: "Nisha", rating: 4, text: "Portrait photos look sharp and natural." },
      { user: "Bala", rating: 4, text: "Nice balance of style, battery, and camera." }
    ]
  },
  {
    id: crypto.randomUUID(),
    name: "Asus ROG Phone 8",
    brand: "Asus",
    category: "Performance",
    basePrice: 94999,
    stock: 6,
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=900&q=80"
    ],
    colors: ["Phantom Black", "Storm Grey"],
    storageOptions: ["256GB", "512GB"],
    description: "Dedicated gaming phone with elite performance, cooling, and big battery backup.",
    specs: {
      ram: 16,
      storage: 512,
      camera: 50,
      battery: 5500,
      display: "6.78-inch AMOLED 165Hz",
      chipset: "Snapdragon 8 Gen 3"
    },
    reviews: [
      { user: "Vasanth", rating: 5, text: "Excellent gaming phone with great sustained performance." },
      { user: "Joel", rating: 4, text: "Powerful and smooth, especially for heavy users." }
    ]
  },
  {
    id: crypto.randomUUID(),
    name: "Sony Xperia 1 VI",
    brand: "Sony",
    category: "Premium",
    basePrice: 129999,
    stock: 5,
    image: "https://images.unsplash.com/photo-1510557880182-3f8a7a2f68f3?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1510557880182-3f8a7a2f68f3?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1583573636246-18cb2246697d?auto=format&fit=crop&w=900&q=80"
    ],
    colors: ["Khaki Green", "Platinum Silver", "Black"],
    storageOptions: ["256GB", "512GB"],
    description: "Premium creator-focused phone with advanced camera controls and sharp display.",
    specs: {
      ram: 12,
      storage: 256,
      camera: 48,
      battery: 5000,
      display: "6.5-inch OLED 120Hz",
      chipset: "Snapdragon 8 Gen 3"
    },
    reviews: [
      { user: "Rohit", rating: 4, text: "Great for photography enthusiasts and multimedia lovers." },
      { user: "Anita", rating: 4, text: "Premium build and strong camera controls." }
    ]
  },
  {
    id: crypto.randomUUID(),
    name: "Tecno Camon 30 Premier",
    brand: "Tecno",
    category: "Camera",
    basePrice: 35999,
    stock: 12,
    image: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=900&q=80"
    ],
    colors: ["Alps Snowy Silver", "Loewe Dark Green"],
    storageOptions: ["256GB", "512GB"],
    description: "Camera-centric phone with strong storage, display quality, and premium styling.",
    specs: {
      ram: 12,
      storage: 512,
      camera: 50,
      battery: 5000,
      display: "6.77-inch AMOLED 144Hz",
      chipset: "Dimensity 8200 Ultra"
    },
    reviews: [
      { user: "Farah", rating: 4, text: "Impressive camera package with lots of storage." },
      { user: "Dinesh", rating: 4, text: "Looks premium and performs well for the price." }
    ]
  }
];

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

function readStorage(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function initializeProducts() {
  const storedProducts = readStorage(storageKeys.products, null);
  if (!Array.isArray(storedProducts) || !storedProducts.length) {
    return defaultProducts;
  }

  const mergedProducts = [...storedProducts];
  const storedNames = new Set(storedProducts.map((product) => product.name));

  defaultProducts.forEach((product) => {
    if (!storedNames.has(product.name)) {
      mergedProducts.push(product);
    }
  });

  return mergedProducts;
}

function averageRating(reviews = []) {
  if (!reviews.length) return 0;
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return (total / reviews.length).toFixed(1);
}

function calculateVariantPrice(product, storage) {
  const base = product.basePrice;
  const first = product.storageOptions?.[0];
  if (!storage || storage === first) return base;
  const index = product.storageOptions.indexOf(storage);
  return base + Math.max(index, 0) * 5000;
}

function calculatePricing(cart, couponCode) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = subtotal >= freeDeliveryThreshold || subtotal === 0 ? 0 : standardDeliveryFee;
  const matchedCoupon = coupons.find((coupon) => coupon.code === couponCode.trim().toUpperCase());
  let discount = 0;

  if (matchedCoupon && subtotal >= matchedCoupon.minOrder) {
    discount = matchedCoupon.type === "percent"
      ? Math.floor((subtotal * matchedCoupon.value) / 100)
      : matchedCoupon.value;
  }

  return {
    subtotal,
    delivery,
    discount,
    total: Math.max(subtotal + delivery - discount, 0),
    matchedCoupon
  };
}

function StatusPills({ status }) {
  const index = orderStatuses.indexOf(status);
  return (
    <div className="status-row">
      {orderStatuses.map((item, itemIndex) => (
        <span key={item} className={itemIndex <= index ? "status-pill active" : "status-pill"}>
          {item}
        </span>
      ))}
    </div>
  );
}

function ProductCard({ product, onAdd, onDetails, onToggleWishlist, onToggleCompare, isWishlisted, isCompared }) {
  return (
    <article className="product-card">
      <div className="image-wrap">
        <img src={product.image} alt={product.name} />
        <span className="badge">{product.brand}</span>
      </div>
      <div className="product-copy">
        <div className="title-row">
          <div>
            <h3>{product.name}</h3>
            <p className="muted small">{product.category}</p>
          </div>
          <span className="rating-chip">{averageRating(product.reviews)} star</span>
        </div>
        <p className="muted">{product.description}</p>
        <div className="spec-line">
          <span>{product.specs.ram}GB RAM</span>
          <span>{product.specs.storage}GB</span>
          <span>{product.specs.camera}MP</span>
          <span>{product.specs.battery}mAh</span>
        </div>
        <div className="row-between align-end">
          <div>
            <strong>{money.format(product.basePrice)}</strong>
            <p className="muted small">Stock: {product.stock}</p>
          </div>
          <div className="action-cluster">
            <button className="secondary-btn" onClick={() => onDetails(product)}>Details</button>
            <button className={isWishlisted ? "icon-btn active" : "icon-btn"} onClick={() => onToggleWishlist(product.id)}>Wish</button>
            <button className={isCompared ? "icon-btn active" : "icon-btn"} onClick={() => onToggleCompare(product.id)}>Compare</button>
            <button className="primary-btn" onClick={() => onAdd(product)}>Add</button>
          </div>
        </div>
      </div>
    </article>
  );
}

function DetailModal({ product, onClose, onAdd, onToggleWishlist, isWishlisted }) {
  const [selectedImage, setSelectedImage] = useState(product.gallery?.[0] || product.image);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "Default");
  const [selectedStorage, setSelectedStorage] = useState(product.storageOptions?.[0] || "Default");

  useEffect(() => {
    setSelectedImage(product.gallery?.[0] || product.image);
    setSelectedColor(product.colors?.[0] || "Default");
    setSelectedStorage(product.storageOptions?.[0] || "Default");
  }, [product]);

  const variantPrice = calculateVariantPrice(product, selectedStorage);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <div className="modal-grid">
          <div className="gallery-panel">
            <img src={selectedImage} alt={product.name} className="hero-image" />
            <div className="thumb-row">
              {(product.gallery || [product.image]).map((image) => (
                <button key={image} className={selectedImage === image ? "thumb active" : "thumb"} onClick={() => setSelectedImage(image)}>
                  <img src={image} alt={product.name} />
                </button>
              ))}
            </div>
          </div>
          <div className="detail-panel">
            <div className="row-between">
              <div>
                <div className="kicker">Product Details</div>
                <h2>{product.name}</h2>
              </div>
              <button className="icon-btn" onClick={onClose}>Close</button>
            </div>
            <p className="muted">{product.description}</p>
            <div className="detail-box-grid">
              <div className="detail-box"><span>Display</span><strong>{product.specs.display}</strong></div>
              <div className="detail-box"><span>Chipset</span><strong>{product.specs.chipset}</strong></div>
              <div className="detail-box"><span>Camera</span><strong>{product.specs.camera}MP</strong></div>
              <div className="detail-box"><span>Battery</span><strong>{product.specs.battery}mAh</strong></div>
            </div>
            <div>
              <p className="field-title">Colors</p>
              <div className="chip-row">
                {product.colors.map((color) => (
                  <button key={color} className={selectedColor === color ? "chip active" : "chip"} onClick={() => setSelectedColor(color)}>
                    {color}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="field-title">Storage Variants</p>
              <div className="chip-row">
                {product.storageOptions.map((storage) => (
                  <button key={storage} className={selectedStorage === storage ? "chip active" : "chip"} onClick={() => setSelectedStorage(storage)}>
                    {storage}
                  </button>
                ))}
              </div>
            </div>
            <div className="row-between align-end">
              <div>
                <strong className="big-price">{money.format(variantPrice)}</strong>
                <p className="muted small">Selected: {selectedColor} • {selectedStorage}</p>
              </div>
              <div className="action-cluster">
                <button className={isWishlisted ? "icon-btn active" : "icon-btn"} onClick={() => onToggleWishlist(product.id)}>Wishlist</button>
                <button className="primary-btn" onClick={() => onAdd(product, selectedColor, selectedStorage)}>Add to Cart</button>
              </div>
            </div>
            <div>
              <p className="field-title">Customer Reviews</p>
              <div className="stack compact-stack">
                {product.reviews.map((review, index) => (
                  <article className="review-card" key={`${review.user}-${index}`}>
                    <div className="row-between">
                      <strong>{review.user}</strong>
                      <span className="rating-chip">{review.rating} / 5</span>
                    </div>
                    <p className="muted small">{review.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComparePanel({ products, onRemove, onAdd }) {
  if (!products.length) return null;

  return (
    <section className="panel compare-panel">
      <div className="row-between">
        <div>
          <div className="kicker">Compare Mobiles</div>
          <h2>Side-by-side comparison</h2>
        </div>
        <p className="muted">Choose 2 or 3 phones to compare quickly.</p>
      </div>
      <div className="compare-grid">
        {products.map((product) => (
          <article className="compare-card" key={product.id}>
            <img src={product.image} alt={product.name} className="compare-image" />
            <h3>{product.name}</h3>
            <p className="muted small">{product.brand} • {product.category}</p>
            <ul className="compare-list">
              <li>Price: {money.format(product.basePrice)}</li>
              <li>RAM: {product.specs.ram}GB</li>
              <li>Storage: {product.specs.storage}GB</li>
              <li>Camera: {product.specs.camera}MP</li>
              <li>Battery: {product.specs.battery}mAh</li>
              <li>Display: {product.specs.display}</li>
            </ul>
            <div className="action-cluster">
              <button className="primary-btn" onClick={() => onAdd(product)}>Add</button>
              <button className="secondary-btn" onClick={() => onRemove(product.id)}>Remove</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
function WishlistPanel({ products, onOpen, onAdd, onToggleWishlist }) {
  return (
    <section className="panel">
      <div className="kicker">Wishlist</div>
      <h2>Saved for later</h2>
      <div className="stack compact-stack">
        {products.length ? (
          products.map((product) => (
            <article className="saved-row" key={product.id}>
              <img src={product.image} alt={product.name} className="saved-image" />
              <div>
                <strong>{product.name}</strong>
                <p className="muted small">{money.format(product.basePrice)}</p>
              </div>
              <div className="action-cluster">
                <button className="secondary-btn" onClick={() => onOpen(product)}>View</button>
                <button className="primary-btn" onClick={() => onAdd(product)}>Add</button>
                <button className="icon-btn" onClick={() => onToggleWishlist(product.id)}>Remove</button>
              </div>
            </article>
          ))
        ) : (
          <div className="empty-card">No phones saved to wishlist yet.</div>
        )}
      </div>
    </section>
  );
}

function ProfilePanel({ session, profile, onSave }) {
  const [form, setForm] = useState(profile);

  useEffect(() => {
    setForm(profile);
  }, [profile]);

  function submit(event) {
    event.preventDefault();
    onSave(form);
  }

  return (
    <section className="panel">
      <div className="kicker">Profile</div>
      <h2>Saved customer details</h2>
      <p className="muted">Store your contact details so checkout fills in faster next time.</p>
      <form className="form" onSubmit={submit}>
        <div className="dual-grid">
          <label>
            <span>Name</span>
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Customer name" required />
          </label>
          <label>
            <span>Phone Number</span>
            <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="Mobile number" required />
          </label>
        </div>
        <label>
          <span>Address</span>
          <textarea rows="4" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} placeholder="Street, area, city" required />
        </label>
        <button className="primary-btn" type="submit" disabled={!session}>Save Profile</button>
      </form>
    </section>
  );
}

function CheckoutPanel({ cart, session, profile, couponCode, onCouponChange, onApplyCoupon, pricing, appliedCoupon, onPay }) {
  const [form, setForm] = useState({ name: profile.name, address: profile.address, phone: profile.phone, card: "", expiry: "", cvv: "" });

  useEffect(() => {
    setForm((current) => ({ ...current, name: profile.name, address: profile.address, phone: profile.phone }));
  }, [profile]);

  function submit(event) {
    event.preventDefault();
    onPay(form);
  }

  return (
    <section className="panel">
      <div className="kicker">Payment</div>
      <h2>Checkout</h2>
      <p className="muted">Includes coupon discounts and delivery charge logic.</p>
      <div className="checkout-layout">
        <form className="form" onSubmit={submit}>
          <div className="dual-grid">
            <label>
              <span>Full Name</span>
              <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
            </label>
            <label>
              <span>Phone Number</span>
              <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} required />
            </label>
          </div>
          <label>
            <span>Shipping Address</span>
            <textarea rows="4" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} required />
          </label>
          <div className="coupon-block">
            <div className="row-between">
              <strong>Available Coupons</strong>
              <span className="muted small">{coupons.map((coupon) => coupon.code).join(", ")}</span>
            </div>
            <div className="coupon-row">
              <input value={couponCode} onChange={(event) => onCouponChange(event.target.value)} placeholder="Enter coupon code" />
              <button className="secondary-btn" type="button" onClick={onApplyCoupon}>Apply Coupon</button>
            </div>
            {appliedCoupon ? <p className="success-text">Applied: {appliedCoupon.label}</p> : null}
          </div>
          <div className="triple-grid">
            <label>
              <span>Card Number</span>
              <input value={form.card} onChange={(event) => setForm({ ...form, card: event.target.value })} required />
            </label>
            <label>
              <span>Expiry</span>
              <input value={form.expiry} onChange={(event) => setForm({ ...form, expiry: event.target.value })} required />
            </label>
            <label>
              <span>CVV</span>
              <input value={form.cvv} onChange={(event) => setForm({ ...form, cvv: event.target.value })} required />
            </label>
          </div>
          <button className="primary-btn wide" type="submit" disabled={!cart.length || !session}>Pay Now</button>
        </form>
        <aside className="summary-box">
          <h3>Price Summary</h3>
          <div className="summary-row"><span>Subtotal</span><strong>{money.format(pricing.subtotal)}</strong></div>
          <div className="summary-row"><span>Delivery</span><strong>{pricing.delivery === 0 ? "Free" : money.format(pricing.delivery)}</strong></div>
          <div className="summary-row"><span>Discount</span><strong>- {money.format(pricing.discount)}</strong></div>
          <div className="summary-row total-row"><span>Total</span><strong>{money.format(pricing.total)}</strong></div>
          <p className="muted small">Free delivery above {money.format(freeDeliveryThreshold)}. Otherwise {money.format(standardDeliveryFee)} applies.</p>
        </aside>
      </div>
    </section>
  );
}

function OrdersPanel({ orders, session, onAdvanceStatus, onOpenInvoice }) {
  const visibleOrders = session
    ? session.role === "admin"
      ? orders
      : orders.filter((order) => order.customerEmail === session.email)
    : [];

  return (
    <section className="panel">
      <div className="kicker">Orders</div>
      <h2>Tracking and invoices</h2>
      <div className="stack">
        {visibleOrders.length ? (
          visibleOrders.slice().reverse().map((order) => (
            <article className="order-card" key={order.id}>
              <div className="row-between">
                <div>
                  <strong>{order.customerName}</strong>
                  <p className="muted small">{order.customerEmail} • {order.paymentMode}</p>
                </div>
                <strong>{money.format(order.total)}</strong>
              </div>
              <StatusPills status={order.status} />
              <p className="muted small">Ordered on {new Date(order.createdAt).toLocaleString("en-IN")}</p>
              <div className="action-cluster">
                <button className="secondary-btn" onClick={() => onOpenInvoice(order)}>Invoice</button>
                {session?.role === "admin" && order.status !== "Delivered" ? (
                  <button className="primary-btn" onClick={() => onAdvanceStatus(order.id)}>Advance Status</button>
                ) : null}
              </div>
            </article>
          ))
        ) : (
          <div className="empty-card">No orders available yet.</div>
        )}
      </div>
    </section>
  );
}

function InvoiceModal({ order, onClose }) {
  if (!order) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="invoice-card" onClick={(event) => event.stopPropagation()}>
        <div className="row-between">
          <div>
            <div className="kicker">Invoice</div>
            <h2>{order.id.slice(0, 8).toUpperCase()}</h2>
          </div>
          <div className="action-cluster">
            <button className="secondary-btn" onClick={() => window.print()}>Download / Print</button>
            <button className="icon-btn" onClick={onClose}>Close</button>
          </div>
        </div>
        <div className="invoice-grid">
          <div>
            <p><strong>Customer:</strong> {order.customerName}</p>
            <p><strong>Email:</strong> {order.customerEmail}</p>
            <p><strong>Phone:</strong> {order.phone}</p>
            <p><strong>Address:</strong> {order.shippingAddress}</p>
          </div>
          <div>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Payment:</strong> {order.paymentMode}</p>
            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString("en-IN")}</p>
          </div>
        </div>
        <div className="stack compact-stack">
          {order.items.map((item) => (
            <div className="invoice-row" key={`${item.id}-${item.selectedStorage}-${item.selectedColor}`}>
              <span>{item.name} • {item.selectedStorage} • {item.selectedColor} x {item.quantity}</span>
              <strong>{money.format(item.price * item.quantity)}</strong>
            </div>
          ))}
        </div>
        <div className="summary-box compact-box">
          <div className="summary-row"><span>Subtotal</span><strong>{money.format(order.subtotal)}</strong></div>
          <div className="summary-row"><span>Delivery</span><strong>{order.delivery === 0 ? "Free" : money.format(order.delivery)}</strong></div>
          <div className="summary-row"><span>Discount</span><strong>- {money.format(order.discount)}</strong></div>
          <div className="summary-row total-row"><span>Total</span><strong>{money.format(order.total)}</strong></div>
        </div>
      </div>
    </div>
  );
}

function CartPanel({ cart, pricing, onChange, onRemove, onCheckout }) {
  return (
    <aside className="panel cart-panel">
      <div className="kicker">Cart</div>
      <h2>Your Order</h2>
      <div className="cart-list">
        {cart.length ? (
          cart.map((item) => (
            <div className="cart-item" key={`${item.id}-${item.selectedStorage}-${item.selectedColor}`}>
              <div>
                <strong>{item.name}</strong>
                <p className="muted small">{item.selectedStorage} • {item.selectedColor}</p>
                <p className="muted small">{money.format(item.price)}</p>
              </div>
              <div className="cart-controls">
                <button onClick={() => onChange(item.key, -1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => onChange(item.key, 1)}>+</button>
                <button className="secondary-btn small-btn" onClick={() => onRemove(item.key)}>Remove</button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-card">Your cart is empty.</div>
        )}
      </div>
      <div className="summary-box compact-box">
        <div className="summary-row"><span>Subtotal</span><strong>{money.format(pricing.subtotal)}</strong></div>
        <div className="summary-row"><span>Delivery</span><strong>{pricing.delivery === 0 ? "Free" : money.format(pricing.delivery)}</strong></div>
        <div className="summary-row"><span>Total</span><strong>{money.format(pricing.total)}</strong></div>
      </div>
      <button className="primary-btn wide" onClick={onCheckout}>Checkout</button>
    </aside>
  );
}

function AuthPanel({ session, onLogin, onLogout }) {
  const [form, setForm] = useState({ email: "", password: "" });

  function submit(event) {
    event.preventDefault();
    onLogin(form);
  }

  return (
    <section className="panel">
      <div className="kicker">Account</div>
      <h2>{session ? `Welcome, ${session.name}` : "Login"}</h2>
      <p className="muted">Customer: user@a1mobiles.com / user123</p>
      <p className="muted">Admin: admin@a1mobiles.com / admin123</p>
      {session ? (
        <div className="stack compact-stack">
          <div className="pill-row">
            <span className="pill">{session.role}</span>
            <span className="pill">{session.email}</span>
          </div>
          <button className="secondary-btn" onClick={onLogout}>Logout</button>
        </div>
      ) : (
        <form className="form" onSubmit={submit}>
          <label>
            <span>Email</span>
            <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          </label>
          <label>
            <span>Password</span>
            <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
          </label>
          <button className="primary-btn wide" type="submit">Sign In</button>
        </form>
      )}
    </section>
  );
}
function AdminPanel({ products, orders, onSave, onDelete }) {
  const blank = {
    id: "",
    name: "",
    brand: "",
    category: "",
    basePrice: "",
    stock: "",
    image: "",
    gallery: "",
    colors: "",
    storageOptions: "",
    description: "",
    ram: "",
    storage: "",
    camera: "",
    battery: "",
    display: "",
    chipset: ""
  };

  const [draft, setDraft] = useState(blank);

  function handleEdit(product) {
    setDraft({
      id: product.id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      basePrice: product.basePrice,
      stock: product.stock,
      image: product.image,
      gallery: product.gallery.join(", "),
      colors: product.colors.join(", "),
      storageOptions: product.storageOptions.join(", "),
      description: product.description,
      ram: product.specs.ram,
      storage: product.specs.storage,
      camera: product.specs.camera,
      battery: product.specs.battery,
      display: product.specs.display,
      chipset: product.specs.chipset
    });
  }

  function resetForm() {
    setDraft(blank);
  }

  function submit(event) {
    event.preventDefault();
    onSave(draft);
    resetForm();
  }

  return (
    <section className="panel">
      <div className="row-between">
        <div>
          <div className="kicker">Admin</div>
          <h2>Catalog Manager</h2>
        </div>
        <button className="secondary-btn" onClick={resetForm}>New Product</button>
      </div>
      <p className="muted">Add mobiles, edit prices, update specs, and manage stock.</p>
      <form className="form" onSubmit={submit}>
        <div className="dual-grid">
          <label><span>Mobile Name</span><input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} required /></label>
          <label><span>Brand</span><input value={draft.brand} onChange={(event) => setDraft({ ...draft, brand: event.target.value })} required /></label>
        </div>
        <div className="triple-grid">
          <label><span>Category</span><input value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} required /></label>
          <label><span>Base Price</span><input type="number" min="0" value={draft.basePrice} onChange={(event) => setDraft({ ...draft, basePrice: event.target.value })} required /></label>
          <label><span>Stock</span><input type="number" min="0" value={draft.stock} onChange={(event) => setDraft({ ...draft, stock: event.target.value })} required /></label>
        </div>
        <label><span>Main Image URL</span><input value={draft.image} onChange={(event) => setDraft({ ...draft, image: event.target.value })} required /></label>
        <label><span>Gallery URLs</span><input value={draft.gallery} onChange={(event) => setDraft({ ...draft, gallery: event.target.value })} placeholder="Separate with commas" required /></label>
        <div className="dual-grid">
          <label><span>Colors</span><input value={draft.colors} onChange={(event) => setDraft({ ...draft, colors: event.target.value })} placeholder="Separate with commas" required /></label>
          <label><span>Storage Variants</span><input value={draft.storageOptions} onChange={(event) => setDraft({ ...draft, storageOptions: event.target.value })} placeholder="Separate with commas" required /></label>
        </div>
        <label><span>Description</span><textarea rows="4" value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} required /></label>
        <div className="spec-grid">
          <label><span>RAM (GB)</span><input type="number" min="0" value={draft.ram} onChange={(event) => setDraft({ ...draft, ram: event.target.value })} required /></label>
          <label><span>Default Storage (GB)</span><input type="number" min="0" value={draft.storage} onChange={(event) => setDraft({ ...draft, storage: event.target.value })} required /></label>
          <label><span>Camera (MP)</span><input type="number" min="0" value={draft.camera} onChange={(event) => setDraft({ ...draft, camera: event.target.value })} required /></label>
          <label><span>Battery (mAh)</span><input type="number" min="0" value={draft.battery} onChange={(event) => setDraft({ ...draft, battery: event.target.value })} required /></label>
          <label><span>Display</span><input value={draft.display} onChange={(event) => setDraft({ ...draft, display: event.target.value })} required /></label>
          <label><span>Chipset</span><input value={draft.chipset} onChange={(event) => setDraft({ ...draft, chipset: event.target.value })} required /></label>
        </div>
        <button className="primary-btn" type="submit">{draft.id ? "Update Product" : "Save Product"}</button>
      </form>
      <div className="stack compact-stack admin-list">
        {products.map((product) => (
          <div className="admin-row" key={product.id}>
            <div>
              <strong>{product.name}</strong>
              <p className="muted small">{product.brand} • {product.category} • {money.format(product.basePrice)} • Stock {product.stock}</p>
            </div>
            <div className="action-cluster">
              <button className="secondary-btn" onClick={() => handleEdit(product)}>Edit</button>
              <button className="icon-btn" onClick={() => onDelete(product.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <div className="stats-grid compact-stats">
        <div className="stat"><span>Products</span><strong>{products.length}</strong></div>
        <div className="stat accent"><span>Orders</span><strong>{orders.length}</strong></div>
      </div>
    </section>
  );
}

export default function App() {
  const [products, setProducts] = useState(() => initializeProducts());
  const [orders, setOrders] = useState(() => readStorage(storageKeys.orders, []));
  const [session, setSession] = useState(() => readStorage(storageKeys.session, null));
  const [wishlist, setWishlist] = useState(() => readStorage(storageKeys.wishlist, []));
  const [profile, setProfile] = useState(() => readStorage(storageKeys.profile, { name: "", phone: "", address: "" }));
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState("shop");
  const [search, setSearch] = useState("");
  const [deferredSearch, setDeferredSearch] = useState("");
  const [filters, setFilters] = useState({
    category: "All",
    brand: "All",
    price: 150000,
    ram: "All",
    storage: "All",
    camera: "All",
    battery: "All"
  });
  const [toast, setToast] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [compareIds, setCompareIds] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] = useState("");
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  useEffect(() => {
    localStorage.setItem(storageKeys.products, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(storageKeys.orders, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(storageKeys.session, JSON.stringify(session));
  }, [session]);

  useEffect(() => {
    localStorage.setItem(storageKeys.wishlist, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(storageKeys.profile, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  const brands = useMemo(() => ["All", ...new Set(products.map((item) => item.brand))], [products]);
  const categories = useMemo(() => ["All", ...new Set(products.map((item) => item.category))], [products]);
  const compareProducts = useMemo(() => products.filter((product) => compareIds.includes(product.id)), [products, compareIds]);
  const wishlistProducts = useMemo(() => products.filter((product) => wishlist.includes(product.id)), [products, wishlist]);
  const pricing = useMemo(() => calculatePricing(cart, appliedCouponCode), [cart, appliedCouponCode]);
  const appliedCoupon = pricing.matchedCoupon && appliedCouponCode ? pricing.matchedCoupon : null;

  const filteredProducts = useMemo(() => {
    const value = deferredSearch.trim().toLowerCase();
    return products.filter((item) => {
      const haystack = `${item.name} ${item.brand} ${item.category}`.toLowerCase();
      return (
        (!value || haystack.includes(value)) &&
        (filters.category === "All" || item.category === filters.category) &&
        (filters.brand === "All" || item.brand === filters.brand) &&
        item.basePrice <= Number(filters.price) &&
        (filters.ram === "All" || item.specs.ram >= Number(filters.ram)) &&
        (filters.storage === "All" || item.specs.storage >= Number(filters.storage)) &&
        (filters.camera === "All" || item.specs.camera >= Number(filters.camera)) &&
        (filters.battery === "All" || item.specs.battery >= Number(filters.battery))
      );
    });
  }, [products, deferredSearch, filters]);

  function addToCart(product, color, storage) {
    const selectedColor = color || product.colors[0];
    const selectedStorage = storage || product.storageOptions[0];
    const itemKey = `${product.id}-${selectedColor}-${selectedStorage}`;
    const unitPrice = calculateVariantPrice(product, selectedStorage);

    setCart((current) => {
      const existing = current.find((item) => item.key === itemKey);
      if (existing) {
        return current.map((item) => item.key === itemKey ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [
        ...current,
        {
          key: itemKey,
          id: product.id,
          name: product.name,
          price: unitPrice,
          quantity: 1,
          selectedColor,
          selectedStorage
        }
      ];
    });

    setToast(`${product.name} added to cart`);
  }

  function changeQuantity(key, delta) {
    setCart((current) => current
      .map((item) => item.key === key ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item)
      .filter((item) => item.quantity > 0));
  }

  function removeFromCart(key) {
    setCart((current) => current.filter((item) => item.key !== key));
  }

  function login(form) {
    const match = demoUsers.find((user) => user.email === form.email.trim() && user.password === form.password);
    if (!match) {
      setToast("Invalid login details");
      return;
    }
    setSession(match);
    setActiveTab(match.role === "admin" ? "admin" : "profile");
    setToast(`Logged in as ${match.role}`);
  }

  function logout() {
    setSession(null);
    setActiveTab("shop");
    setToast("Logged out");
  }

  function toggleWishlist(productId) {
    setWishlist((current) => current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]);
    setToast("Wishlist updated");
  }

  function toggleCompare(productId) {
    setCompareIds((current) => {
      if (current.includes(productId)) return current.filter((id) => id !== productId);
      if (current.length >= 3) {
        setToast("You can compare up to 3 mobiles");
        return current;
      }
      return [...current, productId];
    });
  }

  function applyCoupon() {
    const normalized = couponCode.trim().toUpperCase();
    const matchedCoupon = coupons.find((coupon) => coupon.code === normalized);
    if (!normalized) {
      setAppliedCouponCode("");
      setToast("Coupon cleared");
      return;
    }
    if (!matchedCoupon) {
      setToast("Invalid coupon code");
      return;
    }
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (subtotal < matchedCoupon.minOrder) {
      setToast(`Coupon needs minimum order of ${money.format(matchedCoupon.minOrder)}`);
      return;
    }
    setAppliedCouponCode(normalized);
    setToast("Coupon applied");
  }

  function saveProfile(nextProfile) {
    setProfile(nextProfile);
    setToast("Profile saved");
  }

  function goToCheckout() {
    setActiveTab("checkout");
    if (!session) setToast("Login first to continue to payment");
  }

  function completePayment(form) {
    if (!session) {
      setToast("Please login before payment");
      return;
    }
    if (!cart.length) {
      setToast("Add at least one product before payment");
      return;
    }

    const order = {
      id: crypto.randomUUID(),
      customerName: form.name,
      customerEmail: session.email,
      phone: form.phone,
      items: cart,
      subtotal: pricing.subtotal,
      delivery: pricing.delivery,
      discount: pricing.discount,
      total: pricing.total,
      couponCode: appliedCouponCode,
      paymentMode: `Card ending ${form.card.slice(-4)}`,
      shippingAddress: form.address,
      createdAt: new Date().toISOString(),
      status: "Placed"
    };

    setOrders((current) => [...current, order]);
    setCart([]);
    setAppliedCouponCode("");
    setCouponCode("");
    setActiveTab("orders");
    setInvoiceOrder(order);
    setToast("Payment successful. Order placed.");
  }

  function advanceOrderStatus(orderId) {
    setOrders((current) => current.map((order) => {
      if (order.id !== orderId) return order;
      const currentIndex = orderStatuses.indexOf(order.status);
      const nextStatus = orderStatuses[Math.min(currentIndex + 1, orderStatuses.length - 1)];
      return { ...order, status: nextStatus };
    }));
    setToast("Order status updated");
  }
  function saveProduct(draft) {
    const nextProduct = {
      id: draft.id || crypto.randomUUID(),
      name: draft.name.trim(),
      brand: draft.brand.trim(),
      category: draft.category.trim(),
      basePrice: Number(draft.basePrice),
      stock: Number(draft.stock),
      image: draft.image.trim(),
      gallery: draft.gallery.split(",").map((item) => item.trim()).filter(Boolean),
      colors: draft.colors.split(",").map((item) => item.trim()).filter(Boolean),
      storageOptions: draft.storageOptions.split(",").map((item) => item.trim()).filter(Boolean),
      description: draft.description.trim(),
      specs: {
        ram: Number(draft.ram),
        storage: Number(draft.storage),
        camera: Number(draft.camera),
        battery: Number(draft.battery),
        display: draft.display.trim(),
        chipset: draft.chipset.trim()
      },
      reviews: draft.id
        ? products.find((item) => item.id === draft.id)?.reviews || []
        : [{ user: "New Buyer", rating: 4, text: "Recently added product." }]
    };

    setProducts((current) => {
      const exists = current.some((item) => item.id === nextProduct.id);
      return exists
        ? current.map((item) => item.id === nextProduct.id ? nextProduct : item)
        : [nextProduct, ...current];
    });

    setToast(draft.id ? "Product updated" : "Product saved");
  }

  function deleteProduct(id) {
    setProducts((current) => current.filter((item) => item.id !== id));
    setWishlist((current) => current.filter((item) => item !== id));
    setCompareIds((current) => current.filter((item) => item !== id));
    setCart((current) => current.filter((item) => item.id !== id));
    if (selectedProduct?.id === id) setSelectedProduct(null);
    setToast("Product removed");
  }

  return (
    <div className="app-shell">
      <header className="hero panel">
        <div className="row-between hero-top">
          <div>
            <div className="kicker">A1 Mobiles</div>
            <h1>Full mobile shop experience with customer tools and admin control.</h1>
            <p className="muted hero-copy">Browse mobile details, save wishlist items, compare phones, apply coupons, track orders, print invoices, manage your profile, and edit products from the admin panel.</p>
          </div>
          <div className="hero-buttons">
            <button className="primary-btn" onClick={() => setActiveTab("shop")}>Shop</button>
            <button className="secondary-btn" onClick={() => setActiveTab("profile")}>Profile</button>
            <button className="secondary-btn" onClick={() => setActiveTab("admin")}>Admin</button>
          </div>
        </div>
        <div className="stats-grid">
          <div className="stat"><span>Products</span><strong>{products.length}</strong></div>
          <div className="stat accent"><span>Wishlist</span><strong>{wishlist.length}</strong></div>
          <div className="stat dark"><span>Session</span><strong>{session ? session.role : "guest"}</strong></div>
        </div>
      </header>

      <nav className="tab-bar">
        {["shop", "wishlist", "checkout", "orders", "profile", "admin"].map((tab) => (
          <button key={tab} className={tab === activeTab ? "tab active" : "tab"} onClick={() => setActiveTab(tab)}>
            {tab}
          </button>
        ))}
      </nav>

      <main className="main-grid">
        <div className="content-grid">
          <AuthPanel session={session} onLogin={login} onLogout={logout} />

          {activeTab === "shop" && (
            <>
              <section className="panel">
                <div className="row-between section-head">
                  <div>
                    <div className="kicker">Storefront</div>
                    <h2>Search and filter mobiles</h2>
                  </div>
                  <div className="search-grid">
                    <input
                      value={search}
                      onChange={(event) => {
                        const value = event.target.value;
                        setSearch(value);
                        startTransition(() => setDeferredSearch(value));
                      }}
                      placeholder="Search by phone, brand, or category"
                    />
                    <select value={filters.category} onChange={(event) => setFilters({ ...filters, category: event.target.value })}>
                      {categories.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </div>
                </div>
                <div className="filter-grid">
                  <label><span>Brand</span><select value={filters.brand} onChange={(event) => setFilters({ ...filters, brand: event.target.value })}>{brands.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
                  <label><span>Max Price</span><input type="range" min="10000" max="150000" step="5000" value={filters.price} onChange={(event) => setFilters({ ...filters, price: event.target.value })} /><strong>{money.format(Number(filters.price))}</strong></label>
                  <label><span>Minimum RAM</span><select value={filters.ram} onChange={(event) => setFilters({ ...filters, ram: event.target.value })}><option>All</option><option value="8">8GB</option><option value="12">12GB</option></select></label>
                  <label><span>Minimum Storage</span><select value={filters.storage} onChange={(event) => setFilters({ ...filters, storage: event.target.value })}><option>All</option><option value="128">128GB</option><option value="256">256GB</option><option value="512">512GB</option></select></label>
                  <label><span>Camera</span><select value={filters.camera} onChange={(event) => setFilters({ ...filters, camera: event.target.value })}><option>All</option><option value="50">50MP+</option><option value="100">100MP+</option><option value="200">200MP</option></select></label>
                  <label><span>Battery</span><select value={filters.battery} onChange={(event) => setFilters({ ...filters, battery: event.target.value })}><option>All</option><option value="4500">4500mAh+</option><option value="5000">5000mAh+</option><option value="5500">5500mAh+</option></select></label>
                </div>
                <div className="product-grid">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAdd={addToCart}
                      onDetails={setSelectedProduct}
                      onToggleWishlist={toggleWishlist}
                      onToggleCompare={toggleCompare}
                      isWishlisted={wishlist.includes(product.id)}
                      isCompared={compareIds.includes(product.id)}
                    />
                  ))}
                </div>
              </section>
              <ComparePanel products={compareProducts} onRemove={toggleCompare} onAdd={addToCart} />
            </>
          )}

          {activeTab === "wishlist" && (
            <WishlistPanel products={wishlistProducts} onOpen={setSelectedProduct} onAdd={addToCart} onToggleWishlist={toggleWishlist} />
          )}

          {activeTab === "checkout" && (
            <CheckoutPanel
              cart={cart}
              session={session}
              profile={profile}
              couponCode={couponCode}
              onCouponChange={setCouponCode}
              onApplyCoupon={applyCoupon}
              pricing={pricing}
              appliedCoupon={appliedCoupon}
              onPay={completePayment}
            />
          )}

          {activeTab === "orders" && (
            <OrdersPanel orders={orders} session={session} onAdvanceStatus={advanceOrderStatus} onOpenInvoice={setInvoiceOrder} />
          )}

          {activeTab === "profile" && (
            <ProfilePanel session={session} profile={profile} onSave={saveProfile} />
          )}

          {activeTab === "admin" && (
            session?.role === "admin"
              ? <AdminPanel products={products} orders={orders} onSave={saveProduct} onDelete={deleteProduct} />
              : (
                <section className="panel">
                  <div className="kicker">Admin</div>
                  <h2>Restricted access</h2>
                  <p className="muted">Login with the admin demo account to edit products and prices.</p>
                </section>
              )
          )}
        </div>

        <CartPanel cart={cart} pricing={pricing} onChange={changeQuantity} onRemove={removeFromCart} onCheckout={goToCheckout} />
      </main>

      {selectedProduct ? (
        <DetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAdd={addToCart}
          onToggleWishlist={toggleWishlist}
          isWishlisted={wishlist.includes(selectedProduct.id)}
        />
      ) : null}

      <InvoiceModal order={invoiceOrder} onClose={() => setInvoiceOrder(null)} />
      <footer className="site-footer">
        <p className="footer-kicker">Built with React</p>
        <div className="footer-signature" aria-label="Created by VIMCODER">
          <span>Created by</span>
          <strong>VIMCODER</strong>
        </div>
      </footer>
      {toast ? <div className="toast">{toast}</div> : null}
    </div>
  );
}
