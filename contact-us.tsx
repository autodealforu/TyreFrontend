"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  Star,
  Award,
  Users,
  Headphones,
  MessageSquare,
  Navigation,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"
import axios from "axios"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    serviceType: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const contactInfo = [
    {
      icon: Phone,
      title: "Call Us",
      details: ["+91 98765 43210", "+91 11 4567 8900"],
      description: "24/7 Customer Support",
      color: "from-[#14213d] to-[#1a2b4a]",
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["info@autodeal4u.com", "support@autodeal4u.com"],
      description: "Quick Response Guaranteed",
      color: "from-[#fca311] to-[#e8940f]",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: ["123 Tyre Street, Auto City", "New Delhi, India 110001"],
      description: "Premium Showroom Experience",
      color: "from-[#14213d] to-[#1a2b4a]",
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Mon-Sat: 9:00 AM - 8:00 PM", "Sunday: 10:00 AM - 6:00 PM"],
      description: "Extended Hours Available",
      color: "from-[#fca311] to-[#e8940f]",
    },
  ]

  const locations = [
    {
      name: "Delhi Showroom",
      address: "123 Tyre Street, Auto City, New Delhi 110001",
      phone: "+91 11 4567 8900",
      manager: "Rajesh Kumar",
      services: ["Premium Tyres", "Wheel Alignment", "Balancing", "Installation"],
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      name: "Mumbai Branch",
      address: "456 Auto Plaza, Andheri West, Mumbai 400058",
      phone: "+91 22 9876 5432",
      manager: "Priya Sharma",
      services: ["All Brands", "Express Service", "Home Delivery", "Consultation"],
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      name: "Bangalore Center",
      address: "789 Tech Park Road, Whitefield, Bangalore 560066",
      phone: "+91 80 1234 5678",
      manager: "Amit Patel",
      services: ["Performance Tyres", "SUV Specialist", "Fleet Services", "Warranty"],
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9042"
      const response = await axios.post(`${apiUrl}/api/contacts`, formData)

      if (response.status === 201 || response.status === 200) {
        toast.success("Message sent successfully! We'll get back to you soon.")
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          serviceType: "",
        })
      } else {
        toast.error("Something went wrong. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("Failed to send message. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#e5e5e5]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-[#14213d] via-[#1a2b4a] to-[#14213d] text-white">
        <div className="absolute inset-0 bg-[url('/images/tyre-pattern.svg')] opacity-5"></div>
        <div className="absolute inset-0 bg-linear-to-r from-[#fca311]/10 to-transparent"></div>

        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20">
              <Headphones className="w-5 h-5 text-[#fca311]" />
              <span className="font-medium">24/7 Premium Customer Support</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Get in <span className="text-[#fca311]">Touch</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/80 max-w-3xl mx-auto leading-relaxed">
              Experience premium customer service with our expert team. We're here to help you find the perfect
              automotive solutions.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <CheckCircle className="w-4 h-4 text-[#fca311]" />
                <span>Instant Response</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <Star className="w-4 h-4 text-[#fca311] fill-current" />
                <span>Expert Consultation</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <Award className="w-4 h-4 text-[#fca311]" />
                <span>Premium Service</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-25  relative z-10 px-15">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <Card
                key={index}
                className="bg-white/90 backdrop-blur-sm border-[#e5e5e5]/50 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105"
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 bg-linear-to-br ${info.color} rounded-2xl flex items-center justify-center`}
                  >
                    <info.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#000000] mb-2">{info.title}</h3>
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-[#14213d] font-medium mb-1">
                      {detail}
                    </p>
                  ))}
                  <p className="text-sm text-[#14213d]/70 mt-2">{info.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-20 px-30 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <div>
              <div className="inline-flex items-center gap-2 bg-[#fca311]/10 text-[#fca311] rounded-full px-4 py-2 mb-6 border border-[#fca311]/20">
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm font-medium">Send us a Message</span>
              </div>

              <h2 className="text-4xl font-bold text-[#000000] mb-6">Let's Start a Conversation</h2>
              <p className="text-[#14213d]/70 mb-8 text-lg">
                Fill out the form below and our expert team will get back to you within 24 hours with personalized
                recommendations.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-[#000000] font-semibold mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-[#e5e5e5] rounded-xl focus:border-[#fca311] focus:outline-none transition-colors bg-white text-[#000000]"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-[#000000] font-semibold mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-[#e5e5e5] rounded-xl focus:border-[#fca311] focus:outline-none transition-colors bg-white text-[#000000]"
                      placeholder="+91 98765 43210"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-[#000000] font-semibold mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-[#e5e5e5] rounded-xl focus:border-[#fca311] focus:outline-none transition-colors bg-white text-[#000000]"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="serviceType" className="block text-[#000000] font-semibold mb-2">
                    Service Interest
                  </label>
                  <select
                    id="serviceType"
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-[#e5e5e5] rounded-xl focus:border-[#fca311] focus:outline-none transition-colors bg-white text-[#000000]"
                  >
                    <option value="">Select a service</option>
                    <option value="tyres">Premium Tyres</option>
                    <option value="wheels">Alloy Wheels</option>
                    <option value="services">Professional Services</option>
                    <option value="consultation">Expert Consultation</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-[#000000] font-semibold mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-[#e5e5e5] rounded-xl focus:border-[#fca311] focus:outline-none transition-colors bg-white text-[#000000]"
                    placeholder="Brief subject of your inquiry"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-[#000000] font-semibold mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-4 py-3 border-2 border-[#e5e5e5] rounded-xl focus:border-[#fca311] focus:outline-none transition-colors bg-white text-[#000000] resize-none"
                    placeholder="Tell us about your requirements, vehicle details, or any specific questions..."
                    required
                  ></textarea>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-linear-to-r from-[#fca311] to-[#e8940f] hover:from-[#e8940f] hover:to-[#d4850e] text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Map & Additional Info */}
            <div className="space-y-8">
              <div className="bg-linear-to-br from-[#14213d] to-[#1a2b4a] rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">Why Choose Autodeal4U?</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-[#fca311] mt-1 shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Expert Consultation</h4>
                      <p className="text-white/80 text-sm">Professional advice from certified automotive specialists</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-[#fca311] mt-1 shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Premium Quality</h4>
                      <p className="text-white/80 text-sm">Only genuine products from trusted manufacturers</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-[#fca311] mt-1 shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">24/7 Support</h4>
                      <p className="text-white/80 text-sm">Round-the-clock customer service and emergency assistance</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-[#fca311] mt-1 shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Competitive Pricing</h4>
                      <p className="text-white/80 text-sm">Best prices with transparent billing and no hidden costs</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#e5e5e5] rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-[#000000] mb-4">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#fca311] mb-1">50K+</div>
                    <div className="text-sm text-[#14213d]">Happy Customers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#fca311] mb-1">25+</div>
                    <div className="text-sm text-[#14213d]">Years Experience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#fca311] mb-1">500+</div>
                    <div className="text-sm text-[#14213d]">Service Centers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#fca311] mb-1">4.8★</div>
                    <div className="text-sm text-[#14213d]">Customer Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Store Locations */}
      <section className="py-20 px-25 bg-[#e5e5e5]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#000000] mb-4">Visit Our Premium Showrooms</h2>
            <p className="text-xl text-[#14213d]/70 max-w-2xl mx-auto">
              Experience our world-class facilities and expert services at any of our premium locations
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {locations.map((location, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden border-white/50 bg-white"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={location.image || "/placeholder.svg"}
                    alt={location.name}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-[#fca311] text-white">Premium Location</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-[#000000] mb-2">{location.name}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-[#fca311] mt-1 shrink-0" />
                      <p className="text-sm text-[#14213d]">{location.address}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#fca311]" />
                      <p className="text-sm text-[#14213d]">{location.phone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#fca311]" />
                      <p className="text-sm text-[#14213d]">Manager: {location.manager}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-[#000000] text-sm">Available Services:</h4>
                    <div className="flex flex-wrap gap-1">
                      {location.services.map((service, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs border-[#fca311] text-[#fca311]">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-16 bg-linear-to-r from-[#14213d] to-[#1a2b4a] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/tyre-pattern.svg')] opacity-10"></div>

        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#fca311]/20 text-[#fca311] rounded-full px-6 py-3 mb-6 border border-[#fca311]/30">
              <Phone className="w-5 h-5" />
              <span className="font-medium">24/7 Emergency Support</span>
            </div>

            <h2 className="text-4xl font-bold mb-6">Need Immediate Assistance?</h2>
            <p className="text-xl mb-8 opacity-90">
              Our emergency response team is available round-the-clock for urgent automotive needs
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button className="bg-[#fca311] hover:bg-[#e8940f] text-white rounded-xl px-8 py-4 font-semibold text-lg">
                <Phone className="w-5 h-5 mr-2" />
                Emergency: +91 98765 43210
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#14213d] rounded-xl px-8 py-4 font-semibold bg-transparent"
              >
                <Navigation className="w-5 h-5 mr-2" />
                Find Nearest Location
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 mt-8 text-sm opacity-80">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Available 24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Instant Response</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span>Expert Technicians</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactUs
