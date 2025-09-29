"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ContactsTable } from "@/components/contacts-table"
import { Send, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

type Contact = {
  id: number
  first_name: string
  last_name: string
  email: string
  country: string
  subscribed_newsletters: boolean
  is_active: boolean
  created_at: string
}

type NewsletterComposerProps = {
  contacts: Contact[]
}

export function NewsletterComposer({ contacts }: NewsletterComposerProps) {
  const [subject, setSubject] = useState("")
  const [messageBody, setMessageBody] = useState("")
  const [selectedContacts, setSelectedContacts] = useState<number[]>([])
  const [isSending, setIsSending] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSend = async () => {
    if (!subject.trim()) {
      toast({
        title: "Subject required",
        description: "Please enter a subject for your newsletter",
        variant: "destructive",
      })
      return
    }

    if (!messageBody.trim()) {
      toast({
        title: "Message required",
        description: "Please enter a message body for your newsletter",
        variant: "destructive",
      })
      return
    }

    if (selectedContacts.length === 0) {
      toast({
        title: "No recipients selected",
        description: "Please select at least one contact to send the newsletter to",
        variant: "destructive",
      })
      return
    }

    setIsSending(true)

    try {
      const response = await fetch("/api/send-newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          messageBody,
          contactIds: selectedContacts,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send newsletter")
      }

      toast({
        title: "Newsletter sent!",
        description: `Successfully sent to ${data.recipientCount} recipients`,
      })

      // Reset form
      setSubject("")
      setMessageBody("")
      setSelectedContacts([])

      // Redirect to history
      router.push("/dashboard/history")
    } catch (error) {
      console.error("Error sending newsletter:", error)
      toast({
        title: "Failed to send",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Compose Newsletter</CardTitle>
          <CardDescription>Create and send a newsletter to your selected contacts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Enter newsletter subject..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Write your newsletter message here..."
              value={messageBody}
              onChange={(e) => setMessageBody(e.target.value)}
              rows={10}
              className="resize-none"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Select Recipients</CardTitle>
          <CardDescription>Choose which contacts should receive this newsletter</CardDescription>
        </CardHeader>
        <CardContent>
          <ContactsTable
            contacts={contacts}
            selectedContacts={selectedContacts}
            onSelectionChange={setSelectedContacts}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSend} disabled={isSending} size="lg" className="gap-2 bg-orange-600 hover:bg-orange-700">
          {isSending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send Newsletter
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
