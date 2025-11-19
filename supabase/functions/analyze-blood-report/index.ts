import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { file, fileName, fileType } = await req.json();
    
    console.log('Analyzing blood report:', fileName, fileType);

    // Extract base64 content from data URL
    const base64Content = file.split(',')[1];
    
    // Prepare the prompt for AI analysis
    const systemPrompt = `You are a medical AI assistant specialized in analyzing blood test reports. 
    Analyze the provided blood report and identify any potential health issues, particularly focusing on:
    - Iron deficiency (check hemoglobin, ferritin, serum iron levels)
    - Anemia indicators
    - White blood cell abnormalities
    - Platelet count issues
    - Other significant deviations from normal ranges
    
    For each issue found, provide:
    1. The specific issue name
    2. Severity level (high, medium, low, or normal)
    3. A clear description of the finding
    4. A practical recommendation
    
    Return your analysis as a JSON array of objects with this structure:
    [
      {
        "issue": "Issue name",
        "severity": "high|medium|low|normal",
        "description": "Clear description",
        "recommendation": "Practical advice"
      }
    ]
    
    If the report shows all values in normal range, return a single item indicating good health.`;

    const userPrompt = fileType.includes('image') 
      ? `Analyze this blood test report image and identify any health issues.`
      : `Analyze this blood test report document (${fileType}) and identify any health issues.`;

    // Call Lovable AI gateway
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const messages: any[] = [
      { role: 'system', content: systemPrompt },
      { 
        role: 'user', 
        content: fileType.includes('image')
          ? [
              { type: 'text', text: userPrompt },
              { 
                type: 'image_url', 
                image_url: { 
                  url: file 
                } 
              }
            ]
          : userPrompt + '\n\nFile content: ' + base64Content
      }
    ];

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Gateway error:', aiResponse.status, errorText);
      throw new Error(`AI analysis failed: ${errorText}`);
    }

    const aiData = await aiResponse.json();
    const analysisText = aiData.choices[0].message.content;
    
    console.log('AI Analysis:', analysisText);

    // Parse the JSON response from AI
    let results;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = analysisText.match(/```json\s*([\s\S]*?)\s*```/) || 
                        analysisText.match(/\[[\s\S]*\]/);
      const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : analysisText;
      results = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Fallback: create a generic result
      results = [{
        issue: "Analysis Complete",
        severity: "low",
        description: analysisText.substring(0, 200),
        recommendation: "Please consult with your healthcare provider for detailed interpretation."
      }];
    }

    return new Response(
      JSON.stringify({ results }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in analyze-blood-report function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        results: [{
          issue: "Analysis Error",
          severity: "high",
          description: "Failed to analyze the report. Please ensure the file is a valid blood report.",
          recommendation: "Try uploading a different file or contact support if the issue persists."
        }]
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  }
});
