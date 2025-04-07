import React from 'react'

function AddToCartButton() {
    return (
        <div>
            <div className="p-4">
                <h3 className="font-medium mb-1">{product.title}</h3>
                <div className="flex justify-between items-center">
                    <span className="text-red-600 font-semibold">
                        ${product.price.toFixed(2)}
                    </span>
                    <button
                        onClick={() => useCartStore.getState().addItem(product)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                        aria-label={`Add ${product.title} to cart`}
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AddToCartButton