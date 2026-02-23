// Native fetch is available in Node 18+

async function testRegistration() {
    const url = 'http://localhost:3000/api/vendors/register';

    const payload = {
        id: `test_${Date.now()}`,
        business_name: "Test Coffee Cart",
        specialty: "Organic Espresso",
        description: "This is a test description that is at least thirty characters long because that is required.",
        suburbs: ["CBD"],
        price_min: 100,
        price_max: 300,
        capacity_min: 50,
        capacity_max: 200,
        event_types: ["Wedding"],
        contact_name: "Test User",
        contact_email: "test@example.com",
        contact_phone: "0400000000",
        website: "example.com"
    };

    console.log('Sending payload to:', url);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        console.log('Status:', response.status);
        const data = await response.json();
        console.log('Response:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

testRegistration();
