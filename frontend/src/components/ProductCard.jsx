const categoryColors = {
  'Electronics': 'bg-blue-100 text-blue-700',
  'Clothing': 'bg-purple-100 text-purple-700',
  'Food & Beverages': 'bg-green-100 text-green-700',
  'Sports': 'bg-orange-100 text-orange-700',
  'Home & Garden': 'bg-emerald-100 text-emerald-700',
}

export default function ProductCard({ product, onDelete, onEditQty }) {
  const stockInfo = product.quantity < 5
    ? { label: 'Low Stock!', cls: 'bg-red-100 text-red-700' }
    : product.quantity < 20
    ? { label: 'Limited', cls: 'bg-orange-100 text-orange-700' }
    : { label: 'In Stock', cls: 'bg-green-100 text-green-700' }

  const handleDelete = () => {
    if (window.confirm(`Delete "${product.name}"?`)) {
      onDelete(product.id)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div>
        <h3 className="font-semibold text-gray-900 text-sm leading-tight">{product.name}</h3>
        <p className="text-xs text-gray-400 mt-0.5">{product.sku}</p>
      </div>

      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[product.category] || 'bg-gray-100 text-gray-600'}`}>
          {product.category}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${stockInfo.cls}`}>
          {stockInfo.label} ({product.quantity})
        </span>
      </div>

      <p className="text-indigo-600 font-bold text-lg">${product.price.toFixed(2)}</p>

      {product.description && (
        <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>
      )}

      <div className="flex gap-2 mt-auto pt-2 border-t border-gray-100">
        <button
          onClick={() => onEditQty(product)}
          className="flex-1 text-xs py-1.5 rounded-lg border border-indigo-300 text-indigo-600 hover:bg-indigo-50 font-medium transition-colors"
        >
          Edit Qty
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 text-xs py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 font-medium transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
