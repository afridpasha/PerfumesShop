import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaSort, FaFilter, FaDownload, FaBox, FaTruck, FaCheck, FaArrowRight } from 'react-icons/fa';
import config from '../config';
import '../styles/Orders.css';

const Orders = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      navigate('/login');
      return;
    }

    // Fetch orders from MongoDB
    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const response = await fetch(`${config.API_URL}/orders/myorders`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        const formattedOrders = data.map(order => ({
          id: order._id,
          date: order.createdAt,
          status: order.isDelivered ? 'delivered' : order.isPaid ? 'processing' : 'pending',
          items: order.orderItems,
          total: order.totalPrice,
          subtotal: order.itemsPrice,
          tax: order.taxPrice,
          shipping: order.shippingPrice,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.isPaid ? 'paid' : 'pending',
          shippingAddress: order.shippingAddress
        }));
        setOrders(formattedOrders);
        setFilteredOrders(formattedOrders);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    filterOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, filterDate, searchQuery, orders]);

  const filterOrders = () => {
    let filtered = [...orders];

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(order => order.status === filterStatus);
    }

    // Filter by date
    if (filterDate === 'last30') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      filtered = filtered.filter(order => new Date(order.date) >= thirtyDaysAgo);
    } else if (filterDate === 'last90') {
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      filtered = filtered.filter(order => new Date(order.date) >= ninetyDaysAgo);
    } else if (filterDate === 'lastyear') {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      filtered = filtered.filter(order => new Date(order.date) >= oneYearAgo);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(query) || 
        order.items.some(item => item.name.toLowerCase().includes(query))
      );
    }

    setFilteredOrders(filtered);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'status-delivered';
      case 'shipped':
        return 'status-shipped';
      case 'processing':
        return 'status-processing';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <FaCheck />;
      case 'shipped':
        return <FaTruck />;
      case 'processing':
        return <FaBox />;
      default:
        return null;
    }
  };

  const reorderItems = (items) => {
    // Add items to cart functionality would go here
    console.log('Reordering items:', items);
    alert('Items have been added to your cart!');
  };

  if (loading) {
    return <div className="orders-loading">Loading your orders...</div>;
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>My Orders</h1>
        <p>View and manage your orders</p>
      </div>

      <div className="orders-filters">
        <div className="search-filter">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-options">
          <div className="filter-group">
            <label htmlFor="status-filter">
              <FaFilter /> Status:
            </label>
            <select
              id="status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Orders</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="date-filter">
              <FaSort /> Date:
            </label>
            <select
              id="date-filter"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="last30">Last 30 Days</option>
              <option value="last90">Last 90 Days</option>
              <option value="lastyear">Last Year</option>
            </select>
          </div>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="no-orders">
          <h2>No orders found</h2>
          <p>Try adjusting your filters or start shopping to place new orders.</p>
          <Link to="/products" className="shop-now-btn">Shop Now</Link>
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h2>Order #{order.id}</h2>
                  <p className="order-date">Placed on {formatDate(order.date)}</p>
                </div>
                <div className={`order-status ${getStatusClass(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                </div>
              </div>

              <div className="order-details">
                <div className="order-summary">
                  <div className="summary-row">
                    <span>Order Total:</span>
                    <span className="total-amount">{formatCurrency(order.total)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Items:</span>
                    <span>{order.items.reduce((acc, item) => acc + item.quantity, 0)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping:</span>
                    <span>{order.shippingMethod}</span>
                  </div>
                  <div className="summary-row">
                    <span>Payment:</span>
                    <span className="payment-status">{order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}</span>
                  </div>
                </div>

                <div className="delivery-info">
                  <h3>Delivery Information</h3>
                  <p>
                    {order.estimatedDelivery ? (
                      <>
                        <strong>Estimated Delivery:</strong> {formatDate(order.estimatedDelivery)}
                      </>
                    ) : 'Delivery date will be provided once shipped.'}
                  </p>
                  {order.trackingNumber && (
                    <p>
                      <strong>Tracking Number:</strong> {order.trackingNumber}
                    </p>
                  )}
                  {order.shippingAddress && (
                    <p className="shipping-address">
                      <strong>Ship to:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                    </p>
                  )}
                </div>
              </div>

              <div className="order-items">
                <h3>Order Items</h3>
                <div className="items-list">
                  {order.items.map((item, index) => (
                    <div key={`${order.id}-item-${index}`} className="order-item">
                      <div className="item-image">
                        <img 
                          src={item.image || 'https://via.placeholder.com/100x100?text=Perfume'} 
                          alt={item.name} 
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/100x100?text=Perfume';
                          }} 
                        />
                      </div>
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        <p className="item-size">{item.size || '50ml'}</p>
                        <p className="item-variation">{item.variation || 'Standard'}</p>
                        <p className="item-price">{formatCurrency(item.price)} × {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-timeline">
                <h3>Order Timeline</h3>
                <div className="timeline">
                  {order.timeline && order.timeline.length > 0 ? (
                    order.timeline.map((event, index) => (
                      <div key={index} className="timeline-event">
                        <div className="timeline-marker"></div>
                        <div className="timeline-content">
                          <h4>{event.status}</h4>
                          <p className="event-date">{formatDate(event.date)}</p>
                          <p className="event-description">{event.description}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div key={`${order.id}-timeline-default`} className="timeline-event">
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <h4>Order Placed</h4>
                        <p className="event-date">{formatDate(order.date)}</p>
                        <p className="event-description">Your order has been received and is being processed.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="order-actions">
                <button className="action-btn" onClick={() => reorderItems(order.items)}>
                  <FaArrowRight /> Reorder
                </button>
                <button className="action-btn">
                  <FaDownload /> Invoice
                </button>
                <button className="action-btn help-btn">
                  Need Help?
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="orders-support">
        <h3>Need Assistance with Your Order?</h3>
        <div className="support-options">
          <div className="support-option">
            <h4>Contact Customer Service</h4>
            <p>Our team is available to help you with any questions.</p>
            <button className="support-btn">Chat with Us</button>
          </div>
          <div className="support-option">
            <h4>Return an Item</h4>
            <p>Initiate a return within 30 days of delivery.</p>
            <button className="support-btn">Start Return</button>
          </div>
          <div className="support-option">
            <h4>Order FAQs</h4>
            <p>Find answers to common order questions.</p>
            <button className="support-btn">View FAQs</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders; 