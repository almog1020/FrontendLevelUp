import React from "react";
import type { TopDeal } from "../../../../services/apis/adminDashboard";
import styles from "./TopDealsCard.module.scss";

interface TopDealsCardProps {
  deals: TopDeal[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export const TopDealsCard: React.FC<TopDealsCardProps> = ({
  deals,
  loading,
  error,
  onRetry,
}) => {
  const formatPrice = (price: number, currency: string): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const handleDealClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (error) {
    return (
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Top Deals (60%+ Off)</h3>
          <p className={styles.subtitle}>
            Live deals from CheapShark filtered by 60%+ discount
          </p>
        </div>
        <div className={styles.cardContent}>
          <div className={styles.errorContainer}>
            <p className={styles.errorMessage}>{error}</p>
            <button
              type="button"
              className={styles.retryButton}
              onClick={onRetry}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Top Deals (60%+ Off)</h3>
        <p className={styles.subtitle}>
          Live deals from CheapShark filtered by 60%+ discount
        </p>
      </div>
      <div className={styles.cardContent}>
        {loading ? (
          <div className={styles.dealsList}>
            {[...Array(6)].map((_, index) => (
              <div key={index} className={styles.skeletonRow}>
                <div className={styles.skeletonLeftZone}>
                  <div className={styles.skeletonThumbnail} />
                  <div className={styles.skeletonDiscount} />
                </div>
                <div className={styles.skeletonContent}>
                  <div className={styles.skeletonTitle} />
                  <div className={styles.skeletonStore} />
                </div>
                <div className={styles.skeletonPrice} />
              </div>
            ))}
          </div>
        ) : deals.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No deals found with 60%+ discount</p>
          </div>
        ) : (
          <div className={styles.dealsList}>
            {deals.slice(0, 10).map((deal, index) => (
              <div
                key={`${deal.game.id}-${index}`}
                className={styles.dealRow}
                onClick={() => handleDealClick(deal.price.url)}
              >
                <div className={styles.leftZone}>
                  <div className={styles.thumbnailContainer}>
                    {deal.game.image_url ? (
                      <img
                        src={deal.game.image_url}
                        alt={deal.game.title}
                        className={styles.thumbnail}
                      />
                    ) : (
                      <div className={styles.thumbnailPlaceholder} />
                    )}
                  </div>
                  <div className={styles.discountPercent}>
                    -{Math.round(deal.discount_percent)}%
                  </div>
                </div>
                <div className={styles.middleZone}>
                  <div className={styles.gameTitle}>{deal.game.title}</div>
                  <div className={styles.storeName}>{deal.price.store}</div>
                </div>
                <div className={styles.rightZone}>
                  {deal.sale_price != null && (
                    <div className={styles.salePrice}>
                      {formatPrice(deal.sale_price, deal.price.currency)}
                    </div>
                  )}
                  {deal.normal_price != null && deal.normal_price > 0 && (
                    <div className={styles.normalPrice}>
                      {formatPrice(deal.normal_price, deal.price.currency)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

