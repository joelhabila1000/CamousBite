import { useEffect, useMemo, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import MobileDrawer from "./components/MobileDrawer.jsx";
import ToastStack from "./components/ToastStack.jsx";
import CartFab from "./components/CartFab.jsx";
import CartSidebar from "./components/CartSidebar.jsx";
import FoodModal from "./components/FoodModal.jsx";
import { LoginModal, SignupModal } from "./components/AuthModals.jsx";
import Footer from "./components/Footer.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import RestaurantsPage from "./pages/RestaurantsPage.jsx";
import MenuPage from "./pages/MenuPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import SuccessPage from "./pages/SuccessPage.jsx";
import TrackPage from "./pages/TrackPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import { CATEGORIES, FOODS, RESTS } from "./data.js";
import { clampQty, formatTimeLabel, getRandomInt } from "./utils.js";

const PROMO_CODES = ["NEWSTUDENT50", "LUNCHFREE", "STUDYCOMBO"];

export default function App() {
  const [page, setPage] = useState("landing");
  const [cart, setCart] = useState([]);
  const [promoApplied, setPromoApplied] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [restFilter, setRestFilter] = useState(null);
  const [search, setSearch] = useState("");
  const [currentFoodId, setCurrentFoodId] = useState(null);
  const [foodQty, setFoodQty] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [lastOrder, setLastOrder] = useState(null);
  const [trackResult, setTrackResult] = useState(null);

  const currentFood = useMemo(() => FOODS.find((food) => food.id === currentFoodId), [currentFoodId]);

  const popularFoods = useMemo(() => FOODS.slice(0, 8), []);
  const restPreview = useMemo(() => RESTS.slice(0, 3), []);

  const filteredFoods = useMemo(() => {
    let list = [...FOODS];
    if (restFilter) list = list.filter((food) => food.rest === restFilter);
    if (activeFilter !== "all") list = list.filter((food) => food.tag === activeFilter);
    if (search) {
      const query = search.toLowerCase();
      list = list.filter(
        (food) => food.name.toLowerCase().includes(query) || food.desc.toLowerCase().includes(query)
      );
    }
    return list;
  }, [activeFilter, restFilter, search]);

  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
    const delivery = cart.length ? 500 : 0;
    const total = subtotal + delivery - discount;
    return { subtotal, discount, delivery, total };
  }, [cart, promoApplied]);

  useEffect(() => {
    if (localStorage.getItem("cbTheme") === "light") {
      document.documentElement.classList.add("light");
    }
  }, []);

  useEffect(() => {
    const lock = drawerOpen || cartOpen || loginOpen || signupOpen || currentFoodId !== null;
    document.body.style.overflow = lock ? "hidden" : "";
  }, [drawerOpen, cartOpen, loginOpen, signupOpen, currentFoodId]);

  const addToast = (type, message) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts((prev) => [...prev, { id, type, message, leaving: false }]);
    setTimeout(() => {
      setToasts((prev) => prev.map((toast) => (toast.id === id ? { ...toast, leaving: true } : toast)));
    }, 3200);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3520);
  };

  const handleNavigate = (next) => {
    setPage(next);
    setDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleTheme = () => {
    document.documentElement.classList.toggle("light");
    localStorage.setItem("cbTheme", document.documentElement.classList.contains("light") ? "light" : "dark");
  };

  const addToCart = (id, qty = 1) => {
    const food = FOODS.find((item) => item.id === id);
    if (!food) return;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        return prev.map((item) => (item.id === id ? { ...item, qty: item.qty + qty } : item));
      }
      return [...prev, { ...food, qty }];
    });
    addToast("ok", `${food.emoji} ${food.name} added to cart!`);
  };

  const changeQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const applyPromo = (code) => {
    const cleaned = code.trim().toUpperCase();
    if (PROMO_CODES.includes(cleaned)) {
      setPromoApplied(true);
      addToast("ok", "🎉 Promo applied — 10% off!");
      return;
    }
    addToast("err", "❌ Invalid promo code");
  };

  const openFoodModal = (id) => {
    setCurrentFoodId(id);
    setFoodQty(1);
  };

  const closeFoodModal = () => setCurrentFoodId(null);

  const addFromModal = () => {
    if (!currentFood) return;
    addToCart(currentFood.id, foodQty);
    closeFoodModal();
  };

  const toggleFav = (button) => {
    const isOn = button.classList.toggle("on");
    button.textContent = isOn ? "❤️" : "🤍";
  };

  const openRestaurant = (name) => {
    setRestFilter(name);
    setActiveFilter("all");
    handleNavigate("menu");
  };

  const clearRestaurantFilter = () => {
    setRestFilter(null);
  };

  const goCheckout = () => {
    if (!isLoggedIn) {
      addToast("info", "Please sign in to checkout");
      setCartOpen(false);
      setLoginOpen(true);
      return;
    }
    setCartOpen(false);
    handleNavigate("checkout");
  };

  const placeOrder = () => {
    const name = document.getElementById("co-name")?.value.trim();
    const phone = document.getElementById("co-phone")?.value.trim();
    const addr = document.getElementById("co-addr")?.value.trim();
    if (!name || !phone || !addr) {
      addToast("err", "Please fill in Name, Phone and Address");
      return;
    }
    const orderId = `CB-${new Date().getFullYear()}-${getRandomInt(1000, 9999)}`;
    const eta = `~${getRandomInt(12, 22)} min`;
    setLastOrder({ orderId, eta, rest: cart[0]?.rest || "Ajiwumi Kitchen" });
    setCart([]);
    setPromoApplied(false);
    handleNavigate("success");
  };

  const trackOrder = (value) => {
    const trimmed = value.trim();
    if (!trimmed) {
      addToast("err", "Please enter an Order ID");
      return;
    }
    const restNames = RESTS.map((rest) => rest.name);
    const rest = lastOrder?.rest || restNames[getRandomInt(0, restNames.length - 1)];
    const now = new Date();
    const times = [
      new Date(now - 14 * 60000),
      new Date(now - 12 * 60000),
      new Date(now - 8 * 60000),
      new Date(now - 2 * 60000),
    ].map(formatTimeLabel);
    setTrackResult({
      orderId: trimmed,
      eta: `~${getRandomInt(8, 15)} minutes`,
      rest,
      times,
    });
    addToast("ok", "📍 Order found! Tracking live…");
    handleNavigate("track");
  };

  const handleCopyPromo = (code) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).catch(() => {});
    }
    addToast("ok", `📋 Code "${code}" copied!`);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setLoginOpen(false);
    addToast("ok", "👋 Welcome back to CampusBite!");
  };

  const handleRegister = () => {
    setIsLoggedIn(true);
    setSignupOpen(false);
    addToast("ok", "🎓 Account created! Welcome to CampusBite!");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    addToast("info", "👋 Signed out. See you soon!");
  };

  const handleMessage = () => {
    addToast("ok", "✅ Message sent! We'll reply shortly.");
  };

  const menuTitle = restFilter ? `${restFilter} — Menu` : "Full Menu";
  const menuSubtitle = restFilter
    ? `All available items from ${restFilter}`
    : "Browse all available food items";

  return (
    <div>
      <Navbar
        page={page}
        onNavigate={handleNavigate}
        onToggleTheme={toggleTheme}
        onOpenLogin={() => setLoginOpen(true)}
        onOpenSignup={() => setSignupOpen(true)}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onToggleDrawer={() => setDrawerOpen((prev) => !prev)}
      />

      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onNavigate={(next) => handleNavigate(next)}
        onOpenLogin={() => {
          setDrawerOpen(false);
          setLoginOpen(true);
        }}
        onOpenSignup={() => {
          setDrawerOpen(false);
          setSignupOpen(true);
        }}
      />

      <ToastStack toasts={toasts} />

      <CartFab count={cart.reduce((sum, item) => sum + item.qty, 0)} onOpen={() => setCartOpen(true)} />

      <CartSidebar
        open={cartOpen}
        cart={cart}
        promoApplied={promoApplied}
        totals={totals}
        onClose={() => setCartOpen(false)}
        onApplyPromo={applyPromo}
        onCheckout={goCheckout}
        onChangeQty={changeQty}
        onRemove={removeFromCart}
      />

      <FoodModal
        open={currentFoodId !== null}
        food={currentFood}
        qty={foodQty}
        onClose={closeFoodModal}
        onAdjustQty={(delta) => setFoodQty((qty) => clampQty(qty + delta))}
        onAdd={addFromModal}
      />

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSwitch={() => {
          setLoginOpen(false);
          setSignupOpen(true);
        }}
        onLogin={handleLogin}
      />

      <SignupModal
        open={signupOpen}
        onClose={() => setSignupOpen(false)}
        onSwitch={() => {
          setSignupOpen(false);
          setLoginOpen(true);
        }}
        onRegister={handleRegister}
      />

      {page === "landing" && (
        <LandingPage
          onNavigate={handleNavigate}
          popularFoods={popularFoods}
          restPreview={restPreview}
          onOpenFood={openFoodModal}
          onAddFood={addToCart}
          onToggleFav={toggleFav}
          onCopyPromo={handleCopyPromo}
          onOpenRestaurant={openRestaurant}
        />
      )}
      {page === "restaurants" && <RestaurantsPage rests={RESTS} onOpenRestaurant={openRestaurant} />}
      {page === "menu" && (
        <MenuPage
          title={menuTitle}
          subtitle={menuSubtitle}
          foods={filteredFoods}
          categories={CATEGORIES}
          activeFilter={activeFilter}
          search={search}
          onSearchChange={setSearch}
          onSetFilter={(key) => {
            setActiveFilter(key);
            setRestFilter(null);
          }}
          onNavigate={handleNavigate}
          onOpenFood={openFoodModal}
          onAddFood={addToCart}
          onToggleFav={toggleFav}
          onClearRestaurantFilter={clearRestaurantFilter}
        />
      )}
      {page === "checkout" && <CheckoutPage cart={cart} totals={totals} onPlaceOrder={placeOrder} onNavigate={handleNavigate} />}
      {page === "success" && <SuccessPage orderId={lastOrder?.orderId} eta={lastOrder?.eta} onNavigate={handleNavigate} />}
      {page === "track" && <TrackPage trackResult={trackResult} onTrack={trackOrder} />}
      {page === "about" && <AboutPage onSendMessage={handleMessage} />}

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
