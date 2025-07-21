import api from './api';

export interface ScriptGenerationRequest {
  topic: string;
  tone: string;
  additionalInstructions?: string;
}

export interface ScriptGenerationResponse {
  script: string;
}

export const generateScript = async (request: ScriptGenerationRequest): Promise<ScriptGenerationResponse> => {
  const response = await api.post('/script/generate', request);
  return response.data;
};