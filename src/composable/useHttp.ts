import { ref } from 'vue';

interface HttpRequestOptions {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    body?: any;
}

export function useHttp() {
    const data = ref<any>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const success = ref(false);

    async function fetchData({ url, method = 'GET', headers = {}, body }: HttpRequestOptions) {
        loading.value = true;
        error.value = null;
        success.value = false;

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', ...headers },
                body: body ? JSON.stringify(body) : undefined,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            data.value = await response.json();
            success.value = true;
        } catch (err: any) {
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    }

    return { data, loading, error, success, fetchData };
}
