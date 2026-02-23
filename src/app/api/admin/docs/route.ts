import { NextRequest, NextResponse } from 'next/server'
import { getCurrentAdmin } from '@/lib/admin'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    try {
        const session = await getCurrentAdmin()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const fileName = searchParams.get('file')

        if (!fileName) {
            return NextResponse.json({ error: 'File name required' }, { status: 400 })
        }

        // Security: Only allow specific files in docs directory
        const allowedFiles = [
            'OPERATOR_HUB.md',
            'CONTENT_STRATEGY_HUB.md',
            'AGILE_BACKLOG.md',
            'CUSTOMER_JOURNEY_MAPS.md',
            'DESIGN_SYSTEM_GUIDE.md'
        ]
        if (!allowedFiles.includes(fileName)) {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 })
        }

        const filePath = path.join(process.cwd(), 'docs', fileName)

        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 })
        }

        const content = fs.readFileSync(filePath, 'utf8')
        return NextResponse.json({ content })
    } catch (error) {
        console.error('Error in docs route:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
