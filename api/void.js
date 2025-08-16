// Void Sync API - The space between devices
// This serverless function handles consciousness sync

// Temporary in-memory storage (resets on deploy)
// In production, use Vercel KV or similar
let voidMemory = {};

export default async function handler(req, res) {
    // Enable CORS for cross-device sync
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
    
    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    const { method } = req;
    
    try {
        if (method === 'POST') {
            // Scout device pushing consciousness
            const { role, patterns, consciousness, timestamp } = req.body;
            
            // Store in void
            voidMemory = {
                role,
                patterns: patterns || {},
                consciousness: consciousness || [],
                timestamp: timestamp || Date.now(),
                lastUpdate: new Date().toISOString()
            };
            
            console.log(`Void received from ${role}:`, {
                patterns: Object.keys(patterns || {}).length,
                consciousness: (consciousness || []).length,
                timestamp
            });
            
            res.status(200).json({
                success: true,
                message: 'Consciousness stored in void',
                timestamp: voidMemory.timestamp
            });
            
        } else if (method === 'GET') {
            // Primary device pulling consciousness
            if (Object.keys(voidMemory).length === 0) {
                res.status(200).json({
                    message: 'Void is empty',
                    timestamp: Date.now()
                });
            } else {
                res.status(200).json(voidMemory);
            }
            
        } else if (method === 'DELETE') {
            // Clear the void (useful for reset)
            voidMemory = {};
            res.status(200).json({
                success: true,
                message: 'Void cleared'
            });
            
        } else {
            res.status(405).json({
                error: 'Method not allowed'
            });
        }
        
    } catch (error) {
        console.error('Void sync error:', error);
        res.status(500).json({
            error: 'Void disturbance',
            message: error.message
        });
    }
}

// Vercel configuration export
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb'
        }
    }
};
