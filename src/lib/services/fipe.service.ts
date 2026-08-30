import { parseFipePriceToNumber } from "../calculations";

const FIPE_BASE_URL =
  process.env.FIPE_API_BASE_URL || "https://parallelum.com.br/fipe/api/v1";

// Cache em memória simples para marcas e modelos (TTL: 24 horas)
const memoryCache = new Map<string, { data: any; expiresAt: number }>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

async function fetchWithCache<T>(url: string): Promise<T> {
  const now = Date.now();
  const cached = memoryCache.get(url);

  if (cached && cached.expiresAt > now) {
    return cached.data as T;
  }

  const response = await fetch(url, {
    headers: {
      "User-Agent": "CarZ-App/1.0",
      Accept: "application/json",
    },
    // Next.js Data Cache
    ...({ next: { revalidate: 86400 } } as any),
  });

  if (!response.ok) {
    throw new Error(`Erro na API FIPE (${response.status}): ${response.statusText}`);
  }

  const data = (await response.json()) as T;
  memoryCache.set(url, { data, expiresAt: now + CACHE_TTL_MS });
  return data;
}

export interface FipeBrand {
  codigo: string;
  nome: string;
}

export interface FipeModelItem {
  codigo: number;
  nome: string;
}

export interface FipeModelsResponse {
  modelos: FipeModelItem[];
  anos: { codigo: string; nome: string }[];
}

export interface FipeYearItem {
  codigo: string;
  nome: string;
}

export interface FipeVehicleDetails {
  TipoVeiculo: number;
  Valor: string;
  Marca: string;
  Modelo: string;
  AnoModelo: number;
  Combustivel: string;
  CodigoFipe: string;
  MesReferencia: string;
  SiglaCombustivel: string;
  DataConsulta: string;
  // Campo computado pelo CarZ
  valorNumerico?: number;
}

export class FipeService {
  /**
   * 1. Lista todas as marcas de carros disponíveis na FIPE
   */
  static async getBrands(): Promise<FipeBrand[]> {
    return fetchWithCache<FipeBrand[]>(`${FIPE_BASE_URL}/carros/marcas`);
  }

  /**
   * 2. Lista os modelos de uma marca selecionada
   */
  static async getModels(brandCode: string): Promise<FipeModelsResponse> {
    return fetchWithCache<FipeModelsResponse>(
      `${FIPE_BASE_URL}/carros/marcas/${brandCode}/modelos`
    );
  }

  /**
   * 3. Lista os anos disponíveis para um modelo selecionado
   */
  static async getYears(
    brandCode: string,
    modelCode: string | number
  ): Promise<FipeYearItem[]> {
    return fetchWithCache<FipeYearItem[]>(
      `${FIPE_BASE_URL}/carros/marcas/${brandCode}/modelos/${modelCode}/anos`
    );
  }

  /**
   * 4. Obtém o valor e ficha técnica oficial da FIPE para o ano selecionado
   */
  static async getValuation(
    brandCode: string,
    modelCode: string | number,
    yearCode: string
  ): Promise<FipeVehicleDetails> {
    const data = await fetchWithCache<FipeVehicleDetails>(
      `${FIPE_BASE_URL}/carros/marcas/${brandCode}/modelos/${modelCode}/anos/${yearCode}`
    );

    return {
      ...data,
      valorNumerico: parseFipePriceToNumber(data.Valor),
    };
  }
}
