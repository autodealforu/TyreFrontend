"use client"

import { useState } from "react"
import { MapPin, Plus, Edit, Trash2, Home, Building } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import AccountLayout from "./account-layout"

export default function AccountAddresses() {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: "Home",
      name: "Rahul Sharma",
      phone: "+91 98765 43210",
      address: "123 Main Street, Sector 18, Noida, UP 201301",
      isDefault: true,
    },
    {
      id: 2,
      type: "Office",
      name: "Rahul Sharma",
      phone: "+91 98765 43211",
      address: "456 Business Park, Sector 62, Noida, UP 201309",
      isDefault: false,
    },
  ])

  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [isEditingAddress, setIsEditingAddress] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null)

  const [newAddress, setNewAddress] = useState({
    type: "home",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  })

  const addNewAddress = () => {
    // Add new address logic here
    setIsAddingAddress(false)
    setNewAddress({
      type: "home",
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      landmark: "",
    })
  }

  const editAddress = (id: number) => {
    setEditingAddressId(id)
    setIsEditingAddress(true)
    // In a real app, you would populate the form with the address data
  }

  const updateAddress = () => {
    // Update address logic here
    setIsEditingAddress(false)
    setEditingAddressId(null)
  }

  const deleteAddress = (id: number) => {
    setAddresses(addresses.filter((address) => address.id !== id))
  }

  const setDefaultAddress = (id: number) => {
    setAddresses(
      addresses.map((address) => ({
        ...address,
        isDefault: address.id === id,
      })),
    )
  }

  return (
    <AccountLayout title="My Addresses" description="Manage your delivery addresses">
      <div className="space-y-6">
        {/* Address List */}
        <div className="grid md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <Card key={address.id} className={address.isDefault ? "border-primary" : ""}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        address.type === "Home" ? "bg-blue-100" : "bg-green-100"
                      }`}
                    >
                      {address.type === "Home" ? (
                        <Home className={`h-4 w-4 ${address.type === "Home" ? "text-blue-600" : "text-green-600"}`} />
                      ) : (
                        <Building
                          className={`h-4 w-4 ${address.type === "Home" ? "text-blue-600" : "text-green-600"}`}
                        />
                      )}
                    </div>
                    <span className="font-medium">{address.type}</span>
                  </div>
                  {address.isDefault && (
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      Default
                    </Badge>
                  )}
                </div>

                <div className="space-y-1 mb-4">
                  <div className="font-medium">{address.name}</div>
                  <div className="text-sm text-muted-foreground">{address.address}</div>
                  <div className="text-sm text-muted-foreground">{address.phone}</div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => editAddress(address.id)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Address</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this address? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteAddress(address.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  {!address.isDefault && (
                    <Button variant="outline" size="sm" onClick={() => setDefaultAddress(address.id)}>
                      Set as Default
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add New Address Card */}
          <Dialog open={isAddingAddress} onOpenChange={setIsAddingAddress}>
            <DialogTrigger asChild>
              <Card className="border-dashed cursor-pointer hover:bg-gray-50 transition-colors">
                <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[200px]">
                  <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Plus className="h-6 w-6 text-gray-600" />
                  </div>
                  <h3 className="font-medium text-lg mb-1">Add New Address</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Add a new delivery address to your account
                  </p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Address</DialogTitle>
                <DialogDescription>Add a new delivery address to your account</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Address Type</Label>
                    <Select
                      value={newAddress.type}
                      onValueChange={(value) => setNewAddress({ ...newAddress, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="home">
                          <div className="flex items-center gap-2">
                            <Home className="h-4 w-4" />
                            Home
                          </div>
                        </SelectItem>
                        <SelectItem value="office">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            Office
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input
                      value={newAddress.firstName}
                      onChange={(e) => setNewAddress({ ...newAddress, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input
                      value={newAddress.lastName}
                      onChange={(e) => setNewAddress({ ...newAddress, lastName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Textarea
                    value={newAddress.address}
                    onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                    placeholder="House/Flat no, Building name, Street"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>State</Label>
                    <Input
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Pincode</Label>
                    <Input
                      value={newAddress.pincode}
                      onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Landmark (Optional)</Label>
                    <Input
                      value={newAddress.landmark}
                      onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingAddress(false)}>
                  Cancel
                </Button>
                <Button onClick={addNewAddress}>Add Address</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Empty State */}
        {addresses.length === 0 && (
          <div className="text-center py-12">
            <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No addresses added yet</h3>
            <p className="text-muted-foreground mb-6">Add your first delivery address to get started</p>
            <Button onClick={() => setIsAddingAddress(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Address
            </Button>
          </div>
        )}
      </div>
    </AccountLayout>
  )
}
