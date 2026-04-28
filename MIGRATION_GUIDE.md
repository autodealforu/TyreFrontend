# Migration Guide: Order Schema Update

## Overview

This guide helps you migrate from the old order schema to the new multi-vendor checkout system schema. Changes

## ⚠️ Important: Backup Before Migration

\`\`\`bash
# Create a backup of your orders collection
mongodump --db your_database_name --collection orders --out backup_$(date +%Y%m%d)
\`\`\`

## Migration Steps

### Step 1: Install New Schema Files

Replace your existing order schema file with the new `UPDATED_ORDER_SCHEMA.js` and add the `UPDATED_ORDER_ENUMS.js` file.

### Step 2: Database Migration Script

Create a migration script to update existing orders:

\`\`\`javascript
// migration_script.js
import mongoose from 'mongoose';
import Order from './path/to/your/old/order/model.js';

const migrateOrders = async () => {
  try {
    console.log('Starting order migration...');

    const orders = await Order.find({});
    console.log(`Found ${orders.length} orders to migrate`);

    for (const order of orders) {
      const updateData = {};

      // 1. Migrate address structure
      if (order.address) {
        updateData.shipping_address = {
          address_1: order.address.address_1,
          address_2: order.address.address_2,
          city: order.address.city,
          state: order.address.state,
          pin: order.address.pin,
          landmark: order.address.landmark,
        };

        // Set billing same as shipping by default
        updateData.billing_address = {
          ...updateData.shipping_address,
          same_as_shipping: true,
        };
      }

      // 2. Migrate products array to include vendor information
      if (order.products && order.products.length > 0) {
        updateData.products = order.products.map((product) => ({
          ...product.toObject(),
          vendor: order.vendor || null, // Use existing vendor or null
          installation_fee: 0, // Default installation fee
          vendor_details: {
            name: 'Legacy Vendor', // Default name
            store_name: 'Legacy Store',
            location: 'Unknown',
            phone: '',
          },
        }));
      }

      // 3. Add delivery details
      updateData.delivery_details = {
        option: 'STANDARD',
        delivery_charges: order.delivery_charges || 0,
      };

      // 4. Add installation details
      updateData.installation_details = {
        option: 'STORE',
        total_installation_fee: 0,
      };

      // 5. Add payment details
      updateData.payment_details = {
        payment_status: order.is_paid ? 'SUCCESS' : 'PENDING',
        currency: 'INR',
      };

      // 6. Migrate vendor commission
      if (order.vendor && order.commission) {
        updateData.vendor_commissions = [
          {
            vendor: order.vendor,
            products_total: order.sub_total || 0,
            installation_total: 0,
            commission_percentage: order.commission.commission_percentage || 10,
            commission_amount: order.commission.commission_amount || 0,
            is_paid: order.commission.is_paid || false,
          },
        ];
      }

      // 7. Initialize new fields
      updateData.inventory_reserved = false;
      updateData.inventory_details = [];
      updateData.is_split_order = false;
      updateData.notifications = [];
      updateData.order_notes = [];

      // Update the order
      await Order.findByIdAndUpdate(order._id, { $set: updateData });
      console.log(`Migrated order ${order.order_id || order._id}`);
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
};

// Run migration
migrateOrders();
\`\`\`

### Step 3: Update Your API Endpoints

#### Order Creation Endpoint

\`\`\`javascript
// POST /api/orders
app.post('/api/orders', async (req, res) => {
  try {
    const orderData = req.body;

    // Validate required fields
    const requiredFields = [
      'total_amount',
      'sub_total',
      'shipping_address',
      'customer',
      'products',
    ];
    for (const field of requiredFields) {
      if (!orderData[field]) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }

    // Auto-calculate vendor commissions
    if (orderData.products && orderData.products.length > 0) {
      const vendorTotals = {};

      orderData.products.forEach((product) => {
        const vendorId = product.vendor;
        if (!vendorTotals[vendorId]) {
          vendorTotals[vendorId] = {
            products_total: 0,
            installation_total: 0,
          };
        }

        vendorTotals[vendorId].products_total +=
          (product.sale_price || product.regular_price || 0) * product.quantity;
        vendorTotals[vendorId].installation_total +=
          (product.installation_fee || 0) * product.quantity;
      });

      orderData.vendor_commissions = Object.keys(vendorTotals).map(
        (vendorId) => ({
          vendor: vendorId,
          products_total: vendorTotals[vendorId].products_total,
          installation_total: vendorTotals[vendorId].installation_total,
          commission_percentage: 10, // Configure this
          commission_amount:
            (vendorTotals[vendorId].products_total +
              vendorTotals[vendorId].installation_total) *
            0.1,
          is_paid: false,
        })
      );
    }

    // Set default values
    if (!orderData.billing_address && orderData.shipping_address) {
      orderData.billing_address = {
        ...orderData.shipping_address,
        same_as_shipping: true,
      };
    }

    if (!orderData.delivery_details) {
      orderData.delivery_details = {
        option: 'STANDARD',
        delivery_charges: orderData.delivery_charges || 0,
      };
    }

    if (!orderData.installation_details) {
      orderData.installation_details = {
        option: 'STORE',
        total_installation_fee: 0,
      };
    }

    const order = new Order(orderData);
    await order.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message,
    });
  }
});
\`\`\`

#### Order Retrieval Endpoints

\`\`\`javascript
// GET /api/orders/:id
app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findOne({ order_id: req.params.id })
      .populate('customer.customer', 'name email phone')
      .populate('products.product')
      .populate('products.vendor', 'name email phone store_name location')
      .populate('vendor_commissions.vendor', 'name store_name');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message,
    });
  }
});

// GET /api/orders - with filtering
app.get('/api/orders', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      customer,
      vendor,
      payment_status,
      date_from,
      date_to,
    } = req.query;

    const filter = {};

    if (status) filter.status = status;
    if (customer) filter['customer.customer'] = customer;
    if (vendor) filter['vendor_commissions.vendor'] = vendor;
    if (payment_status)
      filter['payment_details.payment_status'] = payment_status;
    if (date_from || date_to) {
      filter.order_date = {};
      if (date_from) filter.order_date.$gte = new Date(date_from);
      if (date_to) filter.order_date.$lte = new Date(date_to);
    }

    const orders = await Order.find(filter)
      .populate('customer.customer', 'name email')
      .populate('vendor_commissions.vendor', 'name store_name')
      .sort({ order_date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: orders,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / limit),
        total_records: total,
        per_page: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message,
    });
  }
});
\`\`\`

### Step 4: Update Status Management

\`\`\`javascript
// PATCH /api/orders/:id/status
app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const { status, note } = req.body;
    const orderId = req.params.id;

    const order = await Order.findOne({ order_id: orderId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Validate status transition
    const { STATUS_WORKFLOW } = await import('./UPDATED_ORDER_ENUMS.js');
    const allowedStatuses = STATUS_WORKFLOW[order.status] || [];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from ${order.status} to ${status}`,
        allowed_statuses: allowedStatuses,
      });
    }

    // Update status
    order.status = status;

    // Add note if provided
    if (note) {
      order.order_notes.push({
        note,
        added_by: req.user?.id, // Assuming user authentication
        note_type: 'INTERNAL',
      });
    }

    await order.save();

    // Send notification (implement based on your notification system)
    // await sendOrderStatusNotification(order);

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message,
    });
  }
});
\`\`\`

### Step 5: Environment Configuration

Add these environment variables:

\`\`\`env
# Commission settings
DEFAULT_COMMISSION_PERCENTAGE=10
COD_CHARGES_PERCENTAGE=2
INSTALLATION_COMMISSION_PERCENTAGE=15

# Order limits
MIN_ORDER_AMOUNT=500
MAX_ORDER_AMOUNT=500000
MAX_PRODUCTS_PER_ORDER=50
COD_MAX_AMOUNT=50000

# Inventory settings
INVENTORY_RESERVE_DURATION=30

# Payment gateway
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
\`\`\`

## Testing the Migration

### 1. Test Order Creation

\`\`\`javascript
const testOrderData = {
  total_amount: 15999,
  sub_total: 13559,
  tax: 2440,
  delivery_charges: 0,
  shipping_address: {
    address_1: '123 Test Street',
    city: 'Test City',
    state: 'Test State',
    pin: 123456,
  },
  customer: {
    name: 'Test Customer',
    phone: '+91 9876543210',
    email: 'test@example.com',
  },
  products: [
    {
      product: 'product_id_here',
      vendor: 'vendor_id_here',
      name: 'Test Tyre',
      quantity: 2,
      sale_price: 6779.5,
      installation_fee: 0,
    },
  ],
  payment_method: 'COD',
};

// POST to /api/orders
\`\`\`

### 2. Verify Migration

\`\`\`javascript
// Check a few migrated orders
const sampleOrders = await Order.find({}).limit(5);
console.log('Sample migrated orders:', sampleOrders);

// Verify new fields exist
const orderWithNewFields = await Order.findOne({
  delivery_details: { $exists: true },
  installation_details: { $exists: true },
  vendor_commissions: { $exists: true },
});
console.log('Order with new fields:', orderWithNewFields);
\`\`\`

## Rollback Plan

If you need to rollback:

\`\`\`bash
# Restore from backup
mongorestore --db your_database_name --collection orders backup_YYYYMMDD/your_database_name/orders.bson --drop
\`\`\`

## Post-Migration Tasks

1. **Update frontend integration** to use new order structure
2. **Configure commission percentages** in environment variables
3. **Set up payment gateway** integration
4. **Configure notification system** for order updates
5. **Update admin dashboard** to handle new order fields
6. **Test order workflow** end-to-end

## Support

If you encounter issues during migration:

1. Check the console logs for specific error messages
2. Verify all required fields are present in the new schema
3. Ensure all referenced collections (User, Product) exist
4. Test with a small subset of orders first

This migration preserves all existing order data while adding the new multi-vendor checkout capabilities.


DOne some changessssssssss
