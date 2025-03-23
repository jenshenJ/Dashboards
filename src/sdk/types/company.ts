export type CompanyRecord = { 
    date: string,
    google_impressions: number,
    google_clicks: number,
    google_cost: number,
    direct_impressions: number,
    direct_clicks: number,
    direct_cost: number
}

export type Company = {
    kpiDataDirect: [{name: string, expected: number, real: number}][];
    kpiDataGoogle: [{name: string, expected: number, real: number}][];
    metrika: {
        google: {
            CTR: { value: string | number, title: string},
            CPC: { value: string | number, title: string},
            CPM: { value: string | number, title: string},
        },
        direct: {
            CTR: { value: string | number, title: string},
            CPC: { value: string | number, title: string},
            CPM: { value: string | number, title: string},
        }
    }
    id: string,
    text: string,
    data: CompanyRecord[],
}


export type GetCompaniesParams = {
    userId?: string, 
    startDate?: string,
    endDate?: string,
}