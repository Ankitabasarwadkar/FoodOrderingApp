import { useEffect, useState } from "react";
import {
  getCart,
  removeItem,
  clearCart,
  updateQuantity
} from "../services/cartService";


 
 export default function Cart() {
  const [cart, setCart] = useState(null);

  const loadCart = async () => {
  const res = await getCart();
  console.log("cart response", res);

  if (res.status === "success") {
    setCart(res.data);
  } else {
    setCart({ items: [], totalAmount: 0 });
  }
};
  useEffect(() => {
    loadCart();
  }, []);

  const increase = async (id, qty) => {
    await updateQuantity(id, qty + 1);
    loadCart();
  };

  const decrease = async (id, qty) => {
    if (qty <= 1) return;
    await updateQuantity(id, qty - 1);
    loadCart();
  };

  const remove = async (id) => {
    await removeItem(id);
    loadCart();
  };

  const clear = async () => {
    await clearCart();
    loadCart();
  };

  if (!cart) return <h4 className="text-center mt-5">Loading...</h4>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Cart</h2>

      {cart.items.length === 0 && (
  <div className="text-center mt-5">
    <img
      src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
      alt="empty cart"
      width="150"
    />
    <h4 className="mt-3">Your cart is empty</h4>
    <p className="text-muted">
      You can go to home page to view more restaurants
    </p>

    <button
      className="btn btn-warning mt-2"
      onClick={() => window.location.href = "/home"}
    >
      SEE RESTAURANTS NEAR YOU
    </button>
  </div>
)}

      {cart.items.map((item) => (
        <div className="card mb-3 shadow-sm" key={item.foodId._id}>
          <div className="card-body d-flex justify-content-between align-items-center">
            
            <div>
              <h5 className="mb-1">{item.foodId.name}</h5>
              <p className="mb-1 text-muted">₹ {item.price}</p>

              <div className="d-flex align-items-center">
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() =>
                    decrease(item.foodId._id, item.quantity)
                  }
                >
                  -
                </button>

                <span className="mx-3 fw-bold">
                  {item.quantity}
                </span>

                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() =>
                    increase(item.foodId._id, item.quantity)
                  }
                >
                  +
                </button>
              </div>
            </div>

            <button
              className="btn btn-danger btn-sm"
              onClick={() => remove(item.foodId._id)}
            >
              Remove
            </button>

          </div>
        </div>
      ))}

      {cart.items.length > 0 && (
        <div className="card p-3 shadow-sm">
          <h4>Total Amount: ₹ {cart.totalAmount}</h4>

          <div className="mt-3">
            <button
              className="btn btn-outline-danger"
              onClick={clear}
            >
              Clear Cart
            </button>

            <button
              className="btn btn-success ms-2"
              onClick={() => window.location.href="/checkout"}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}