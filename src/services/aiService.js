/**
 * AI Content Generation Service
 * Uses OpenRouter API (free tier available) or any OpenAI-compatible API
 * 
 * Setup:
 * 1. Get a free API key from https://openrouter.ai/
 * 2. Add VITE_AI_API_KEY to your .env.local file
 * 3. Optionally configure VITE_AI_MODEL and VITE_AI_API_URL
 */

// Get API configuration dynamically
const getAIConfig = () => {
  // Check if using Azure OpenAI or standard OpenAI/OpenRouter
  const isAzure = import.meta.env.VITE_AI_PROVIDER === 'azure' || 
                  import.meta.env.VITE_AI_API_URL?.includes('azure') ||
                  import.meta.env.VITE_AI_API_URL?.includes('openai.azure.com');
  
  const config = {
    apiKey: import.meta.env.VITE_AI_API_KEY || '',
    model: import.meta.env.VITE_AI_MODEL || 'gpt-3.5-turbo',
    apiUrl: import.meta.env.VITE_AI_API_URL || 'https://api.openai.com/v1/chat/completions',
    isAzure: isAzure,
    apiVersion: import.meta.env.VITE_AI_API_VERSION || '2024-02-15-preview',
  };

  return config;
};

/**
 * Generate content variants using AI
 * @param {Object} params - Generation parameters
 * @param {string} params.prompt - The system/user prompt
 * @returns {Promise<Array>} Array of content variants
 */
export async function generateContent(params) {
  const config = getAIConfig();
  
  if (!config.apiKey) {
    throw new Error(
      'AI API key not configured. Please add VITE_AI_API_KEY to your .env.local file.'
    );
  }

  try {
    // Build headers based on provider
    const headers = {
      'Content-Type': 'application/json',
    };

    if (config.isAzure) {
      // Azure OpenAI authentication
      headers['api-key'] = config.apiKey;
    } else {
      // OpenAI/OpenRouter authentication
      headers['Authorization'] = `Bearer ${config.apiKey}`;
      headers['HTTP-Referer'] = window.location.origin;
      headers['X-Title'] = 'Creative Studio OS';
    }

    // Build the request URL (Azure needs API version in URL)
    const requestUrl = config.isAzure 
      ? `${config.apiUrl}/openai/deployments/${config.model}/chat/completions?api-version=${config.apiVersion}`
      : config.apiUrl;

    const response = await fetch(requestUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: params.prompt,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.8,
        max_completion_tokens: 2000, // Azure OpenAI uses this instead of max_tokens
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || `AI API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content generated from AI');
    }

    // Parse the JSON response
    const parsed = JSON.parse(content);
    
    if (!parsed.variants || !Array.isArray(parsed.variants)) {
      throw new Error('Invalid response format from AI');
    }

    return parsed.variants;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Failed to parse AI response. The model may not support JSON output.');
    }
    throw error;
  }
}

/**
 * Save content to history (using Supabase directly)
 * @param {Object} historyData - History entry data
 * @returns {Promise<Object>} Created history entry
 */
export async function saveToHistory(historyData, supabase) {
  if (!supabase) {
    console.warn('Supabase client not available, skipping history save');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('content_history')
      .insert({
        topic: historyData.topic,
        persona: historyData.persona,
        persona_label: historyData.persona_label,
        content_type: historyData.content_type,
        tone: historyData.tone,
        length: historyData.length,
        keywords: historyData.keywords,
        variants: historyData.variants,
        status: historyData.status || 'completed',
        created_date: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.warn('Failed to save to history:', error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.warn('History save error:', error);
    return null;
  }
}

/**
 * Fetch content history from Supabase
 * @param {Object} supabase - Supabase client
 * @param {number} limit - Number of entries to fetch
 * @returns {Promise<Array>} Array of history entries
 */
export async function fetchHistory(supabase, limit = 50) {
  if (!supabase) {
    throw new Error('Supabase client not available');
  }

  const { data, error } = await supabase
    .from('content_history')
    .select('*')
    .order('created_date', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch history: ${error.message}`);
  }

  return data || [];
}

/**
 * Delete content history entry
 * @param {Object} supabase - Supabase client
 * @param {string} id - Entry ID
 * @returns {Promise<void>}
 */
export async function deleteHistoryEntry(supabase, id) {
  if (!supabase) {
    throw new Error('Supabase client not available');
  }

  const { error } = await supabase
    .from('content_history')
    .update({ status: 'deleted', deleted_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete entry: ${error.message}`);
  }
}
