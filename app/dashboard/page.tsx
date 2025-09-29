import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardNav } from "@/components/dashboard-nav"
import { NewsletterComposer } from "@/components/newsletter-composer"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: contacts, error } = await supabase
    .from("joinlist_dosaheaven")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching contacts:", error)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <main className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Newsletter Composer</h1>
          <p className="text-muted-foreground">Create and send newsletters to your contacts</p>
        </div>
        <NewsletterComposer contacts={contacts || []} />
      </main>
    </div>
  )
}
