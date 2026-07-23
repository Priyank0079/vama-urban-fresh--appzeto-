import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import Lottie from "lottie-react";
import LocationDrawer from "./LocationDrawer";
import { useLocation } from "../../context/LocationContext";
import { useProductDetail } from "../../context/ProductDetailContext";
import { useSettings } from "@core/context/SettingsContext";
import { cn } from "@/lib/utils";
import { applyCloudinaryTransform } from "@/core/utils/imageUtils";
import {
  buildHeaderGradient,
  buildMiniCartColor,
  buildSearchBarBackgroundColor,
  shiftHex,
} from "../../utils/headerTheme";
import LogoImage from "../../../../assets/Logo.png";

// MUI Icons
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";
import MicIcon from "@mui/icons-material/Mic";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ChevronDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

function CategoryNavColumn({
  cat,
  isActive,
  categoryAccent,
  onCategorySelect,
  headerFontColor,
  headerIconColor,
  baseHeaderColor,
}) {
  const iconColor = isActive ? baseHeaderColor : (headerIconColor || "#64748b");
  const activeBgColor = baseHeaderColor || "var(--primary)";

  return (
    <motion.div
      layout
      whileTap={{ scale: 0.96 }}
      onClick={() => onCategorySelect && onCategorySelect(cat)}
      className="relative z-[2] flex min-w-[70px] shrink-0 cursor-pointer flex-col items-center gap-1.5 px-2.5 pb-2.5 pt-2 snap-start md:min-w-[90px] md:px-4 transition-all duration-200 group"
    >
      <motion.div
        className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-105"
        style={{
          color: iconColor,
        }}
      >
        {typeof cat.icon === "function" ||
        (typeof cat.icon === "object" && cat.icon.$$typeof) ? (
          <cat.icon
            sx={{
              fontSize: { xs: 18, md: 20 },
              color: iconColor,
              transition: "color 0.2s, transform 0.2s",
            }}
          />
        ) : (
          <img
            src={applyCloudinaryTransform(cat.icon, "f_auto,q_auto,w_100")}
            alt={cat.name}
            loading="lazy"
            className="h-5 w-5 object-contain"
            style={{ 
              filter: isActive ? `drop-shadow(0px 2px 4px ${activeBgColor}33)` : "none" 
            }}
          />
        )}
      </motion.div>
      <div className="relative w-full text-center">
        <span
          className={cn(
            "relative z-10 mx-auto block max-w-[76px] truncate px-1 text-center text-[10px] uppercase tracking-wider md:max-w-[92px] md:text-[11px] transition-colors duration-200",
            isActive ? "font-bold" : "font-semibold text-slate-500 group-hover:text-slate-800",
          )}
          style={{
            color: isActive ? activeBgColor : undefined,
          }}
        >
          {cat.name}
        </span>
      </div>

      {isActive && (
        <motion.div
          layoutId="activeCategoryLine"
          className="absolute bottom-0 left-3 right-3 h-[3px] rounded-t-full"
          style={{ backgroundColor: activeBgColor }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </motion.div>
  );
}


const MainLocationHeader = ({
  categories = [],
  activeCategory,
  onCategorySelect,
}) => {
  const { scrollY } = useScroll();
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [cartAnimData, setCartAnimData] = useState(null);
  const [logoAnimData, setLogoAnimData] = useState(null);

  // Dynamically load shopping-cart and logo Lottie on mount
  useEffect(() => {
    import("../../../../assets/lottie/shopping-cart.json")
      .then((m) => setCartAnimData(m.default))
      .catch(() => {});
    import("../../../../assets/INSTANT_6.json")
      .then((m) => setLogoAnimData(m.default))
      .catch(() => {});
  }, []);
  const { currentLocation, refreshLocation, isFetchingLocation } =
    useLocation();
  const { isOpen: isProductDetailOpen } = useProductDetail();
  const { settings } = useSettings();
  const appName = settings?.appName || "App";
  const logoUrl = settings?.logoUrl || LogoImage;
  const navigate = useNavigate();

  // Search Logic
  const handleSearchClick = () => {
    navigate("/search");
  };

  const handleMicClick = (e) => {
    e.stopPropagation();
    navigate("/search", { state: { startVoice: true } });
  };

  const handleImageSearchClick = (e) => {
    e.stopPropagation();
    navigate("/search", { state: { startImageSearch: true } });
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      navigate("/search", { state: { query: e.target.value } });
    }
  };

  // Search placeholder animation
  const [searchPlaceholder, setSearchPlaceholder] = useState("Search ");
  const [typingState, setTypingState] = useState({
    textIndex: 0,
    charIndex: 0,
    isDeleting: false,
    isPaused: false,
  });

  const staticText = "Search ";
  const typingPhrases = [
    '"bread"',
    '"milk"',
    '"chocolate"',
    '"eggs"',
    '"chips"',
  ];

  useEffect(() => {
    const { textIndex, charIndex, isDeleting, isPaused } = typingState;
    const currentPhrase = typingPhrases[textIndex];

    if (isPaused) {
      const timeout = setTimeout(() => {
        setTypingState((prev) => ({
          ...prev,
          isPaused: false,
          isDeleting: true,
        }));
      }, 2000); // Pause after full phrase
      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          // Typing
          if (charIndex < currentPhrase.length) {
            setSearchPlaceholder(
              staticText + currentPhrase.substring(0, charIndex + 1),
            );
            setTypingState((prev) => ({
              ...prev,
              charIndex: prev.charIndex + 1,
            }));
          } else {
            // Finished typing
            setTypingState((prev) => ({ ...prev, isPaused: true }));
          }
        } else {
          // Deleting
          if (charIndex > 0) {
            setSearchPlaceholder(
              staticText + currentPhrase.substring(0, charIndex - 1),
            );
            setTypingState((prev) => ({
              ...prev,
              charIndex: prev.charIndex - 1,
            }));
          } else {
            // Finished deleting
            setTypingState((prev) => ({
              ...prev,
              isDeleting: false,
              textIndex: (prev.textIndex + 1) % typingPhrases.length,
            }));
          }
        }
      },
      isDeleting ? 50 : 100,
    ); // 50ms deleting speed, 100ms typing speed

    return () => clearTimeout(timeout);
  }, [typingState]);

  // Smooth scroll interpolations
  const headerTopPadding = useTransform(scrollY, [0, 160], [16, 16]);
  const headerBottomPadding = useTransform(scrollY, [0, 160], [4, 4]);
  const headerRoundness = useTransform(scrollY, [0, 160], [0, 0]);
  const bgOpacity = useTransform(scrollY, [0, 160], [1, 1]);

  // Content animations
  const contentHeight = useTransform(scrollY, [0, 160], ["64px", "64px"]);
  const contentOpacity = useTransform(scrollY, [0, 160], [1, 1]);
  const navHeight = useTransform(scrollY, [0, 200], ["60px", "60px"]);
  const navOpacity = useTransform(scrollY, [0, 200], [1, 1]);
  const navMargin = useTransform(scrollY, [0, 200], [4, 4]);
  const categorySpacing = useTransform(scrollY, [0, 200], [3, 3]);
  const cartOpacity = useTransform(scrollY, [0, 110, 150], [1, 1, 1]);
  const cartScale = useTransform(scrollY, [0, 110, 150], [1, 1, 1]);

  // Helper to hide elements completely when collapsed to prevent clicks
  const displayContent = useTransform(scrollY, (value) => "block");
  const displayNav = useTransform(scrollY, (value) => "flex");
  const displayCart = useTransform(scrollY, (value) => "block");

  const baseHeaderColor = activeCategory?.headerColor || "var(--primary)";
  const headerFontColor = activeCategory?.headerFontColor || "#ffffff";
  const headerIconColor = activeCategory?.headerIconColor || "#ffffff";
  
  const headerGradient = buildHeaderGradient(baseHeaderColor);
  const searchBarBg = buildSearchBarBackgroundColor(baseHeaderColor);
  const categoryAccent = headerIconColor;

  useEffect(() => {
    const c = buildMiniCartColor(baseHeaderColor);
    document.documentElement.style.setProperty("--customer-mini-cart-color", c);
    return () => {
      document.documentElement.style.removeProperty(
        "--customer-mini-cart-color",
      );
    };
  }, [baseHeaderColor]);

  return (
    <>
      <div
        className={cn(
          "fixed top-0 left-0 right-0 z-[200]",
          isProductDetailOpen && "hidden md:block",
        )}>
        <motion.div
          initial={false}
          style={{
            paddingTop: headerTopPadding,
            paddingBottom: headerBottomPadding,
            borderBottomLeftRadius: headerRoundness,
            borderBottomRightRadius: headerRoundness,
            opacity: bgOpacity,
            backgroundColor: headerGradient,
          }}
          className="px-4 shadow-[0_4px_20px_rgba(0,0,0,0.15)] overflow-hidden transform-gpu will-change-transform">
          {/* Subtle Glow Overlay */}
          <div className="absolute inset-0 bg-white/8 pointer-events-none" />

          {/* Top-Right Logo Lottie (MOBILE ONLY) */}
          <div className="absolute top-3 right-3 z-20 w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] md:hidden pointer-events-none bg-transparent">
            {logoAnimData ? (
              <Lottie
                animationData={logoAnimData}
                loop
                className="w-full h-full"
              />
            ) : (
              <div className="w-full h-full" />
            )}
          </div>

          {/* Notification Icon (Mobile) */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/notifications")}
            className="absolute top-5 right-20 sm:top-6 sm:right-24 md:hidden z-20 cursor-pointer"
            style={{ color: headerFontColor }}
          >
            <NotificationsNoneOutlinedIcon sx={{ fontSize: 28 }} />
          </motion.button>

          {/* WhatsApp Support/Order Icon (Mobile) */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              const message = encodeURIComponent("Hello Vamaa Urban Fresh! I would like to place a direct order / make an inquiry.");
              window.open("https://wa.me/918305357624?text=" + message, "_blank");
            }}
            className="absolute top-5 right-32 sm:top-6 sm:right-36 md:hidden z-20 cursor-pointer hover:text-[#25D366] transition-colors"
            style={{ color: headerFontColor }}
            title="Direct Order / Inquiry via WhatsApp"
          >
            <WhatsAppIcon sx={{ fontSize: 28 }} />
          </motion.button>

          {/* Desktop/Tablet Header Layout (md and above) */}
          <div className="hidden md:flex items-center justify-between relative z-20 px-2 lg:px-6 mb-1 mt-0">
            {/* Left Section: Logo + Location row */}
            <div className="flex items-center gap-4 lg:gap-8">
              <div
                onClick={() => navigate("/")}
                className="flex items-center gap-3 cursor-pointer group shrink-0">
                <div className="group-hover:scale-110 transition-all duration-300 w-16 h-16 flex items-center justify-center bg-transparent">
                  {logoAnimData ? (
                    <Lottie
                      animationData={logoAnimData}
                      loop
                      className="w-full h-full"
                    />
                  ) : (
                    <img
                      src={logoUrl}
                      alt={`${appName} Logo`}
                      loading="lazy"
                      className="h-10 w-auto object-contain"
                    />
                  )}
                </div>
              </div>
              {/* Location Block (Desktop inline row) */}
              <div className="flex flex-col border-l border-white/20 pl-4 lg:pl-6 justify-center">
                <div className="flex items-center gap-1 opacity-90 mb-0.5">
                  <AccessTimeIcon sx={{ fontSize: 12, color: headerFontColor }} />
                  <span 
                    className="text-[10px] font-extrabold uppercase tracking-wider leading-none"
                    style={{ color: headerFontColor }}
                  >
                    {currentLocation.time}
                  </span>
                </div>
                <button
                  type="button"
                  data-lenis-prevent
                  data-lenis-prevent-touch
                  onClick={() => {
                    setIsLocationOpen(true);
                  }}
                  className="flex items-center gap-0.5 hover:opacity-85 cursor-pointer group active:scale-95 transition-all border-0 bg-transparent p-0 text-left"
                  style={{ color: headerFontColor }}
                >
                  <LocationOnIcon sx={{ fontSize: 13, color: "inherit" }} />
                  <span 
                    className="text-[12px] font-bold leading-tight max-w-[180px] lg:max-w-[240px] truncate"
                  >
                    {isFetchingLocation
                      ? "Detecting location..."
                      : currentLocation.name}
                  </span>
                  <ChevronDownIcon
                    sx={{ fontSize: 12, opacity: 0.7, color: "inherit" }}
                  />
                </button>
              </div>
            </div>

            {/* Center Section: Search Bar */}
            <div className="flex-grow max-w-[700px] lg:max-w-4xl px-4 lg:px-8">
              <motion.div
                onClick={handleSearchClick}
                whileHover={{ scale: 1.005 }}
                whileTap={{ scale: 0.995 }}
                style={{ backgroundColor: searchBarBg }}
                className="rounded-full px-4.5 h-11.5 shadow-md flex items-center border border-white/20 transition-all duration-200 cursor-pointer relative group">
                <SearchIcon sx={{ color: "rgba(0,0,0,0.55)", fontSize: 20 }} />
                <input
                  type="text"
                  placeholder={searchPlaceholder || "Search Products..."}
                  readOnly
                  className="flex-1 bg-transparent border-none outline-none pl-2 text-slate-800 font-semibold placeholder:text-slate-600 text-[14px] cursor-pointer"
                />
                
                {/* Ctrl + K Shortcut Badge */}
                <div className="hidden lg:flex items-center gap-0.5 bg-black/5 border border-black/10 rounded-md px-1.5 py-0.5 text-[9px] font-bold text-slate-600 select-none mr-2 shadow-2xs">
                  <span>Ctrl</span>
                  <span>K</span>
                </div>

                <div className="flex items-center gap-2.5 border-l border-slate-300/40 pl-3">
                  <button
                    type="button"
                    onClick={handleMicClick}
                    className="p-1 hover:bg-black/5 rounded-full transition-colors flex items-center justify-center cursor-pointer text-slate-600 hover:text-black"
                  >
                    <MicIcon sx={{ fontSize: 20 }} />
                  </button>
                  <button
                    type="button"
                    onClick={handleImageSearchClick}
                    className="p-1 hover:bg-black/5 rounded-full transition-colors flex items-center justify-center cursor-pointer text-slate-600 hover:text-black"
                    title="Search by image/camera"
                  >
                    <CameraAltIcon sx={{ fontSize: 20 }} />
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Right Section: Action Icons */}
            <div className="flex items-center gap-5 lg:gap-8 shrink-0">
              <motion.button
                whileHover={{ scale: 1.15, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  const message = encodeURIComponent("Hello Vamaa Urban Fresh! I would like to place a direct order / make an inquiry.");
                  window.open("https://wa.me/918305357624?text=" + message, "_blank");
                }}
                className="transition-all hover:text-[#25D366]"
                style={{ color: headerFontColor }}
                title="Direct Order / Inquiry via WhatsApp"
              >
                <WhatsAppIcon sx={{ fontSize: 25 }} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.15, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate("/wishlist")}
                className="transition-all hover:text-red-500"
                style={{ color: headerFontColor }}
              >
                <FavoriteBorderOutlinedIcon sx={{ fontSize: 24 }} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.15, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate("/notifications")}
                className="transition-all hover:text-slate-700 relative group"
                style={{ color: headerFontColor }}
              >
                <NotificationsNoneOutlinedIcon sx={{ fontSize: 24 }} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.15, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate("/checkout")}
                className="transition-all hover:text-slate-700 relative group"
                style={{ color: headerFontColor }}
              >
                <ShoppingCartOutlinedIcon sx={{ fontSize: 24 }} />
                <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-brand-900 text-[9px] font-semibold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-brand-800 shadow-sm transition-transform group-hover:-translate-y-0.5">
                  0
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate("/profile")}
                className="lg:bg-white/30 p-1.5 lg:rounded-full hover:bg-white transition-all"
                style={{ color: headerFontColor }}
              >
                <AccountCircleOutlinedIcon sx={{ fontSize: 28 }} />
              </motion.button>
            </div>
          </div>

          {/* Collapsible Delivery Info & Location (MOBILE ONLY) */}
          <div className="md:hidden">
            <motion.div
              className="relative z-10 mb-4">
              <div className="mb-1.5">
                <span 
                  className="inline-flex items-center rounded-full bg-black/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm"
                  style={{ color: headerFontColor }}
                >
                  {appName}
                </span>
              </div>
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <AccessTimeIcon sx={{ fontSize: 16, color: headerFontColor }} />
                    <span 
                      className="text-base font-bold tracking-tight leading-none"
                      style={{ color: headerFontColor }}
                    >
                      {currentLocation.time}
                    </span>
                  </div>
                  <button
                    type="button"
                    data-lenis-prevent
                    data-lenis-prevent-touch
                    onClick={() => {
                      setIsLocationOpen(true);
                    }}
                    className="flex items-center gap-1 text-slate-800 cursor-pointer group active:scale-95 transition-transform border-0 bg-transparent p-0 text-left">
                    <LocationOnIcon sx={{ fontSize: 14, color: headerFontColor }} />
                    <div 
                      className="text-[10px] font-medium leading-tight max-w-[280px] truncate"
                      style={{ color: headerFontColor }}
                    >
                      {isFetchingLocation
                        ? "Detecting location..."
                        : currentLocation.name}
                    </div>
                    <ChevronDownIcon
                      sx={{ fontSize: 12, opacity: 0.5, color: headerFontColor }}
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Search Bar (MOBILE ONLY) */}
          <div className="relative z-10 mt-[1.5px] flex items-center gap-2 md:hidden">
            <motion.div
              onClick={handleSearchClick}
              whileTap={{ scale: 0.98 }}
              className="flex-1 rounded-xl px-3 h-11 bg-[#f1f5f9] flex items-center border-none transition-all duration-200 cursor-pointer shadow-sm">
              <SearchIcon sx={{ color: "#64748b", fontSize: 20 }} />
              <input
                type="text"
                placeholder={searchPlaceholder || "Search \"chips\""}
                readOnly
                className="flex-1 bg-transparent border-none outline-none pl-2 text-slate-800 font-medium placeholder:text-slate-500 text-[15px] cursor-pointer"
              />
              <div className="flex items-center gap-2.5 border-l border-slate-300 pl-2.5">
                <button
                  type="button"
                  onClick={handleMicClick}
                  className="p-1 hover:bg-black/5 rounded-full transition-colors flex items-center justify-center cursor-pointer text-slate-500 hover:text-slate-800"
                >
                  <MicIcon sx={{ fontSize: 20 }} />
                </button>
                <button
                  type="button"
                  onClick={handleImageSearchClick}
                  className="p-1 hover:bg-black/5 rounded-full transition-colors flex items-center justify-center cursor-pointer text-slate-500 hover:text-slate-800"
                  title="Search by image/camera"
                >
                  <CameraAltIcon sx={{ fontSize: 20 }} />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Categories Navigation - Smooth Collapse */}
          {categories.length > 0 && (
            <div className="relative mt-2 md:mt-1 -mx-4 z-10">
              {/* White background block that starts below the curve area */}
              <div className="absolute top-[8px] md:top-[6px] inset-x-0 bottom-0 bg-white border-b border-gray-100 shadow-sm z-0" />
              
              <motion.div
                layout
                transition={{ duration: 0.1 }}
                className="relative z-10 flex items-end md:justify-center gap-3 md:gap-6 overflow-x-auto no-scrollbar px-4 md:px-0 snap-x pt-[12px] md:pt-[8px] min-h-[64px] md:min-h-[58px] pb-0.5">
                {categories.map((cat) => {
                  const isActive = String(activeCategory?._id || activeCategory?.id || "") === String(cat._id || cat.id || "");
                  return (
                    <CategoryNavColumn
                      key={cat.id}
                      cat={cat}
                      isActive={isActive}
                      categoryAccent={cat.headerColor || "#1e293b"}
                      onCategorySelect={onCategorySelect}
                      headerFontColor="#64748b"
                      headerIconColor="#1e293b"
                      baseHeaderColor={cat.headerColor || baseHeaderColor}
                    />
                  );
                })}
              </motion.div>
            </div>
          )}

          {/* Background Decorative patterns */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none" />
        </motion.div>
      </div>

      <LocationDrawer
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
      />
    </>
  );
};

export default MainLocationHeader;

