import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, accepted, noCount } = body;

        const webhookUrl = process.env.N8N_WEBHOOK_URL;

        if (!webhookUrl) {
            console.error("N8N_WEBHOOK_URL is not defined");
            // We still return success to the frontend so the UI updates
            return NextResponse.json({ success: true, message: "Webhook not configured but request received" });
        }

        // Send data to n8n
        // We don't await this if we want to be fast, but for reliability we should.
        // Given the user flow, a small delay is fine.
        try {
            await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    accepted,
                    noCount,
                    timestamp: new Date().toISOString(),
                    source: "valentine-app-v1"
                }),
            });
        } catch (webhookError) {
            console.error("Failed to call n8n webhook:", webhookError);
            // We suppress the error for the user
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
