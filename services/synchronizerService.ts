import WorkOrder from "@/models/WorkOrder";

export async function syncPendingOrders() {
    console.log("entrou ?")
    const osList = await httpRequest<WorkOrder[]>({
        method: 'GET',
        endpoint: "/api",
        BASE_URL: "https://ringless-equivalently-alijah.ngrok-free.dev/gerenciador"
        })
    console.log(typeof(osList))
    console.log("Conteúdo:", osList)
}


// definindo valores possíveis para 
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH';

//Empacotador da requisição
interface RequestOptions {
  method: HttpMethod;
  endpoint: string;
  body?: unknown;
  headers?: Record<string, string>;
  BASE_URL: String
}

export async function httpRequest<T>({method,endpoint,body,headers = {},BASE_URL}: RequestOptions): Promise <T>{

    const response = await fetch(`${BASE_URL}${endpoint}`, {      
        method,
        headers: {'Content-Type': 'application/json',...headers},
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`HTTP ${response.status} - ${errorBody || response.statusText}`);
    }

    return response.json() as Promise<T>;
}

    

export async function syncAllOrdersNotFinished() {}

export async function syncfilledOrders() {}

