export interface AxiosTimeout {
  timeout: number
}

export const DEF_API_TIMEOUT: number = 2000 as const
export const DEF_AXIOS_TIMEOUT: AxiosTimeout = {
  timeout: DEF_API_TIMEOUT,
}
export const DEF_API_WAIT_RETRY: number = 500 as const
