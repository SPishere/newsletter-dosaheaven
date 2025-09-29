"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

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

type ContactsTableProps = {
  contacts: Contact[]
  selectedContacts: number[]
  onSelectionChange: (selected: number[]) => void
}

export function ContactsTable({ contacts, selectedContacts, onSelectionChange }: ContactsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [countryFilter, setCountryFilter] = useState<string>("all")
  const [subscribedFilter, setSubscribedFilter] = useState<string>("all")
  const [activeFilter, setActiveFilter] = useState<string>("all")

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCountry = countryFilter === "all" || contact.country === countryFilter

    const matchesSubscribed =
      subscribedFilter === "all" ||
      (subscribedFilter === "true" && contact.subscribed_newsletters) ||
      (subscribedFilter === "false" && !contact.subscribed_newsletters)

    const matchesActive =
      activeFilter === "all" ||
      (activeFilter === "true" && contact.is_active) ||
      (activeFilter === "false" && !contact.is_active)

    return matchesSearch && matchesCountry && matchesSubscribed && matchesActive
  })

  const uniqueCountries = Array.from(new Set(contacts.map((c) => c.country))).sort()

  const toggleContact = (id: number) => {
    if (selectedContacts.includes(id)) {
      onSelectionChange(selectedContacts.filter((cid) => cid !== id))
    } else {
      onSelectionChange([...selectedContacts, id])
    }
  }

  const toggleAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      onSelectionChange([])
    } else {
      onSelectionChange(filteredContacts.map((c) => c.id))
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={countryFilter} onValueChange={setCountryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            {uniqueCountries.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={subscribedFilter} onValueChange={setSubscribedFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Subscription status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subscribers</SelectItem>
            <SelectItem value="true">Subscribed</SelectItem>
            <SelectItem value="false">Not Subscribed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={activeFilter} onValueChange={setActiveFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Active status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={filteredContacts.length > 0 && selectedContacts.length === filteredContacts.length}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No contacts found
                </TableCell>
              </TableRow>
            ) : (
              filteredContacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedContacts.includes(contact.id)}
                      onCheckedChange={() => toggleContact(contact.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {contact.first_name} {contact.last_name}
                  </TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.country}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {contact.subscribed_newsletters && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          Subscribed
                        </Badge>
                      )}
                      {contact.is_active ? (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                          Inactive
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        {selectedContacts.length} of {filteredContacts.length} contacts selected
      </div>
    </div>
  )
}
