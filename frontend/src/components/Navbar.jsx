import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Globe, ShoppingCart, ShoppingBag, Store } from 'lucide-react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import LoginPage from "../pages/signIn/signin";
import SignupDialog from "../pages/SignUp/signup";
import LogoutAlertDialog from "@/hooks/logoutAlert";
import useRouter from "@/hooks/useRouter";
import { NumberStepper } from "@/components/ui/number-stepper"
import NotificationBell from "@/pages/tourist/components/Notifications";

const pages = [
  { label: "Activities", value: "activities" },
  { label: "Itineraries", value: "itineraries" },
  { label: "Places", value: "museums" },
  { label: "Flights", value: "flights" },
  { label: "Hotels", value: "hotels" },
  { label: "Transportation", value: "hotels" },
];

export default function Navbar({ profilePageString, children }) {
  const [cart, setCart] = useState([]);
  const [exchangeRates, setExchangeRates] = useState({})
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { searchParams, location } = useRouter();
  const currentPage = location.pathname + location.search;
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userName, setUserName] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAlertOpen, setAlertOpen] = useState(false);

  const currency = searchParams.get("currency") ?? "USD";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken && decodedToken.userId) {
        setUserName(decodedToken.username);
        setIsLoggedIn(true);
        fetchCart();
      }
    }
  }, [isLoggedIn]);

  const decodeToken = (token) => {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      const now = Math.floor(Date.now() / 1000);
      if (decodedPayload.exp && decodedPayload.exp < now) {
        return null;
      }
      return decodedPayload;
    } catch (e) {
      console.error('Failed to decode token:', e);
      return null;
    }
  };

  const fetchCart = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/tourists/cart', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCart(response.data.cart || []);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      setCart([]);
    }
  };

  const addToCart = async (productId) => {
    try {
      await axios.post(`http://localhost:5001/api/tourists/cart/${productId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchCart();
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`http://localhost:5001/api/tourists/cart/${productId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchCart();
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
    }
  };

  const updateItemQuantity = async (item, newQuantity) => {
    console.log(item);
    try {
        await axios.put(`http://localhost:5001/api/tourists/cart/${item.productId._id}`, { quantity: newQuantity }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      setCart(prevCart => 
        prevCart.map(sth => 
          sth._id === item._id 
            ? { ...sth, quantity: newQuantity }
            : sth
        )
      );
      if (newQuantity===0) {
        setCart(prevCart => prevCart.filter(sth => sth._id !== item._id));
      }
    } catch (error) {
      console.error('Failed to update item quantity:', error);
    }
  };

  const totalItems = Array.isArray(cart) ? cart.reduce((sum, item) => sum + (item.quantity || 0), 0) : 0;
  const totalPrice = cart.reduce((acc, item) => acc + item.productId.price * item.quantity, 0);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    setAlertOpen(true);
  };

  const openSignup = () => {
    setIsSignupOpen(true);
    setIsLoginOpen(false);
  };

  const openLogin = () => {
    setIsLoginOpen(true);
    setIsSignupOpen(false);
  };

  const handleCheckout = () => {
    navigate('/checkout', { state: { cart, currency} });
    navigate(`/checkout?currency=${currency}`,{ state: { cart }});
  };

  useEffect(() => {
    async function fetchExchangeRates() {
      try {
        const response = await axios.get("https://api.exchangerate-api.com/v4/latest/USD");
        setExchangeRates(response.data.rates);
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    }
    fetchExchangeRates();
  }, []);

  const handleCurrencyChange = (e) => {
    searchParams.set("currency", e.target.value);
    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
  };

  return (
    <>
      <nav
        className={`w-screen fixed top-0 left-0 right-0 z-50 flex items-center justify-between pl-6 pr-12 py-3 transition-all duration-300  
          ${
            currentPage === "/" || currentPage === `/?currency=${currency}`
              ? isScrolled 
                ? "bg-gray-800/50 backdrop-blur-md" 
                : "bg-transparent" 
              : "bg-white text-black shadow-sm"
          }`
        }
        style={{ height: "56px" }}
      >
        <div
          className={`cursor-pointer text-2xl font-semibold ${
            (currentPage === "/" || currentPage === `/?currency=${currency}`) ? "text-white" : "text-black"
          }`}
          onClick={() => navigate(`/?currency=${currency}`)}
        >
          TRAVELM8
        </div>

        <div className="hidden md:flex items-center justify-start ml-32 space-x-1">
          {pages.filter(page => page.value !== "products").map((page) => (
            <button
              key={page.value}
              className={`${
                (currentPage === "/" || currentPage === `/?currency=${currency}`)
                  ? "text-white hover:text-white/70"
                  : "text-black hover:text-black/70"
              } ${
                currentPage.includes(`/tourist-page?type=${page.value}`)
                  ? "py-1 px-3 relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-2/3 after:h-0.5 after:bg-primary"
                  : "py-1 px-3"
              }`}
              onClick={() => navigate(`/tourist-page?type=${page.value}&currency=${currency}`)}
            >
              {page.label}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
             <>
              <Button
                variant="ghost"
                size="icon"
                className={(currentPage === "/" || currentPage === `/?currency=${currency}`)  ? "text-white hover:bg-transparent hover:text-white " : "text-black"}
                onClick={() => navigate(`/tourist-page?type=products&currency=${currency}`)}
              >
                <Store className="h-5 w-5" />
              </Button>
              <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={(currentPage === "/" || currentPage === `/?currency=${currency}`)  ? "text-white hover:bg-transparent hover:text-white " : "text-black"}
                  >
                    <div className="relative">
                      <ShoppingCart className="h-5 w-5" />
                      {totalItems > 0 && (
                        <Badge
                          className="absolute -top-2  -right-2 h-4 w-4 flex items-center justify-center p-2"
                        >
                          {totalItems}
                        </Badge>
                      )}
                    </div>
                  </Button>
                </SheetTrigger>
                <SheetContent className="flex flex-col h-screen">
                  <SheetHeader>
                    <SheetTitle>Your Cart</SheetTitle>
                    <SheetDescription>Review your items before checkout</SheetDescription>
                  </SheetHeader>
                  <div className="flex-grow overflow-y-auto">
                    {cart.length > 0 ? (
                      <ul className="space-y-4">
                        {cart.map((item) => (
                          <li key={item?._id} className="flex items-center justify-between space-x-4">
                            <div className="flex items-center space-x-4">
                              <img
                                src={item?.productId?.image || "https://via.placeholder.com/100"}
                                alt={item?.productId.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                              <div>
                                <h4 className="font-medium mb-3 text-md">{item?.productId.name}</h4>
                                <NumberStepper
                                value={item?.quantity}
                                onChange={(newQuantity) => {
                                    updateItemQuantity(item, newQuantity);
                                }}
                                min={0}
                                max={item?.productId.quantity}
                                step={1}  />
                              </div>
                            </div>
                            <span className="font-medium mb-10 text-lg">
                              {(item.productId.price * (exchangeRates[currency] || 1)).formatCurrency(currency)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>Your cart is empty.</p>
                    )}
                  </div>
                  {cart.length > 0 && (
                    <div className="mt-auto">
                      <div className="flex justify-between items-center p-4">
                        <span className="font-medium">Total:</span>
                        <span className="font-bold">{(totalPrice* (exchangeRates[currency] || 1)).formatCurrency(currency)}</span>
                      </div>
                      <Separator />
                      <div className="p-4">
                        <Button className="w-full" onClick={handleCheckout}>
                          Proceed to Checkout
                        </Button>
                      </div>
                    </div>
                  )}
                </SheetContent>
              </Sheet>
              <NotificationBell
                currency={currency}
                currentPage={currentPage}
              />
              <button
                onClick={handleClick}
                className={`${
                  (currentPage === "/" || currentPage === `/?currency=${currency}`) 
                    ? "text-white hover:text-white/80 border border-white rounded-full px-4 py-1 flex items-center space-x-2"
                    : "text-black hover:text-black/80 border border-black rounded-full px-4 py-1 flex items-center space-x-2"
                }`}
              >
                <span>Hello, {userName}</span>
                <ChevronDown className={`h-4 w-4 ${(currentPage === "/" || currentPage === `/?currency=${currency}`)  ? "text-white" : "text-gray-500"}`} />
              </button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                  sx: { p: 0 },
                }}
                PaperProps={{
                  sx: {
                    width: "200px",
                  },
                }}
              >
                <MenuItem onClick={() => navigate("/tourist-profile")}>My profile</MenuItem>
                <MenuItem onClick={handleClose}>My Wishlist</MenuItem>
<MenuItem onClick={() => {
  handleClose();
  navigate("/bookmarks"); // Update this line
}}>My Bookmarks</MenuItem>
<MenuItem onClick={() => {
  handleClose();
  navigate("/preferences"); // Update this line
}}>My Preferences</MenuItem>
                <Separator />
                <MenuItem onClick={() => {handleClose(); handleLogoutClick();}}>Sign out</MenuItem>
              </Menu>
              <LogoutAlertDialog
                isOpen={isAlertOpen}
                onClose={() => setAlertOpen(false)}
                onLogout={() => setIsLoggedIn(false)}
              />
            </>
          ) : (
            <>
              <LoginPage
                isOpen={isLoginOpen}
                onOpenChange={setIsLoginOpen}
                onSignupClick={openSignup}
                onLogin={() => setIsLoggedIn(true)}
              >
                <Button
                  variant="outline"
                  className={`bg-transparent rounded-full px-8 py-2 ${
                    (currentPage === "/" || currentPage === `/?currency=${currency}`)  ? "text-white hover:bg-white/10 hover:text-white" : "text-black"
                  } `}
                >
                  Login
                </Button>
              </LoginPage>
              <SignupDialog
                isOpen={isSignupOpen}
                onOpenChange={setIsSignupOpen}
                onLoginClick={openLogin}
              >
                <button
                  className={`font-medium rounded-full px-8 py-2 ${
                    (currentPage === "/" || currentPage === `/?currency=${currency}`)  ? " bg-white text-black hover:bg-white/90" : "rounded-full px-8 bg-gray-800 hover:bg-gray-700 text-white "
                  } `}
                >
                  Register
                </button>
              </SignupDialog>
            </>
          )}
        </div>
      </nav>
      {React.Children.map(children, child =>
        React.cloneElement(child, { addToCart, cart })
      )}
    </>
  );
}

