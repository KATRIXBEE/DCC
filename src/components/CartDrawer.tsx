'use client';

import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { GlitchButton } from './GlitchButton';
import { RazorpayCheckoutModal } from './RazorpayCheckoutModal';

export const CartDrawer: React.FC = () => {
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotal, clearCart } =
    useCart();
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = () => {
    setIsCheckoutModalOpen(true);
  };

  const formattedItemsForCheckout = items.map((item) => {
    let price = item.product.price;
    if (item.selectedVariant.includes('3x')) price = 469;
    if (item.selectedVariant.includes('5L')) price = 1299;
    return {
      title: item.product.name,
      variant: item.selectedVariant,
      quantity: item.quantity,
      price,
    };
  });

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        className="fixed inset-0 z-50 overflow-hidden select-none"
      >
        <div
          className="absolute inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
          onClick={closeCart}
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-white border-l-4 border-black flex flex-col justify-between shadow-[-10px_0px_0px_0px_#000000]">
            {/* Header */}
            <div className="p-6 border-b-4 border-black flex items-center justify-between bg-black text-white">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-[#FFDE00]" />
                <h2 id="cart-drawer-title" className="font-heading text-xl uppercase tracking-wider">
                  DISPATCH CART
                </h2>
              </div>
              <button
                onClick={closeCart}
                aria-label="Close cart"
                className="bg-white text-black p-1.5 border-2 border-black hover:bg-[#FF3333] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-16 font-mono">
                  <div className="border-4 border-black p-6 bg-neutral-100 shadow-[4px_4px_0px_0px_#000]">
                    <p className="font-bold text-neutral-600 mb-2">CART IS EMPTY</p>
                    <p className="text-xs text-neutral-500 mb-4">
                      No active bio-enzyme batches in your dispatch queue.
                    </p>
                    <GlitchButton variant="yellow" size="sm" onClick={closeCart}>
                      EXPLORE BATCH 001
                    </GlitchButton>
                  </div>
                </div>
              ) : (
                items.map((item) => {
                  let price = item.product.price;
                  if (item.selectedVariant.includes('3x')) price = 469;
                  if (item.selectedVariant.includes('5L')) price = 1299;

                  return (
                    <div
                      key={`${item.product.id}-${item.selectedVariant}`}
                      className="border-2 border-black p-4 bg-neutral-50 shadow-[4px_4px_0px_0px_#000000]"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-heading text-sm uppercase leading-tight">
                            {item.product.name}
                          </h4>
                          <span className="font-mono text-xs bg-[#FFDE00] text-black px-1.5 py-0.5 border border-black font-bold inline-block mt-1">
                            {item.selectedVariant}
                          </span>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id, item.selectedVariant)}
                          aria-label="Remove item"
                          className="text-neutral-500 hover:text-[#FF3333] p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-black/20 font-mono text-xs">
                        <div className="flex items-center border-2 border-black bg-white">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.selectedVariant,
                                item.quantity - 1
                              )
                            }
                            aria-label="Decrease quantity"
                            className="p-1 hover:bg-[#FFDE00]"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 font-bold">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.selectedVariant,
                                item.quantity + 1
                              )
                            }
                            aria-label="Increase quantity"
                            className="p-1 hover:bg-[#FFDE00]"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="font-bold text-sm">
                          {formatCurrency(price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div className="p-6 border-t-4 border-black bg-white space-y-4 font-mono">
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">DISPATCH FROM:</span>
                    <span className="font-bold">PUNE R&D LAB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">SHIPPING:</span>
                    <span className="font-bold text-[#8A9A5B]">FREE / BATCH 001</span>
                  </div>
                  <div className="flex justify-between text-base font-bold border-t-2 border-black pt-2">
                    <span>SUBTOTAL:</span>
                    <span className="bg-[#FFDE00] px-1">{formatCurrency(subtotal)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <GlitchButton
                    variant="yellow"
                    size="md"
                    fullWidth
                    onClick={handleCheckout}
                  >
                    PROCEED TO RAZORPAY CHECKOUT →
                  </GlitchButton>

                  <button
                    onClick={clearCart}
                    className="w-full text-center text-xs text-neutral-500 hover:text-black py-1 uppercase underline"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <RazorpayCheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        orderData={{
          items: formattedItemsForCheckout,
          totalAmount: subtotal,
        }}
        onSuccess={() => {
          clearCart();
        }}
      />
    </>
  );
};
