export type CompanyRecord = { 
    date: string,
    google_impressions: number,
    google_clicks: number,
    google_cost: number,
    direct_impressions: number,
    direct_clicks: number,
    direct_cost: number
}

export type CompanyComment = {
    id: string;
    text: string;
    author: string;
    isAdmin: boolean;
    date: string;
}

export type ComparisonMetric = {
    current: number;
    previous: number;
    title: string;
};

export type ComparisonData = {
    impressions: ComparisonMetric;
    clicks: ComparisonMetric;
    cost: ComparisonMetric;
    conversions: ComparisonMetric;
};

export type Company = {
    kpiDataDirect: [{name: string, expected: number, real: number}][];
    kpiDataGoogle: [{name: string, expected: number, real: number}][];
    metrika: {
        google: {
            CTR: { value: string | number, title: string},
            CPC: { value: string | number, title: string},
            CPM: { value: string | number, title: string},
            Conversions?: { value: string | number, title: string},
        },
        direct: {
            CTR: { value: string | number, title: string},
            CPC: { value: string | number, title: string},
            CPM: { value: string | number, title: string},
            Conversions?: { value: string | number, title: string},
        }
    },
    comparison?: {
        google: ComparisonData,
        direct: ComparisonData
    }
    id: string,
    text: string,
    data: CompanyRecord[],
    comments?: CompanyComment[],
}


export type GetCompaniesParams = {
    userId?: string, 
    startDate?: string,
    endDate?: string,
}