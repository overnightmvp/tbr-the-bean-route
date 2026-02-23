'use client'

import { useState, useEffect } from 'react'

const DOC_FILES = [
    { name: 'Operator Hub', file: 'OPERATOR_HUB.md' },
    { name: 'Agile Backlog', file: 'AGILE_BACKLOG.md' },
    { name: 'Customer Journeys', file: 'CUSTOMER_JOURNEY_MAPS.md' },
    { name: 'Design System', file: 'DESIGN_SYSTEM_GUIDE.md' },
    { name: 'Content Strategy', file: 'CONTENT_STRATEGY_HUB.md' }
]

export default function DocsTab() {
    const [selectedFile, setSelectedFile] = useState(DOC_FILES[0])
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchDoc = async () => {
            setLoading(true)
            setError('')
            try {
                const response = await fetch(`/api/admin/docs?file=${selectedFile.file}`)
                if (!response.ok) throw new Error('Failed to fetch document')
                const data = await response.json()
                setContent(data.content || '')
            } catch (err) {
                console.error('Error fetching doc:', err)
                setError('Failed to load document content.')
            } finally {
                setLoading(false)
            }
        }

        fetchDoc()
    }, [selectedFile])

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[800px]">
            {/* Sidebar */}
            <div className="w-full lg:w-64 flex-shrink-0">
                <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
                    <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50 text-xs font-semibold text-neutral-500 uppercase">
                        Documents
                    </div>
                    <div className="p-2 space-y-1">
                        {DOC_FILES.map((doc) => (
                            <button
                                key={doc.file}
                                onClick={() => setSelectedFile(doc)}
                                className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${selectedFile.file === doc.file
                                    ? 'bg-[#3B2A1A] text-white'
                                    : 'text-neutral-600 hover:bg-neutral-100'
                                    }`}
                            >
                                {doc.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                    <p className="text-xs text-yellow-800">
                        <strong>Tip:</strong> These documents are stored in the <code>/docs</code> folder of your repository.
                    </p>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-grow bg-white rounded-lg border border-neutral-200 flex flex-col overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-neutral-900">{selectedFile.name}</h2>
                    <span className="text-xs text-neutral-400">Viewing: {selectedFile.file}</span>
                </div>

                <div className="flex-grow p-6 overflow-y-auto bg-[#FDFDFB]">
                    {loading ? (
                        <div className="flex items-center justify-center h-full text-neutral-500">
                            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Loading content...
                        </div>
                    ) : error ? (
                        <div className="text-red-500 text-center py-10">{error}</div>
                    ) : (
                        <div className="prose prose-neutral max-w-none">
                            <pre className="whitespace-pre-wrap font-sans text-neutral-800 leading-relaxed text-sm">
                                {content}
                            </pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
