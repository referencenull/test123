import { useState } from 'react'

export default function EditQuantityModal({ product, onClose, onQuantityUpdated }) {
  const [quantity, setQuantity] = useState(product.quantity)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    setError('')
    const finalQty = quantity === '' ? 0 : quantity
    setSubmitting(true)
    try {
      const res = await fetch(`/api/products/${product.id}/quantity`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: finalQty }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update quantity')
      onQuantityUpdated(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Edit Quantity</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <div className="p-5">
          <p className="text-sm text-gray-600 mb-4">{product.name}</p>
          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg mb-4">{error}</div>}
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={() => setQuantity(q => Math.max(0, q - 1))}
              className="w-10 h-10 rounded-full border-2 border-gray-300 text-gray-600 text-lg font-bold hover:border-indigo-400 hover:text-indigo-600 flex items-center justify-center"
            >−</button>
            <input
              type="number"
              min="0"
              value={quantity}
              onChange={e => { const val = e.target.value; setQuantity(val === '' ? '' : Math.max(0, parseInt(val) || 0)); }}
              className="w-20 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={() => setQuantity(q => q + 1)}
              className="w-10 h-10 rounded-full border-2 border-gray-300 text-gray-600 text-lg font-bold hover:border-indigo-400 hover:text-indigo-600 flex items-center justify-center"
            >+</button>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose}
              className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={handleSave} disabled={submitting}
              className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
