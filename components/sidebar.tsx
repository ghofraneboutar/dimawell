"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LayoutDashboard, MessageCircle, Video, Heart, Calendar, Settings, LogOut } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const isActive = (path: string) => {
    return pathname === path
  }

  const navItems = [
    { name: "Tableau de bord", path: "/student/Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: "Messagerie", path: "/messages", icon: <MessageCircle className="h-5 w-5" /> },
    { name: "Consultation vidéo", path: "/simple-call", icon: <Video className="h-5 w-5" /> },
    { name: "Suivi de bien-être", path: "/wellbeing", icon: <Heart className="h-5 w-5" /> },
    { name: "Rendez-vous", path: "/appointments", icon: <Calendar className="h-5 w-5" /> },
    { name: "Paramètres", path: "/settings", icon: <Settings className="h-5 w-5" /> },
  ]

  return (
    <div className="w-64 bg-white border-r h-screen flex flex-col">
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <Heart className="h-8 w-8 text-[#e57373]" />
          <span className="text-2xl font-bold text-[#5c6bc0]">DimaWell</span>
        </div>
      </div>

      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>
              {user?.firstName?.charAt(0) || "E"}
              {user?.lastName?.charAt(0) || "T"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-sm text-gray-500">{user?.email || "etudiant@isetr.tn"}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Button
                variant={isActive(item.path) ? "default" : "ghost"}
                className={`w-full justify-start ${
                  isActive(item.path)
                    ? "bg-[#e8eaf6] text-[#3f51b5] hover:bg-[#e8eaf6] hover:text-[#3f51b5]"
                    : "text-gray-600 hover:text-[#3f51b5]"
                }`}
                asChild
              >
                <Link href={item.path}>
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t">
        <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-red-500" onClick={logout}>
          <LogOut className="h-5 w-5" />
          <span className="ml-3">Déconnexion</span>
        </Button>
      </div>
    </div>
  )
}
