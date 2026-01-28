import axios from 'axios';

const CHEAPSHARK_API = 'https://www.cheapshark.com/api/1.0';

export interface CheapSharkDeal {
    gameID: string;
    title: string;
    thumb: string;
    salePrice: string;
    normalPrice: string;
    savings: string;
    steamRatingPercent: string;
    metacriticScore: string;
    dealID: string;
    storeID: string;
}

export interface CatalogGame {
    id: string;
    title: string;
    image: string;
    price: number;
    originalPrice: number;
    discount: number;
    rating: number;
    storeID: string;
    dealID: string;
}

export type SortOption = 'title' | 'price' | 'savings' | 'rating';
export type Platform = 'all' | 'pc' | 'playstation' | 'xbox';

interface SearchParams {
    search?: string;
    sortBy?: SortOption;
    pageNumber?: number;
    pageSize?: number;
    upperPrice?: number;
}

const cheapsharkInstance = axios.create({
    baseURL: CHEAPSHARK_API,
    timeout: 15000,
});

function mapDealToGame(deal: CheapSharkDeal): CatalogGame {
    return {
        id: deal.gameID,
        title: deal.title,
        image: deal.thumb,
        price: parseFloat(deal.salePrice),
        originalPrice: parseFloat(deal.normalPrice),
        discount: Math.round(parseFloat(deal.savings)),
        rating: parseInt(deal.steamRatingPercent) || parseInt(deal.metacriticScore) || 0,
        storeID: deal.storeID,
        dealID: deal.dealID,
    };
}

export async function searchDeals(params: SearchParams = {}): Promise<CatalogGame[]> {
    const { search, sortBy = 'savings', pageNumber = 0, pageSize = 60, upperPrice } = params;

    const queryParams: Record<string, string | number> = {
        sortBy,
        pageNumber,
        pageSize,
    };

    if (search) queryParams.title = search;
    if (upperPrice) queryParams.upperPrice = upperPrice;

    const response = await cheapsharkInstance.get<CheapSharkDeal[]>('/deals', { params: queryParams });
    return response.data.map(mapDealToGame);
}

export function getDealUrl(dealID: string): string {
    return `https://www.cheapshark.com/redirect?dealID=${dealID}`;
}
