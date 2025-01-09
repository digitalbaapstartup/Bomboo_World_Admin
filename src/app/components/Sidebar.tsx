'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ChevronDown, LayoutDashboard, ShoppingCart, Layers, Box, FileText, User, Users, Image, BarChart3, Menu } from 'lucide-react'

interface NavItem {
  title: string
  icon: React.ReactNode
  href?: string
  children?: { title: string; href: string }[]
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    href: '/dashboard'
  },
  {
    title: 'Admin Login',
    icon: "",
    href: '/admin-login'
  },
  {
    title: 'Category',
    icon: <Layers className="w-5 h-5" />,
    children: [
      { title: 'All Categories', href: '/all-categories' },
      { title: 'Add Category', href: '#' },
    ]
  },
  {
    title: 'Product',
    icon: <Box className="w-5 h-5" />,
    children: [
      { title: 'Add Product', href: '/Add-Product' },
      { title: 'Product List', href: '/product-list' },
    ]
  },
  {
    title: 'Order',
    icon: <FileText className="w-5 h-5" />,
    children: [
      { title: 'Order List', href: '/all-orders' },
    ]
  },
  {
    title: 'User',
    icon: <User className="w-5 h-5" />,
    children: [
      { title: 'All Users', href: '/all-users' },
    ]
  },
  {
    title: 'Homepage Setting',
    icon: <User className="w-5 h-5" />,
    children: [
      { title: 'Header', href: '#' },
      { title: 'Hero section', href: '#' },
      { title: 'Add Logo', href: '#' },
    ]
  },
  {
    title: 'Report',
    icon: <BarChart3 className="w-5 h-5" />,
    href: '/report'
  },
]

export default function Sidebar() {
  const [openItems, setOpenItems] = useState<string[]>(['Order'])
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const toggleItem = (title: string) => {
    setOpenItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-background border rounded-md"
      >
        <Menu className="w-5 h-5" />
      </button>

      <aside className={cn(
        "fixed top-0 left-0 z-40 h-screen transition-transform bg-background border-r",
        "w-64 lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center gap-2 p-4 border-b">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">BW</span>
          </div>
          <span className="font-semibold text-xl">Bomboo World</span>
        </div>

        <div className="py-4">
          <div className="px-4 py-2">
            <p className="text-xs text-muted-foreground">MAIN HOME</p>
          </div>

          <nav className="space-y-1 px-2">
            {navItems.map((item) => (
              <div key={item.title}>
                {item.children ? (
                  <div>
                    <button
                      onClick={() => toggleItem(item.title)}
                      className={cn(
                        "flex items-center justify-between w-full px-3 py-2 text-sm rounded-md transition-colors",
                        "hover:bg-accent hover:text-accent-foreground",
                        openItems.includes(item.title) && "bg-accent/50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.title}</span>
                      </div>
                      <ChevronDown 
                        className={cn(
                          "w-4 h-4 transition-transform",
                          openItems.includes(item.title) && "transform rotate-180"
                        )} 
                      />
                    </button>
                    <div
                      className={cn(
                        "overflow-hidden transition-all duration-300 ease-in-out",
                        openItems.includes(item.title) ? "max-h-40" : "max-h-0"
                      )}
                    >
                      <div className="pt-1 pl-10">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="flex items-center gap-2 px-3 py-2 text-sm rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
                          >
                            {child.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href!}
                    className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </div>
  )
}

