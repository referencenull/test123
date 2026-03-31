import { useState, useEffect, useCallback } from 'react'
import ProductGrid from './components/ProductGrid'
import SearchBar from './components/SearchBar'
import AddProductModal from './components/AddProductModal'
import EditQuantityModal from './components/EditQuantityModal'

export default function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(null)
  const [toasts, setToasts] = useState([])

  const categories = ['All', 'Electronics', 'Clothing', 'Food & Beverages', 'Sports', 'Home & Garden']

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }, [])

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (selectedCategory && selectedCategory !== 'All') params.set('category', selectedCategory)
      if (sortBy) params.set('sort', sortBy)
      const res = await fetch(`/api/products?${params}`)
      if (!res.ok) throw new Error('Failed to fetch products')
      const data = await res.json()
      setProducts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [search, selectedCategory, sortBy])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setProducts(prev => prev.filter(p => p.id !== id))
      addToast('Product deleted successfully')
    } catch (err) {
      addToast(err.message, 'error')
    }
  }

  const handleProductAdded = (product) => {
    setShowAddModal(false)
    fetchProducts()
    addToast(`"${product.name}" added successfully`)
  }

  const handleQuantityUpdated = (updated) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p))
    setShowEditModal(null)
    addToast('Quantity updated successfully')
  }

  const lowStockCount = products.filter(p => p.quantity < 5).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Inventory Manager</h1>
              <div className="flex gap-4 mt-1 text-sm text-gray-500">
                <span>{products.length} products</span>
                {lowStockCount > 0 && (
                  <span className="text-red-600 font-medium">⚠ {lowStockCount} low stock</span>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium transition-colors"
            >
              + Add Product
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Sort: Default</option>
            <option value="name">Name (A-Z)</option>
            <option value="price">Price (Low-High)</option>
            <option value="quantity">Quantity (Low-High)</option>
            <option value="category">Category</option>
          </select>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:border-indigo-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">{error}</div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <ProductGrid
            products={products}
            onDelete={handleDelete}
            onEditQty={(product) => setShowEditModal(product)}
          />
        )}
      </main>

      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onProductAdded={handleProductAdded}
        />
      )}

      {showEditModal && (
        <EditQuantityModal
          product={showEditModal}
          onClose={() => setShowEditModal(null)}
          onQuantityUpdated={handleQuantityUpdated}
        />
      )}

      {/* Toast notifications */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium ${
              toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  )
}
