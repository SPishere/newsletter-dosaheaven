import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { subject, messageBody, contactIds } = await request.json()

    if (!subject || !messageBody || !contactIds || contactIds.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create newsletter record
    const { data: newsletter, error: newsletterError } = await supabase
      .from("newsletters")
      .insert({
        user_id: user.id,
        subject,
        message_body: messageBody,
        total_recipients: contactIds.length,
      })
      .select()
      .single()

    if (newsletterError) {
      console.error("Error creating newsletter:", newsletterError)
      return NextResponse.json({ error: "Failed to create newsletter" }, { status: 500 })
    }

    // Create recipient records
    const recipients = contactIds.map((contactId: number) => ({
      newsletter_id: newsletter.id,
      contact_id: contactId,
    }))

    const { error: recipientsError } = await supabase.from("newsletter_recipients").insert(recipients)

    if (recipientsError) {
      console.error("Error creating recipients:", recipientsError)
      return NextResponse.json({ error: "Failed to record recipients" }, { status: 500 })
    }

    // In a real application, you would send actual emails here
    // For now, we're just recording the newsletter in the database

    return NextResponse.json({
      success: true,
      newsletterId: newsletter.id,
      recipientCount: contactIds.length,
    })
  } catch (error) {
    console.error("Error sending newsletter:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
