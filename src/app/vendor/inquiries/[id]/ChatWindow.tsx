'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Message, Inquiry } from '@/lib/supabase'

export default function ChatWindow({ inquiry, vendorId }: { inquiry: Inquiry, vendorId: string }) {
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [isSending, setIsSending] = useState(false)
    const supabase = createClient()
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Scroll to bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    useEffect(() => {
        // Initial fetch
        const fetchMessages = async () => {
            const { data } = await supabase
                .from('messages')
                .select('*')
                .eq('inquiry_id', inquiry.id)
                .order('created_at', { ascending: true })

            if (data) setMessages(data)
        }

        fetchMessages()

        // Setup realtime subscription
        const channel = supabase
            .channel(`inquiry-${inquiry.id}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `inquiry_id=eq.${inquiry.id}`
            }, (payload) => {
                const newMessage = payload.new as Message
                setMessages((prev) => [...prev, newMessage])
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [inquiry.id, supabase])

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || isSending) return

        setIsSending(true)

        const { error } = await supabase
            .from('messages')
            .insert({
                inquiry_id: inquiry.id,
                sender_id: vendorId,
                sender_type: 'vendor',
                content: newMessage.trim()
            })

        if (!error) {
            // Send push notification to the client (assuming client has subscribed)
            fetch('/api/push/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: `New message from ${inquiry.vendor_id}`,
                    body: newMessage.trim(),
                    url: `/inquiries/${inquiry.id}`,
                    targetUserId: inquiry.contact_email // Sending push to client's email identifier
                })
            }).catch(console.error)

            setNewMessage('')
        } else {
            console.error('Failed to send message:', error)
            alert('Failed to send message. Please try again.')
        }

        setIsSending(false)
    }

    return (
        <div className="flex flex-col h-[500px] bg-gray-50 rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200 bg-white rounded-t-lg">
                <h3 className="text-lg font-medium text-gray-900">Direct Message</h3>
                <p className="text-sm text-gray-500">Chat with {inquiry.contact_name}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                        <p className="text-gray-500 text-sm">No messages yet. Send a message to start the conversation!</p>
                    </div>
                ) : (
                    messages.map((message) => {
                        const isVendor = message.sender_type === 'vendor'
                        return (
                            <div key={message.id} className={`flex ${isVendor ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`max-w-[75%] rounded-lg px-4 py-2 ${isVendor
                                        ? 'bg-amber-600 text-white rounded-br-none'
                                        : 'bg-white border border-gray-200 text-gray-900 rounded-bl-none shadow-sm'
                                        }`}
                                >
                                    <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                                    <span className={`text-[10px] mt-1 block ${isVendor ? 'text-amber-200' : 'text-gray-400'}`}>
                                        {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        )
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-gray-200 rounded-b-lg">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                        disabled={isSending}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || isSending}
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-amber-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {isSending ? 'Sending...' : 'Send'}
                    </button>
                </form>
            </div>
        </div>
    )
}
