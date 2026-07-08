import { createContext, useContext, useState, useEffect } from "react";

const CarritoContext = createContext();

export function CarritoProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem("carrito");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(items));
  }, [items]);

  const agregar = (producto) => {
    setItems((prev) => {
      const existe = prev.find((i) => i._id === producto._id);
      if (existe) {
        return prev.map((i) =>
          i._id === producto._id ? { ...i, cantidad: i.cantidad + 1 } : i
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const quitar = (id) => {
    setItems((prev) => prev.filter((i) => i._id !== id));
  };

  const cambiarCantidad = (id, cantidad) => {
    if (cantidad <= 0) {
      quitar(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i._id === id ? { ...i, cantidad } : i))
    );
  };

  const limpiar = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.cantidad, 0);
  const totalPrecio = items.reduce((sum, i) => {
    const precio = parseFloat(i.precio.replace(/[^0-9]/g, "")) || 0;
    return sum + precio * i.cantidad;
  }, 0);

  return (
    <CarritoContext.Provider value={{ items, agregar, quitar, cambiarCantidad, limpiar, totalItems, totalPrecio }}>
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const ctx = useContext(CarritoContext);
  if (!ctx) throw new Error("useCarrito debe usarse dentro de CarritoProvider");
  return ctx;
}
