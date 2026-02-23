
import { BrevoClient } from '@getbrevo/brevo'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') })

async function listTemplates(apiKey: string | undefined, label: string) {
    if (!apiKey) {
        console.error(`${label} not found`)
        return
    }

    const client = new BrevoClient({ apiKey })

    try {
        console.log(`\nFetching transactional email templates for ${label}...`)
        const response = await client.transactionalEmails.getSmtpTemplates({
            templateStatus: true,
            limit: 100,
            offset: 0
        })

        console.log(`--- BREVO TEMPLATES (${label}) ---`)
        if (response.templates && response.templates.length > 0) {
            response.templates.forEach(t => {
                console.log(`[${t.id}] ${t.name} (Status: ${t.isActive ? 'Active' : 'Inactive'})`)
            })
        } else {
            console.log('No templates found.')
        }
    } catch (error: any) {
        console.error(`Error fetching templates for ${label}:`, error.message || error)
    }
}

async function run() {
    // Test 1: BREVO_API_KEY
    await listTemplates(process.env.BREVO_API_KEY, 'BREVO_API_KEY')

    // Test 2: BREVO_MCP_KEY (decoded)
    let mcpApiKey: string | undefined
    if (process.env.BREVO_MCP_KEY) {
        try {
            const decoded = JSON.parse(Buffer.from(process.env.BREVO_MCP_KEY, 'base64').toString())
            mcpApiKey = decoded.api_key
        } catch (e) {
            console.error('Error decoding BREVO_MCP_KEY')
        }
    }
    await listTemplates(mcpApiKey, 'BREVO_MCP_KEY (decoded)')
}

run()
