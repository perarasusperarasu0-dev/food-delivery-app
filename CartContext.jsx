import { createContext, useState, useContext } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // [{ menuItem, name, price, quantity }]

  const addItem = (item) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.menuItem === item._id);
      if (existing) {
        return prev.map((i) =>
          i.menuItem === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { menuItem: item._id, name: item.name, price: item.price, quantity: 1 }];
    });
  };

  const updateQuantity = (menuItemId, quantity) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.menuItem !== menuItemId));
    } else {
      setItems((prev) =>
        prev.map((i) => (i.menuItem === menuItemId ? { ...i, quantity } : i))
      );
    }
  };

  const clearCart = () => setItems([]);

  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, updateQuantity, clearCart, totalAmount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
