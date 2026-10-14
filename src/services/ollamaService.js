/**
 * Ollama Service
 * Handles communication with local Ollama instance (http://localhost:11434).
 * Completely local-first: no third-party API keys or cloud dependencies.
 */

class OllamaService {
  constructor() {
    this.baseUrl = process.env.OLLAMA_HOST || 'http://localhost:11434';
    this.currentModel = process.env.OLLAMA_MODEL || 'qwen2.5-coder';
    this.isConnected = false;
    this.lastChecked = null;
  }

  setEndpoint(url, model) {
    if (url) {
      // Normalize url
      this.baseUrl = url.trim().replace(/\/+$/, '');
    }
    if (model) {
      this.currentModel = model.trim();
    }
  }

  /**
   * Check connection status to Ollama
   */
  async checkStatus(customUrl = null) {
    const url = (customUrl || this.baseUrl).replace(/\/+$/, '');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    try {
      const response = await fetch(`${url}/api/tags`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        this.isConnected = false;
        return {
          connected: false,
          url,
          error: `Ollama returned HTTP status ${response.status} (${response.statusText})`,
          models: []
        };
      }

      const data = await response.json();
      const models = Array.isArray(data.models) ? data.models.map(m => ({
        name: m.name,
        size: m.size,
        modified_at: m.modified_at,
        digest: m.digest?.substring(0, 12)
      })) : [];

      this.isConnected = true;
      this.lastChecked = new Date();
      this.baseUrl = url;

      // If currentModel is not in list, pick the first or qwen2.5-coder if available
      const modelNames = models.map(m => m.name);
      if (models.length > 0 && !modelNames.some(n => n.startsWith(this.currentModel))) {
        // pick qwen or coder model if present, otherwise first
        const coderModel = modelNames.find(n => n.includes('coder') || n.includes('qwen'));
        this.currentModel = coderModel || modelNames[0];
      }

      return {
        connected: true,
        url: this.baseUrl,
        currentModel: this.currentModel,
        models,
        checkedAt: this.lastChecked
      };
    } catch (err) {
      clearTimeout(timeoutId);
      this.isConnected = false;
      let humanMessage = 'Ollama is unreachable.';
      if (err.name === 'AbortError') {
        humanMessage = 'Connection to Ollama timed out. Ensure "ollama serve" is running.';
      } else if (err.code === 'ECONNREFUSED' || err.message?.includes('ECONNREFUSED')) {
        humanMessage = 'Connection refused at ' + url + '. Is Ollama running?';
      } else {
        humanMessage = err.message || 'Unknown network error connecting to Ollama.';
      }

      return {
        connected: false,
        url,
        error: humanMessage,
        models: []
      };
    }
  }

  /**
   * Fetch available models
   */
  async listModels(customUrl = null) {
    const status = await this.checkStatus(customUrl);
    return status.models || [];
  }

  /**
   * Generate text via Ollama /api/generate
   */
  async generate(prompt, systemPrompt = '', options = {}) {
    const controller = new AbortController();
    const timeout = options.timeout || 35000;
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const modelToUse = options.model || this.currentModel;

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: modelToUse,
          prompt,
          system: systemPrompt,
          stream: false,
          options: {
            temperature: options.temperature ?? 0.2,
            top_p: options.top_p ?? 0.9,
            num_ctx: options.num_ctx ?? 4096
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Ollama generation failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        response: data.response,
        model: modelToUse,
        totalDuration: data.total_duration,
        evalCount: data.eval_count
      };
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  }

  /**
   * Chat completion via Ollama /api/chat
   */
  async chat(messages, options = {}) {
    const controller = new AbortController();
    const timeout = options.timeout || 35000;
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const modelToUse = options.model || this.currentModel;

    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: modelToUse,
          messages,
          stream: false,
          options: {
            temperature: options.temperature ?? 0.2,
            num_ctx: options.num_ctx ?? 4096
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Ollama chat failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        message: data.message,
        model: modelToUse,
        totalDuration: data.total_duration
      };
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  }
}

module.exports = new OllamaService();
