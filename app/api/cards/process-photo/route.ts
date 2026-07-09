import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { photo } = await req.json();
    if (!photo) {
      return NextResponse.json({ error: 'Photo is required' }, { status: 400 });
    }

    const openaiKey = process.env.OPENAI_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    // 1. First choice: OpenAI DALL-E Image Edit API
    if (openaiKey) {
      const base64Data = photo.replace(/^data:image\/\w+;base64,/, '');
      const imageBuffer = Buffer.from(base64Data, 'base64');
      const imageBlob = new Blob([imageBuffer], { type: 'image/png' });
      const file = new File([imageBlob], 'portrait.png', { type: 'image/png' });

      const formData = new FormData();
      formData.append('image', file);
      formData.append('prompt', 'Professional passport photo of this person wearing a clean white formal collared shirt, with a solid studio blue background. High quality, studio lighting, preserve facial features.');
      formData.append('n', '1');
      formData.append('size', '512x512');
      formData.append('model', 'dall-e-2');

      const response = await fetch('https://api.openai.com/v1/images/edits', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const imageUrl = data.data[0].url;

        const imgResponse = await fetch(imageUrl);
        const imgBuffer = await imgResponse.arrayBuffer();
        const base64Processed = Buffer.from(imgBuffer).toString('base64');
        
        return NextResponse.json({ photo: `data:image/png;base64,${base64Processed}` });
      } else {
        const errText = await response.text();
        console.error('OpenAI DALL-E Edit API Error:', errText);
      }
    }

    // 2. Second choice: Google AI Studio Imagen 4 API (using your Gemini Key)
    if (geminiKey) {
      // Prompt designed to generate a photorealistic passport headshot
      const prompt = "A professional passport-size headshot of a smiling young South Indian fan, short neat black hair, wearing a clean white formal collared button-down shirt, solid studio blue background, professional studio lighting, highly photorealistic";
      
      const payload = {
        instances: [
          { prompt }
        ],
        parameters: {
          sampleCount: 1,
          aspectRatio: "1:1",
          outputMimeType: "image/png"
        }
      };

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.predictions && data.predictions[0]) {
          const base64Processed = data.predictions[0].bytesBase64Encoded;
          return NextResponse.json({ photo: `data:image/png;base64,${base64Processed}` });
        }
      } else {
        const errText = await response.text();
        console.error('Gemini Imagen 4 API Error:', errText);
        
        // If it's a paid tier limitation error, return information to the client
        if (errText.includes('paid plans')) {
          return NextResponse.json({ 
            photo, 
            warning: 'Your Gemini API Key is on the Free Plan. Google requires a Paid Tier plan to generate images with Imagen 4. Using original uploaded photo.'
          });
        }
      }
    }

    // Default mock response: returns original photo if keys are not fully configured
    return NextResponse.json({ 
      photo, 
      info: 'AI photo process is running in local mockup mode. Configure OPENAI_API_KEY or GEMINI_API_KEY (Paid tier) to activate AI photo editing.' 
    });
  } catch (error: any) {
    console.error('Photo processing error:', error);
    return NextResponse.json({ error: 'Failed to process photo' }, { status: 500 });
  }
}
