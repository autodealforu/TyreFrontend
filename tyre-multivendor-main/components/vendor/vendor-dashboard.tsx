"use client"

import { useState } from "react"
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  DollarSign,
  Eye,
  Edit,
  Plus,
  Filter,
  Download,
  Bell,
  Settings,
  Store,
  MapPin,
  Clock,
  Star,
  Award,
  Target,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock data - in real app this would come from API
const mockVendorData = {
  vendor: {
    name: "Premium Tyres Store",
    email: "vendor@premiumtyres.com",
    phone: "+91 98765 43210",
    store_name: "Premium Tyres & Auto Parts",
    store_description: "Leading supplier of premium tyres and automotive parts with 15+ years of experience",
    rating: 4.8,
    totalReviews: 1247,
    joinedDate: "2020-03-15",
    status: "verified",
    pickup_address: [
      {
        address_1: "123 Auto Street",
        city: "Mumbai",
        state: "Maharashtra",
        pin: "400001",
      },
    ],
  },
  stats: {
    totalProducts: 156,
    activeOrders: 23,
    totalRevenue: 2847500,
    monthlyRevenue: 185000,
    totalCustomers: 892,
    averageRating: 4.8,
    completionRate: 96.5,
    responseTime: "2.3 hours",
  },
  recentOrders: [
    {
      id: "ORD-2024-001",
      customer: "Rajesh Kumar",
      product: "Michelin Primacy 4 195/65 R15",
      amount: 8500,
      status: "processing",
      date: "2024-01-15",
      quantity: 4,
    },
    {
      id: "ORD-2024-002",
      customer: "Priya Sharma",
      product: "MRF ZLX 205/55 R16",
      amount: 12000,
      status: "shipped",
      date: "2024-01-14",
      quantity: 4,
    },
    {
      id: "ORD-2024-003",
      customer: "Amit Patel",
      product: "Bridgestone Turanza T001 225/45 R17",
      amount: 15600,
      status: "delivered",
      date: "2024-01-13",
      quantity: 4,
    },
  ],
  topProducts: [
    {
      name: "Michelin Primacy 4",
      sales: 45,
      revenue: 382500,
      growth: 12.5,
    },
    {
      name: "MRF ZLX",
      sales: 38,
      revenue: 304000,
      growth: 8.2,
    },
    {
      name: "Bridgestone Turanza",
      sales: 32,
      revenue: 499200,
      growth: 15.7,
    },
  ],
}

export default function VendorDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const { vendor, stats, recentOrders, topProducts } = mockVendorData

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-linear-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Store className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Vendor Dashboard</h1>
                <p className="text-slate-600">Welcome back, {vendor.store_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="rounded-xl">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm" className="rounded-xl">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 bg-white rounded-2xl p-2 shadow-sm border border-slate-200/50">
            <TabsTrigger value="overview" className="rounded-xl font-medium">
              Overview
            </TabsTrigger>
            <TabsTrigger value="products" className="rounded-xl font-medium">
              Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="rounded-xl font-medium">
              Orders
            </TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-xl font-medium">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="profile" className="rounded-xl font-medium">
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-slate-200/50 shadow-lg rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Total Revenue</p>
                      <p className="text-2xl font-bold text-slate-900">₹{stats.totalRevenue.toLocaleString()}</p>
                      <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3" />
                        +12.5% from last month
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200/50 shadow-lg rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Active Orders</p>
                      <p className="text-2xl font-bold text-slate-900">{stats.activeOrders}</p>
                      <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        {stats.responseTime} avg response
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <ShoppingCart className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200/50 shadow-lg rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Total Products</p>
                      <p className="text-2xl font-bold text-slate-900">{stats.totalProducts}</p>
                      <p className="text-xs text-purple-600 flex items-center gap-1 mt-1">
                        <Package className="h-3 w-3" />
                        Active listings
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Package className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200/50 shadow-lg rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Customer Rating</p>
                      <p className="text-2xl font-bold text-slate-900">{stats.averageRating}</p>
                      <p className="text-xs text-amber-600 flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3 fill-current" />
                        {vendor.totalReviews} reviews
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                      <Star className="h-6 w-6 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <div className="grid lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 border-slate-200/50 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/50">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      Recent Orders
                    </span>
                    <Button variant="outline" size="sm" className="rounded-xl">
                      <Eye className="h-4 w-4 mr-2" />
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-linear-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                            <span className="text-sm font-semibold text-blue-600">{order.customer.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{order.customer}</p>
                            <p className="text-sm text-slate-600">{order.product}</p>
                            <p className="text-xs text-slate-500">Order #{order.id}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900">₹{order.amount.toLocaleString()}</p>
                          <Badge className={`text-xs ${getStatusColor(order.status)}`}>{order.status}</Badge>
                          <p className="text-xs text-slate-500 mt-1">{order.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200/50 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/50">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-600" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-600">Order Completion</span>
                      <span className="text-sm font-semibold text-slate-900">{stats.completionRate}%</span>
                    </div>
                    <Progress value={stats.completionRate} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-600">Customer Satisfaction</span>
                      <span className="text-sm font-semibold text-slate-900">
                        {((stats.averageRating / 5) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <Progress value={(stats.averageRating / 5) * 100} className="h-2" />
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Award className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">Verified Vendor</p>
                        <p className="text-xs text-slate-500">Premium partner since 2020</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Response Time</span>
                        <span className="font-medium text-slate-900">{stats.responseTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Total Customers</span>
                        <span className="font-medium text-slate-900">{stats.totalCustomers}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Products */}
            <Card className="border-slate-200/50 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/50">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Top Performing Products
                  </span>
                  <Button variant="outline" size="sm" className="rounded-xl">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  {topProducts.map((product, index) => (
                    <div
                      key={product.name}
                      className="p-4 bg-linear-to-br from-white to-slate-50 rounded-xl border border-slate-200/50"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-8 h-8 bg-linear-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          #{index + 1}
                        </div>
                        <Badge className="bg-green-100 text-green-800 text-xs">+{product.growth}%</Badge>
                      </div>
                      <h4 className="font-semibold text-slate-900 mb-2">{product.name}</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Sales</span>
                          <span className="font-medium">{product.sales} units</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Revenue</span>
                          <span className="font-medium">₹{product.revenue.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card className="border-slate-200/50 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/50">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-blue-600" />
                    Product Management
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="rounded-xl">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <Package className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Product Management</h3>
                  <p className="text-slate-600 mb-6">Manage your product inventory, pricing, and availability</p>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Product
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card className="border-slate-200/50 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/50">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-blue-600" />
                    Order Management
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="rounded-xl">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter Orders
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-xl">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell className="max-w-xs truncate">{order.product}</TableCell>
                        <TableCell>₹{order.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(order.status)}`}>{order.status}</Badge>
                        </TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="rounded-lg">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm" className="rounded-lg">
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="border-slate-200/50 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/50">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Sales Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <BarChart3 className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Advanced Analytics</h3>
                  <p className="text-slate-600">
                    Detailed sales reports, customer insights, and performance metrics coming soon
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 border-slate-200/50 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/50">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Vendor Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">Store Name</label>
                      <p className="text-slate-900 font-semibold">{vendor.store_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">Email</label>
                      <p className="text-slate-900">{vendor.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">Phone</label>
                      <p className="text-slate-900">{vendor.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">Status</label>
                      <Badge className="bg-green-100 text-green-800 border-green-200">{vendor.status}</Badge>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Store Description</label>
                    <p className="text-slate-600">{vendor.store_description}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Pickup Address</label>
                    <div className="flex items-start gap-2 text-slate-600">
                      <MapPin className="h-4 w-4 mt-1 text-slate-400" />
                      <div>
                        <p>{vendor.pickup_address[0].address_1}</p>
                        <p>
                          {vendor.pickup_address[0].city}, {vendor.pickup_address[0].state} -{" "}
                          {vendor.pickup_address[0].pin}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-slate-200/50 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/50">
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-purple-600" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-linear-to-br from-amber-400 to-amber-600 rounded-2xl mx-auto mb-3 flex items-center justify-center">
                      <Award className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-900">Premium Vendor</h3>
                    <p className="text-sm text-slate-600">Top-rated seller</p>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Star className="h-4 w-4 text-green-600 fill-current" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">4.8+ Rating</p>
                        <p className="text-xs text-slate-500">Excellent customer service</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Clock className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">Fast Response</p>
                        <p className="text-xs text-slate-500">Under 3 hours average</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Users className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">Trusted Partner</p>
                        <p className="text-xs text-slate-500">Since {new Date(vendor.joinedDate).getFullYear()}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
