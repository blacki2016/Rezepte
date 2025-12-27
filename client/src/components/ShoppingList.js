import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ShoppingList.css';

function ShoppingList() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    item: '',
    quantity: '',
    category: 'Other'
  });

  useEffect(() => {
    fetchShoppingList();
  }, []);

  const fetchShoppingList = async () => {
    try {
      const response = await axios.get('/api/planner/shopping-list');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching shopping list:', error);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/planner/shopping-list', newItem);
      setItems([...items, response.data]);
      setNewItem({ item: '', quantity: '', category: 'Other' });
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const toggleItem = async (id) => {
    try {
      const response = await axios.patch(`/api/planner/shopping-list/${id}/toggle`);
      setItems(items.map(i => i.id === id ? response.data : i));
    } catch (error) {
      console.error('Error toggling item:', error);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`/api/planner/shopping-list/${id}`);
      setItems(items.filter(i => i.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const getItemsByCategory = () => {
    const grouped = {};
    items.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    return grouped;
  };

  const groupedItems = getItemsByCategory();
  const categories = Object.keys(groupedItems);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Vegetables': return '🥬';
      case 'Fruits': return '🍎';
      case 'Dairy': return '🥛';
      case 'Meat': return '🥩';
      case 'Bakery': return '🍞';
      case 'Pantry': return '🥫';
      default: return '🛒';
    }
  };

  return (
    <div className="shopping-list">
      <div className="list-header">
        <h1>Einkaufsliste 🛒</h1>
      </div>

      <div className="add-item-form">
        <h3>Neuen Artikel hinzufügen</h3>
        <form onSubmit={handleAddItem}>
          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                value={newItem.item}
                onChange={(e) => setNewItem({ ...newItem, item: e.target.value })}
                placeholder="Artikel"
                required
                className="form-control"
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                placeholder="Menge"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                className="form-control"
              >
                <option value="Other">Andere</option>
                <option value="Vegetables">Gemüse</option>
                <option value="Fruits">Obst</option>
                <option value="Dairy">Milchprodukte</option>
                <option value="Meat">Fleisch</option>
                <option value="Bakery">Backwaren</option>
                <option value="Pantry">Vorrat</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary">
              +
            </button>
          </div>
        </form>
      </div>

      <div className="list-content">
        {items.length === 0 ? (
          <div className="no-items">
            <p>Deine Einkaufsliste ist leer.</p>
            <p>Füge deinen ersten Artikel hinzu!</p>
          </div>
        ) : (
          <div className="categories-list">
            {categories.map(category => (
              <div key={category} className="category-group">
                <h2 className="category-header">
                  {getCategoryIcon(category)} {category}
                </h2>
                <div className="items-list">
                  {groupedItems[category].map(item => (
                    <div
                      key={item.id}
                      className={`item-card ${item.checked ? 'checked' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => toggleItem(item.id)}
                        className="item-checkbox"
                      />
                      <div className="item-info">
                        <div className="item-name">{item.item}</div>
                        {item.quantity && (
                          <div className="item-quantity">{item.quantity}</div>
                        )}
                      </div>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="btn-delete-item"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ShoppingList;
